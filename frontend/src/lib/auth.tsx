'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, getAccessToken, clearTokens } from './api';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = getAccessToken();
        if (token) {
            // Try to decode JWT to get user info (without validation)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.userId, email: payload.email, name: '' });
            } catch {
                clearTokens();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        setUser(data.user);
    };

    const register = async (email: string, password: string, name: string) => {
        const data = await authApi.register(email, password, name);
        setUser(data.user);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
