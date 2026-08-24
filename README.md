# CodeSync — Production Collaborative Coding Platform 🚀

A real-time, multi-user collaborative development environment built with **React 19, Monaco Editor, Node.js, Express, Socket.IO, and MongoDB**.

CodeSync allows developers, interviewers, and study groups to create instant collaborative workspaces, write code simultaneously with live remote cursors, communicate via real-time in-room chat, and execute programs across 8+ programming languages in a secure sandboxed environment.

---

## 🏗 System Architecture

```
                               ┌────────────────────────────────────────┐
                               │           Client (React 19)            │
                               │   Monaco Editor • React Router • SPA   │
                               └──────────────────┬─────────────────────┘
                                                  │
                                   ┌──────────────┴──────────────┐
                     HTTP REST API │                             │ WebSocket (Socket.IO)
               (Auth, Rooms, Exec) │                             │ (Live Sync, Cursors, Chat)
                                   ▼                             ▼
                        ┌───────────────────────────────────────────────┐
                        │              Express 4 API Gateway            │
                        │       Rate Limiting • Helmet • JWT Auth       │
                        └──────────────┬─────────────────┬──────────────┘
                                       │                 │
                   ┌───────────────────┴───┐         ┌───┴──────────────────┐
                   ▼                       ▼         ▼                      ▼
        ┌──────────────────────┐    ┌──────────────┐ ┌──────────────┐  ┌─────────────┐
        │  Auth & User Service │    │ Room Service │ │ Socket.IO    │  │ Code Exec   │
        │  OTP & Hashed Reset  │    │ Memory Store │ │ Real-Time Hub│  │ Engine      │
        └──────────┬───────────┘    └──────┬───────┘ └──────────────┘  └──────┬──────┘
                   │                       │                                  │
                   ▼                       ▼                                  ▼
        ┌──────────────────────────────────────────┐                   ┌─────────────┐
        │          MongoDB Database                │                   │ Judge0 API  │
        │      Users • Rooms • History             │                   │ / Piston Box│
        └──────────────────────────────────────────┘                   └─────────────┘
```

---

## ✨ Key Features

- **⚡ Real-Time Collaborative Editor**: Built on Microsoft's Monaco Editor engine (the core of VS Code) with sub-50ms synchronized typing.
- **🎨 Dynamic Remote Cursors**: See remote collaborators' cursor positions and selections in real-time with assigned participant colors and name tags.
- **🛡️ Multi-Language Execution**: Execute **C++, Python, JavaScript, TypeScript, Java, Go, Rust, and C#** with custom STDIN stream inputs and resource caps.
- **💬 Integrated In-Room Chat**: Real-time room chat with user color tagging, message timestamps, and animated "X is typing..." status indicators.
- **🔒 Production-Grade Security**:
  - Cryptographically secure 6-digit numeric OTP generation (`crypto.randomInt`).
  - Strict OTP attempt rate limiting (max 5 attempts before invalidation).
  - SHA-256 token-based password reset without requiring prior login.
  - Multi-tier rate limiting via `express-rate-limit` for auth and execution routes.
  - HTTP security headers via `helmet` and strict CORS policies.
- **💾 Hybrid In-Memory + MongoDB Persistence**: Real-time room operations operate in high-speed memory with automatic background synchronization to MongoDB.
- **🐳 Containerized & Cloud-Ready**: Complete multi-stage `Dockerfile` and `docker-compose.yml` for single-command deployment.

---

## 📂 Project Structure

```
Collaborative coding platform/
├── docker-compose.yml            # Full-stack Docker compose orchestrator
├── README.md                     # Comprehensive project documentation
│
├── client/                       # React 19 Frontend SPA (Vite)
│   ├── Dockerfile                # Production multi-stage Nginx Dockerfile
│   ├── nginx.conf                # Nginx SPA fallback configuration
│   ├── src/
│   │   ├── components/           # Reusable UI (CodeEditor, Terminal, Chat, Cards)
│   │   ├── context/              # AuthContext, ToastContext
│   │   ├── hooks/                # useAuth, useToast
│   │   ├── layouts/              # MainLayout (Responsive Navbar & Footer)
│   │   ├── pages/                # LandingPage, Dashboard, RoomPage, Auth pages
│   │   ├── services/             # Axios API client, authService, roomService, executeService
│   │   ├── socket/               # Socket.IO client instance & connection manager
│   │   ├── utils/                # Auth token storage helpers
│   │   ├── App.css               # Global component and navbar styling
│   │   └── index.css             # Cohesive dark-mode design system
│   └── vite.config.js
│
└── server/                       # Express 4 + Socket.IO Backend API
    ├── Dockerfile                # Node 20 LTS lightweight container
    ├── config/                   # MongoDB Mongoose database connection
    ├── controllers/              # Request handlers (auth, rooms, code execution)
    ├── middleware/               # authMiddleware, rateLimiter, errorMiddleware, socketAuth
    ├── models/                   # Mongoose Schemas (User, Room)
    ├── routes/                   # REST route definitions (/api/auth, /api/rooms, /api/execute)
    ├── services/                 # Business logic (codeExecutionService, emailService, roomService)
    ├── socket/                   # Modular real-time event handlers (roomEvents, editorEvents, chatEvents)
    ├── store/                    # In-memory fast room state
    ├── utils/                    # Language mappings, OTP generator, name formatter
    └── server.js                 # HTTP & WebSocket server entrypoint
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Docker & Docker Compose** (Optional, for containerized run)

---

### Option 1: Quickstart with Docker Compose (Recommended)

1. Clone repository and navigate to root:
```bash
git clone <repo-url>
cd "Collaborative coding platform"
```

2. Launch all services (MongoDB, Server, and Client) with Docker Compose:
```bash
docker-compose up --build
```

3. Open your browser:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

### Option 2: Local Development Setup

#### 1. Setup Backend Server
```bash
cd server
npm install
```

Create `server/.env` based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/codesync?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_at_least_32_characters
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
JUDGE0_API_KEY=YOUR_RAPIDAPI_KEY_OPTIONAL
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
```

Start backend development server:
```bash
npm run dev
```

#### 2. Setup Frontend Client
In a new terminal:
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend client:
```bash
npm run dev
```

---

## 📡 API Reference Catalogue

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register new user and dispatch 6-digit OTP | No (Rate Limited) |
| `POST` | `/verify-otp` | Verify 6-digit email OTP (Max 5 attempts) | No (Rate Limited) |
| `POST` | `/login` | Authenticate user & issue JWT bearer token | No (Rate Limited) |
| `POST` | `/forget-password` | Request 15-minute tokenized password reset link | No (Rate Limited) |
| `POST` | `/reset-password` | Set new password using URL token verification | No (Rate Limited) |
| `GET` | `/me` | Fetch authenticated user profile | **Yes (Bearer JWT)** |
| `POST` | `/change-password` | Change account password | **Yes (Bearer JWT)** |

### Room Endpoints (`/api/rooms`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/create` | Create a new collaborative room session | **Yes (Bearer JWT)** |
| `POST` | `/join` | Verify and join room by Room ID | **Yes (Bearer JWT)** |
| `GET` | `/my-rooms` | Fetch user's recent / active workspaces | **Yes (Bearer JWT)** |

### Code Execution (`/api/execute`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Execute code with sandboxed stdin/stdout | **Yes (Bearer JWT)** |

---

## 🔌 Real-Time WebSocket Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join-room` | Client ➔ Server | `roomId` | Join a collaborative room session |
| `joined-room` | Server ➔ Client | `{ roomId, participants, code, language, messages }` | Initial room state snapshot |
| `code-change` | Client ➔ Server | `{ roomId, code }` | Broadcast live code update |
| `code-update` | Server ➔ Client | `code` | Receive latest code text |
| `cursor-change` | Client ➔ Server | `{ roomId, lineNumber, column }` | Broadcast cursor position |
| `cursor-update` | Server ➔ Client | `{ userId, displayName, color, lineNumber, column }` | Render remote collaborator cursor |
| `typing-start` | Client ➔ Server | `{ roomId }` | Signal participant started typing |
| `typing-stop` | Client ➔ Server | `{ roomId }` | Signal participant stopped typing |
| `language-change` | Client ➔ Server | `{ roomId, language }` | Synchronize room programming language |
| `send-message` | Client ➔ Server | `{ roomId, message }` | Send chat message to room participants |
| `chat-message` | Server ➔ Client | `{ id, displayName, color, message, timestamp }` | Receive live chat message |
| `user-left` | Server ➔ Client | `userId` | Participant disconnected or left session |

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: `bcrypt` with cost factor 10.
2. **Timing-Safe Reset Tokens**: SHA-256 hashed 32-byte tokens with 15-minute expiration windows.
3. **No User Account Enumeration**: Forgot password endpoints return constant-time generic confirmation messages regardless of email existence.
4. **Brute Force Protection**: IP rate limiting via `express-rate-limit` and maximum attempt counters on OTP verification.
5. **No Secret Leaks**: Sanitized loggers with zero token or credential output.
6. **Graceful Disconnection**: 30-second reconnection window prevents unexpected session drops during brief network drops.

---

## 📄 License
This project is licensed under the ISC License.
