# 📋 Task Management System

A full-stack Task Management System built with **Node.js/TypeScript** backend and **Next.js** frontend. This application allows users to register, login, and manage their personal tasks with full CRUD functionality.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### Authentication & Security
- 🔐 **User Registration** - Create new accounts with email and password
- 🔑 **Secure Login** - JWT-based authentication system
- 🔄 **Token Refresh** - Automatic access token renewal using refresh tokens
- 🚪 **Logout** - Secure session termination
- 🛡️ **Password Hashing** - bcrypt encryption for stored passwords

### Task Management
- ➕ **Create Tasks** - Add new tasks with title, description, and status
- 📋 **View Tasks** - List all tasks with pagination support
- ✏️ **Edit Tasks** - Update task details and status
- 🗑️ **Delete Tasks** - Remove tasks with confirmation dialog
- 🔄 **Toggle Status** - Quick cycle through TODO → IN_PROGRESS → DONE
- 🔍 **Search** - Find tasks by title
- 🏷️ **Filter** - Filter tasks by status (TODO, IN_PROGRESS, DONE)
- 📄 **Pagination** - Load tasks in batches for performance

### User Interface
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glassmorphism design with gradient backgrounds
- 🔔 **Toast Notifications** - Feedback for all operations
- ⚡ **Fast Loading** - Optimized performance with Next.js

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| Prisma | ORM for database |
| PostgreSQL | Database |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Zod | Request validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Context | State management |

---

## 📁 Project Structure

```
task-management-system/
├── backend/                          # Backend API
│   ├── prisma/
│   │   └── schema.prisma             # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # Auth handlers
│   │   │   └── task.controller.ts    # Task handlers
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT verification
│   │   │   └── error.middleware.ts   # Error handling
│   │   ├── routes/
│   │   │   ├── auth.routes.ts        # Auth endpoints
│   │   │   └── task.routes.ts        # Task endpoints
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts          # Token helpers
│   │   │   └── prisma.ts             # DB client
│   │   └── app.ts                    # Express app
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # Frontend App
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── register/page.tsx     # Register page
│   │   │   ├── dashboard/page.tsx    # Main dashboard
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Home (redirect)
│   │   │   └── globals.css           # Global styles
│   │   ├── components/
│   │   │   ├── TaskCard.tsx          # Task display
│   │   │   └── TaskForm.tsx          # Create/Edit form
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── auth.tsx              # Auth context
│   │   │   └── toast.tsx             # Toast notifications
│   │   └── types/
│   │       └── index.ts              # TypeScript types
│   ├── .env.local                    # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your PostgreSQL credentials:
```

**Edit `backend/.env`:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanagement?schema=public"
JWT_ACCESS_SECRET="your-secure-access-secret-key"
JWT_REFRESH_SECRET="your-secure-refresh-secret-key"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
PORT=3001
```

```bash
# Generate Prisma client
npx prisma generate

# Push database schema (creates tables)
npx prisma db push

# Start development server
npm run dev
```

✅ Backend will be running at `http://localhost:3001`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

✅ Frontend will be running at `http://localhost:3000`

### 4. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Register a new account
3. Login with your credentials
4. Start managing your tasks!

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | No |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | Get all tasks | Yes |
| POST | `/tasks` | Create new task | Yes |
| GET | `/tasks/:id` | Get single task | Yes |
| PATCH | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| PATCH | `/tasks/:id/toggle` | Toggle task status | Yes |

### Query Parameters for GET /tasks

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter by status: TODO, IN_PROGRESS, DONE |
| `q` | string | Search by title |

### Request/Response Examples

**Register User:**
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Create Task:**
```bash
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "TODO"
}
```

---

## 🗄️ Database Schema

### User Model
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email |
| password | String | Hashed password |
| name | String | User's name |
| createdAt | DateTime | Account creation date |
| updatedAt | DateTime | Last update date |

### Task Model
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| title | String | Task title |
| description | String? | Optional description |
| status | Enum | TODO, IN_PROGRESS, DONE |
| userId | UUID | Foreign key to User |
| createdAt | DateTime | Creation date |
| updatedAt | DateTime | Last update date |

### RefreshToken Model
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| token | String | Unique token |
| userId | UUID | Foreign key to User |
| expiresAt | DateTime | Token expiry |
| createdAt | DateTime | Creation date |

---

## 🔧 Available Scripts

### Backend

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npx prisma studio  # Open Prisma database GUI
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🔒 Security Features

- **JWT Authentication**: Short-lived access tokens (15 min) with refresh token rotation
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **Protected Routes**: Middleware verification on all task endpoints
- **Input Validation**: Zod schemas validate all incoming requests
- **Error Handling**: Proper HTTP status codes and error messages

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Aryan Rai**

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
