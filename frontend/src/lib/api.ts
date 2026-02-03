const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to get tokens from localStorage
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Refresh the access token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

// Main API request function with auto token refresh
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const makeRequest = async (token: string | null) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let accessToken = getAccessToken();
  let response = await makeRequest(accessToken);

  // If 401, try to refresh token
  if (response.status === 401 && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await makeRequest(newToken);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  register: async (email: string, password: string, name: string) => {
    const data = await apiRequest<{
      message: string;
      user: { id: string; email: string; name: string };
      accessToken: string;
      refreshToken: string;
    }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest<{
      message: string;
      user: { id: string; email: string; name: string };
      accessToken: string;
      refreshToken: string;
    }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiRequest('/api/v1/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Ignore errors on logout
      }
    }
    clearTokens();
  },
};

// Profile API functions
export const profileApi = {
  get: () =>
    apiRequest<{
      id: string;
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }>('/api/v1/me'),

  update: (data: { name?: string; email?: string }) =>
    apiRequest<{
      message: string;
      user: {
        id: string;
        email: string;
        name: string;
        createdAt: string;
        updatedAt: string;
      };
    }>('/api/v1/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Task API functions
export const taskApi = {
  getAll: (params: { page?: number; limit?: number; status?: string; q?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);
    if (params.q) searchParams.set('q', params.q);
    
    const query = searchParams.toString();
    return apiRequest<{
      tasks: Array<{
        id: string;
        title: string;
        description: string | null;
        status: 'TODO' | 'IN_PROGRESS' | 'DONE';
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/api/v1/tasks${query ? `?${query}` : ''}`);
  },

  get: (id: string) =>
    apiRequest<{
      id: string;
      title: string;
      description: string | null;
      status: 'TODO' | 'IN_PROGRESS' | 'DONE';
      createdAt: string;
      updatedAt: string;
    }>(`/api/v1/tasks/${id}`),

  create: (data: { title: string; description?: string; status?: string }) =>
    apiRequest<{
      id: string;
      title: string;
      description: string | null;
      status: 'TODO' | 'IN_PROGRESS' | 'DONE';
      createdAt: string;
      updatedAt: string;
    }>('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { title?: string; description?: string; status?: string }) =>
    apiRequest<{
      id: string;
      title: string;
      description: string | null;
      status: 'TODO' | 'IN_PROGRESS' | 'DONE';
      createdAt: string;
      updatedAt: string;
    }>(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    }),

  toggle: (id: string) =>
    apiRequest<{
      id: string;
      title: string;
      description: string | null;
      status: 'TODO' | 'IN_PROGRESS' | 'DONE';
      createdAt: string;
      updatedAt: string;
    }>(`/api/v1/tasks/${id}/toggle`, {
      method: 'PATCH',
    }),
};

export { getAccessToken, clearTokens };

