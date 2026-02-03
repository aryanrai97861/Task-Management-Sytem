# 📋 Task Management System

A full-stack Task Management System built with **Node.js/TypeScript** backend and **Next.js** frontend. This application allows users to register, login, and manage their personal tasks with full CRUD functionality.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API Server |
| TypeScript | Type Safety |
| Prisma ORM | Database Access |
| PostgreSQL | Database |
| JWT | Authentication (Access + Refresh Tokens) |
| bcrypt | Password Hashing |
| Zod | Request Validation |
| express-rate-limit | Rate Limiting |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | React Framework |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| React Context | State Management |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/aryanrai97861/Task-Management-Sytem.git
cd Task-Management-Sytem

# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build
```

✅ Access the app at `http://localhost:3000`

### Option 2: Manual Setup

#### Prerequisites
- Node.js v18+
- PostgreSQL database

#### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
```

**Configure `backend/.env`:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskdb?schema=public"
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

```bash
# Setup database
npx prisma generate
npx prisma db push

# Start server
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Start server
npm run dev
```

✅ Backend: `http://localhost:3001` | Frontend: `http://localhost:3000`

---

## 🔑 Demo Credentials

Register a new account or use the seeding approach:

```bash
# Using the API directly (after backend is running)
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "demo123", "name": "Demo User"}'
```

**Demo Account:**
- Email: `demo@example.com`
- Password: `demo123`

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |

### Profile Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/me` | Get current user profile |
| PUT | `/api/v1/me` | Update profile |

### Task Endpoints (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get all tasks (paginated) |
| POST | `/api/v1/tasks` | Create new task |
| GET | `/api/v1/tasks/:id` | Get single task |
| PATCH | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| PATCH | `/api/v1/tasks/:id/toggle` | Toggle task status |

### Query Parameters for GET /tasks

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter: TODO, IN_PROGRESS, DONE |
| `q` | string | Search by title |

### Example Requests

**Register:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Task", "description": "Task details", "status": "TODO"}'
```

---

## 📦 Postman Collection

Import this collection in Postman:

```json
{
  "info": {
    "name": "Task Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3001/api/v1" },
    { "key": "token", "value": "" }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        { "name": "Register", "request": { "method": "POST", "url": "{{baseUrl}}/auth/register", "body": { "mode": "raw", "raw": "{\"email\": \"test@test.com\", \"password\": \"test123\", \"name\": \"Test\"}", "options": { "raw": { "language": "json" } } } } },
        { "name": "Login", "request": { "method": "POST", "url": "{{baseUrl}}/auth/login", "body": { "mode": "raw", "raw": "{\"email\": \"test@test.com\", \"password\": \"test123\"}", "options": { "raw": { "language": "json" } } } } }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        { "name": "Get All Tasks", "request": { "method": "GET", "url": "{{baseUrl}}/tasks", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } },
        { "name": "Create Task", "request": { "method": "POST", "url": "{{baseUrl}}/tasks", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "body": { "mode": "raw", "raw": "{\"title\": \"New Task\", \"status\": \"TODO\"}", "options": { "raw": { "language": "json" } } } } }
      ]
    }
  ]
}
```

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **Rate Limiting**: 100 req/15min general, 10 req/15min for auth
- **Protected Routes**: Middleware verification on all endpoints
- **Input Validation**: Zod schemas for all requests
- **CORS**: Configured for frontend origin

---

## 📈 Scaling for Production

**How would I scale this application for production?**

1. **Deployment**: Deploy backend on AWS ECS/Fargate or Railway, frontend on Vercel. Use managed PostgreSQL (AWS RDS, Supabase, or Neon).

2. **Environment Management**: Use environment-specific configs with secrets managed via AWS Secrets Manager or Doppler. Never commit `.env` files.

3. **Database Optimization**: Add indexes on frequently queried columns (already done for `userId`, `status`). Use connection pooling (PgBouncer) and read replicas for scaling reads.

4. **Caching**: Implement Redis for session storage, rate limiting state, and caching frequently accessed data (user profiles, task counts).

5. **Security Hardening**: Add Helmet.js for HTTP headers, implement HTTPS only, use HttpOnly cookies for tokens, add CSRF protection, and enable request logging with correlation IDs.

6. **Monitoring**: Add APM (DataDog/New Relic), structured logging (Winston/Pino), health checks, and alerting for error rates and latency.

---

## 📁 Project Structure

```
task-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, error, rate limiting
│   │   ├── routes/          # API routes
│   │   ├── utils/           # JWT, Prisma, Logger
│   │   └── app.ts           # Express app
│   ├── prisma/schema.prisma # Database schema
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   └── lib/             # API client, Auth, Toast
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 👨‍💻 Author

**Aryan Rai**

---

## 📝 License

MIT License
