# TrackFlow - Modern Bug & Issue Tracker (MERN Stack)

TrackFlow is an industry-grade, accessible issue tracker and sprint management application built with the **MERN Stack** (MongoDB, Express, React, Node.js) purely in **JavaScript (ES Modules)**, following modern web development standards.

---

## 🚀 Key Features

- **🔐 User Authentication**: Register and login with secure JWT authentication and password hashing using bcrypt.
- **📁 Multi-Project Workspaces**: Create projects with custom keys (e.g., `MAR`, `DEV`), invite team members by email, and manage project ownership.
- **📋 Interactive Kanban Board**: Drag and drop tickets between "To Do", "In Progress", and "Done" with optimistic updates and backend persistence.
- **🏷️ Issue Details & Collaboration**:
  - Assignees, priority levels (Low, Medium, High, Urgent), and issue types (Bug, Feature, Task, Improvement).
  - Threaded comment feeds on each issue for real-time team discussion.
  - Delete with safety confirmation.
- **🔍 Quick Filters & Search**: Search tickets by text keyword and filter dynamically by status and priority.
- **✨ Modern Web Guidance Compliance**:
  - Native `<dialog>` modal windows with `overscroll-behavior: contain` and light-dismiss backdrop interactions.
  - Form validation with `:user-invalid` / `:user-valid` pseudo-classes to prevent premature errors while typing.
  - Accessible top-layer notification stack using `popover="manual"` with polite ARIA live regions.
  - Dedicated touch-action scoped drag handles for smooth, accessible board reordering.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 (JavaScript / JSX)
  - Vite 8
  - Tailwind CSS
  - React Router DOM v7
  - Lucide React (Icons)
  - @hello-pangea/dnd (Drag and drop)
- **Backend**:
  - Node.js (ES Modules)
  - Express.js 5
  - MongoDB + Mongoose 9
  - JSON Web Tokens (JWT) + bcryptjs
  - CORS, Dotenv

---

## 📂 Project Structure

```text
Project-Management-App/
├── client/                      # React 19 frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # ProtectedRoute wrapper
│   │   │   ├── common/          # Native Dialog modal
│   │   │   ├── kanban/          # KanbanBoard, TicketCard, FilterBar
│   │   │   ├── layout/          # Navbar, Sidebar
│   │   │   └── modals/          # CreateTicket, CreateProject, TicketDetail
│   │   ├── context/             # AuthContext, ProjectContext, ToastContext
│   │   ├── pages/               # LoginPage, RegisterPage, DashboardPage
│   │   ├── services/            # Centralized API fetch layer
│   │   ├── App.jsx              # App shell & router
│   │   └── index.css            # Tailwind & Modern Web styling
│   └── vite.config.js
├── server/                      # Express REST API (ES Modules)
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth, Project, Ticket, Comment controllers
│   │   ├── middleware/          # JWT auth & error handling
│   │   ├── models/              # User, Project, Ticket, Comment Mongoose schemas
│   │   ├── routes/              # Express API route modules
│   │   └── server.js            # Express server entry point
│   ├── .env.example
│   └── package.json
├── prd.md                       # Product Requirements Document
└── package.json                 # Monorepo root scripts
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 2. Environment Configuration
Create a `.env` file in the `server` directory (or use `.env.example`):
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bugtracker
JWT_SECRET=supersecretjwtkey_change_in_production
CLIENT_URL=http://localhost:5173
```

### 3. Run the Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start at `http://localhost:5000`.

### 4. Run the Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The client will start at `http://localhost:5173`.

---

## 📡 REST API Summary

- **Auth**:
  - `POST /api/auth/register` - Create account
  - `POST /api/auth/login` - Authenticate & obtain JWT
  - `GET /api/auth/me` - Current authenticated user
- **Projects**:
  - `GET /api/projects` - List user's projects
  - `POST /api/projects` - Create project
  - `GET /api/projects/:id` - Get project details
  - `PUT /api/projects/:id` - Update project
  - `DELETE /api/projects/:id` - Delete project
  - `POST /api/projects/:id/members` - Invite member by email
- **Tickets**:
  - `GET /api/tickets?projectId=...` - List tickets with search/status/priority filters
  - `POST /api/tickets` - Create ticket
  - `PUT /api/tickets/:id` - Update ticket details
  - `PATCH /api/tickets/:id/order` - Update Kanban column & order
  - `DELETE /api/tickets/:id` - Delete ticket
- **Comments**:
  - `GET /api/tickets/:id/comments` - List ticket comments
  - `POST /api/tickets/:id/comments` - Add comment
