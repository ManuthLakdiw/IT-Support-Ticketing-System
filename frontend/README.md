# 🎫 IT Support Ticketing System — Frontend

A production-ready client application built with **Next.js 14** and **TypeScript** for managing internal IT support tickets. The UI enforces a strict role-based navigation model, a one-way ticket lifecycle, light/dark theme support, and a responsive dashboard layout out of the box.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Application Routes](#-application-routes)
- [Available Scripts](#-available-scripts)
- [Docker Deployment](#-docker-deployment)

---

## 🛠 Tech Stack

| Layer              | Technology                                                       |
| ------------------ | ---------------------------------------------------------------- |
| Framework          | [Next.js](https://nextjs.org/) v14 (App Router)                  |
| Language           | [TypeScript](https://www.typescriptlang.org/) v5                 |
| Styling            | [Tailwind CSS](https://tailwindcss.com/) v3                      |
| Component Library  | [Shadcn UI](https://ui.shadcn.com/) + [`@base-ui/react`](https://base-ui.com/) |
| State Management   | [Redux Toolkit](https://redux-toolkit.js.org/) v2 + React Redux  |
| Form Handling      | [`react-hook-form`](https://react-hook-form.com/) v7 + Zod v3   |
| Theme Switching    | [`next-themes`](https://github.com/pacocoursey/next-themes) v0.4 |
| Icons              | [`lucide-react`](https://lucide.dev/) v1                         |
| Date Utilities     | [`date-fns`](https://date-fns.org/) v4                           |
| Utility Helpers    | `clsx`, `tailwind-merge`, `class-variance-authority`             |

---

## ✨ Key Features

### 🔐 Authentication
- **Login Page** — JWT-based login that stores the `access_token` in an HTTP cookie and user info in a `user_info` cookie for middleware access.
- **Persistent Sessions** — Redux `authSlice` rehydrates user state from cookies on each page load, preventing session loss on refresh.
- **Secure Logout** — Clears all auth cookies and redirects to the login page.

### 🛡 Role-Based Navigation & Route Protection
Two distinct roles are enforced at the middleware level using Next.js `middleware.ts` and cookie inspection:

| Role    | Accessible Routes                                                                              |
| ------- | ---------------------------------------------------------------------------------------------- |
| `USER`  | `/dashboard` · `/dashboard/tickets` · `/dashboard/tickets/new` · `/dashboard/tickets/:id` · `/dashboard/settings` |
| `ADMIN` | `/dashboard` · `/dashboard/tickets` · `/dashboard/tickets/:id` · `/dashboard/admin` · `/dashboard/settings` |

- **Unauthenticated users** are redirected to `/login` with a `?from=` redirect parameter.
- **Non-admin users** attempting to access `/dashboard/admin` are redirected to `/dashboard`.
- **Admin users** attempting to access `/dashboard/tickets/new` are redirected to `/dashboard/tickets`.

### 🔄 Ticket Lifecycle UI
Tickets follow the same **strict, one-way status flow** enforced by the backend:

```
OPEN  ──►  IN_PROGRESS  ──►  RESOLVED
```

- **ADMINs** see a status-update dropdown on each ticket detail page.
- **Edit** and **Delete** actions are conditionally rendered — only shown to the ticket owner when the ticket is `OPEN`.
- **RESOLVED** tickets hide the delete action entirely.

### 🔍 Search & Pagination
- The ticket list page includes a **debounced search bar** (`useDebounce` hook, 500 ms delay) to avoid excessive API calls while the user types.
- Results are paginated and displayed with a `meta` object (`total`, `page`, `limit`, `lastPage`).
- Search is performed server-side via the `?q=` query parameter passed to the backend API.

### 🌗 Light / Dark Theme
- **System-aware default** — `next-themes` detects the OS preference on first load.
- **Manual toggle** — A `ThemeToggle` component in the top bar allows switching between Light, Dark, and System modes with animated icons.
- Tailwind CSS `dark:` variant is used throughout for consistent theming.

### 🖥 Responsive Dashboard Layout
- **Collapsible Sidebar** — The `SidebarContext` manages open/closed state; the sidebar collapses to an icon-only rail on small screens.
- **Top Navigation Bar** — Displays the current user's name, role badge, and avatar with a settings/logout dropdown menu.
- **Loading Skeletons** — Route-level `loading.tsx` files display skeleton cards while async data is fetching.

### 👤 Admin User Management Panel
- Dedicated `/dashboard/admin` page for full **CRUD on user accounts** — visible only to `ADMIN` role users.
- **Create User Modal** and **Edit User Modal** provide inline forms for managing name, role, and account status.
- Users can be **suspended** (toggling `isActive`) or **permanently deleted** with a confirmation dialog.

### ✏️ Edit Restrictions
- The edit page (`/dashboard/tickets/:id/edit`) enforces ownership and status checks by reading ticket data before rendering the form.
- The `TicketActions` component conditionally renders Edit/Delete buttons only when:
  1. The logged-in user is the **owner** of the ticket.
  2. The ticket status is **`OPEN`**.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx              # Login form page
│   │   │
│   │   ├── api/                          # Next.js Route Handlers (proxy / server actions)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── components/
│   │   │   │   │   ├── CreateUserModal.tsx
│   │   │   │   │   └── EditUserModal.tsx
│   │   │   │   ├── AdminPanel.tsx         # Full user management UI (ADMIN only)
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx              # Change password form
│   │   │   │
│   │   │   ├── tickets/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx      # Edit ticket form (OPEN status only)
│   │   │   │   │   ├── TicketActions.tsx  # Edit / Delete / Status-update actions
│   │   │   │   │   └── page.tsx          # Ticket detail view
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx          # Create ticket form (USER only)
│   │   │   │   ├── actions.ts            # Server Actions for ticket mutations
│   │   │   │   ├── loading.tsx           # Skeleton loading UI
│   │   │   │   └── page.tsx              # Paginated ticket list with search
│   │   │   │
│   │   │   ├── DashboardWelcome.tsx      # Welcome banner component
│   │   │   ├── layout.tsx                # Dashboard shell (sidebar + topbar)
│   │   │   └── page.tsx                  # Dashboard home / overview
│   │   │
│   │   ├── fonts/                        # Local font assets
│   │   ├── globals.css                   # Global CSS + Tailwind base layers
│   │   ├── layout.tsx                    # Root layout (ThemeProvider + StoreProvider)
│   │   └── page.tsx                      # Root redirect → /dashboard
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SidebarContext.tsx        # Sidebar open/close React context
│   │   │   ├── sidebar.tsx               # Collapsible navigation sidebar
│   │   │   └── topbar.tsx                # Top navigation bar with user menu
│   │   │
│   │   ├── tickets/
│   │   │   ├── CreateTicketForm.tsx      # Controlled form for new tickets
│   │   │   └── TicketCard.tsx            # Card component for ticket list items
│   │   │
│   │   ├── ui/
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── confirm-dialog.tsx        # Reusable confirmation modal
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── ThemeProvider.tsx             # next-themes provider wrapper
│   │   └── ThemeToggle.tsx               # Light / Dark / System toggle button
│   │
│   ├── hooks/
│   │   └── useDebounce.ts                # Generic debounce hook (500 ms default)
│   │
│   ├── lib/
│   │   ├── api.ts                        # Base API URL export
│   │   └── utils.ts                      # `cn()` class-merge utility
│   │
│   ├── redux/
│   │   ├── features/
│   │   │   └── authSlice.ts              # Auth state (user, token, login/logout)
│   │   ├── hooks.ts                      # Typed `useAppDispatch` / `useAppSelector`
│   │   ├── store.ts                      # Redux store configuration
│   │   └── StoreProvider.tsx             # Redux Provider wrapper for App Router
│   │
│   ├── services/
│   │   ├── apiClient.ts                  # Fetch wrapper with auth header injection
│   │   ├── ticketService.ts              # Ticket CRUD API calls
│   │   └── userService.ts                # User management API calls
│   │
│   ├── types/
│   │   └── ticket.ts                     # Ticket & User TypeScript interfaces
│   │
│   └── middleware.ts                     # Route protection (auth + RBAC guards)
│
├── .env.local                            # Local environment variables (git-ignored)
├── components.json                       # Shadcn UI configuration
├── next.config.mjs                       # Next.js configuration
├── postcss.config.mjs
├── tailwind.config.ts                    # Tailwind CSS + dark mode configuration
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- The **backend API** running at `http://localhost:3000` (see the backend README)

### Step 1 — Install Dependencies

```bash
cd frontend
npm install
```

### Step 2 — Configure Environment Variables

Copy the example below into a new `.env.local` file and adjust the values to match your backend URL:

```bash
cp .env.local.example .env.local   # if an example file exists, otherwise create manually
```

Open `.env.local` and set your API URL. See the [Environment Variables](#-environment-variables) section for the full reference.

### Step 3 — Start the Development Server

```bash
npm run dev
```

The application will be available at:
- **App URL:** `http://localhost:3001`

> **Note:** Next.js will automatically select the next available port if `3001` is in use. Check your terminal output for the exact URL.

---

## 🔑 Environment Variables

Create a `.env.local` file in the `frontend/` directory. All variables are required unless marked optional.

```dotenv
# ─── API ─────────────────────────────────────────────────────────────────────

# Server-side only — used in Server Components, Server Actions, and Route Handlers.
# Never exposed to the browser.
API_URL=http://localhost:3000/api

# Public — exposed to the browser via Next.js.
# Used in client-side service calls (apiClient.ts).
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ **Important:** `API_URL` (without the `NEXT_PUBLIC_` prefix) is only available in server-side Next.js code. Use `NEXT_PUBLIC_API_URL` for any client-side fetch calls. Both should point to the same backend base URL in local development.

---

## 🗺 Application Routes

All routes are handled by the Next.js App Router. The middleware protects every `/dashboard/*` path.

### Public Routes

| Route    | Description                   |
| -------- | ----------------------------- |
| `/login` | Login page (JWT-based auth)   |

---

### Dashboard Routes (`/dashboard/*`)

> All dashboard routes require a valid `access_token` cookie. Unauthenticated users are redirected to `/login`.

| Route                          | Role    | Description                                                  |
| ------------------------------ | ------- | ------------------------------------------------------------ |
| `/dashboard`                   | Any     | Overview / welcome page                                      |
| `/dashboard/tickets`           | Any     | Paginated ticket list with debounced search (`?q=&page=&limit=`) |
| `/dashboard/tickets/new`       | `USER`  | Create a new support ticket                                  |
| `/dashboard/tickets/:id`       | Any     | Ticket detail view with status badge and owner actions       |
| `/dashboard/tickets/:id/edit`  | `USER`  | Edit ticket title & description (only if status is `OPEN`)   |
| `/dashboard/admin`             | `ADMIN` | Full user management panel (Create, Edit, Suspend, Delete)   |
| `/dashboard/settings`          | Any     | Change own account password                                  |

---

## 📦 Available Scripts

Run all commands from the `frontend/` directory.

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Next.js development server with HMR    |
| `npm run build`   | Compile and bundle for production                |
| `npm run start`   | Start the compiled production server             |
| `npm run lint`    | Run ESLint and report issues                     |

---

## 🐳 Docker Deployment

<p>
  <a href="https://hub.docker.com/r/manuthlakdiw/ticketing-frontend">
    <img src="https://img.shields.io/badge/Docker_Hub-manuthlakdiw%2Fticke‌​ting--frontend-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Hub" />
  </a>
  <img src="https://img.shields.io/badge/Image_Tag-latest-0ea5e9?style=for-the-badge" alt="latest" />
  <img src="https://img.shields.io/badge/Port-3001-6366f1?style=for-the-badge" alt="Port 3001" />
</p>

A pre-built production image is available on Docker Hub. No local build or Node.js installation required.

### Pull the Image

```bash
docker pull manuthlakdiw/ticketing-frontend:latest
```

### Run as a Standalone Container

The `NEXT_PUBLIC_API_URL` variable is **critical** — it tells the browser where to send API requests. Set it to the public address of your running backend.

The `API_URL` variable is used server-side (in Server Components and Route Handlers) and should use the internal Docker service name or host address of the backend.

```bash
docker run -d \
  --name ticketing_frontend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api \
  -e API_URL=http://localhost:3000/api \
  manuthlakdiw/ticketing-frontend:latest
```

Once running, the application is available at:
- **App URL:** `http://localhost:3001`

> **Tip:** For running both services together, use the Docker Compose quick-start in the [Root README](../README.md#-docker-quick-start).

---

## 📄 License

This project is **UNLICENSED** and intended for educational purposes only.
