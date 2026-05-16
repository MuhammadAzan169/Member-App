# MeetingSense Member Portal

A mobile-optimized frontend/UI prototype for meeting participants to view and manage their assigned action items.

## Features

- **Demo Authentication** — Login/signup screens with local mock user (no verification)
- **Multi-Organization Flow** — Select an organization to view demo tasks
- **Action Items Dashboard** — View tasks grouped by meeting
- **Status Updates** — Mark tasks as Completed, Delayed, or Unable to Complete (in-memory)
- **Mobile-First UI** — iPhone-style frame, touch-friendly, responsive

## Quick Start

```bash
cd member-app
npm install
npm run dev
```

The app runs at **http://localhost:5174**

No backend, Firebase, or external services are required.

## Architecture

```
member-app/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root component with auth flow
│   │   └── components/
│   │       ├── LoginScreen.tsx       # Email/password login
│   │       ├── SignupScreen.tsx      # New account registration
│   │       ├── OrgSelectScreen.tsx   # Multi-org selection
│   │       ├── Dashboard.tsx         # Main task list with stats
│   │       ├── ActionItemCard.tsx    # Task card component
│   │       ├── ActionItemDetail.tsx  # Task detail + status update
│   │       └── ProfileScreen.tsx     # User profile & settings
│   ├── contexts/
│   │   └── AuthContext.tsx       # Demo auth (localStorage)
│   ├── services/
│   │   └── api.ts               # Demo data store (in-memory)
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── styles/
│       └── index.css            # Tailwind CSS + global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## How It Works

### Authentication Flow
1. Member uses Login / Signup screens (any values work)
2. User is stored locally (demo-only)
3. Organization selection shows demo orgs
4. Dashboard loads demo action items for the selected org

### Data Flow
- **Organizations**: Static demo list
- **Meetings**: Static demo meetings per org
- **Action Items**: Generated demo tasks per user/org
- **Status Updates**: Applied to an in-memory store and reflected immediately in the UI

### Backend Services Required
None (frontend-only prototype).

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS v4
- Motion (Framer Motion) for animations
- Lucide React for icons
- Sonner for toast notifications
- Vite dev server

## Screens

1. **Login** — Clean email/password form with forgot password
2. **Signup** — Account creation with validation
3. **Organization Select** — Choose which admin's tasks to view
4. **Dashboard** — Stats cards, filters, grouped task list
5. **Action Item Detail** — Full task info + status update form
6. **Profile** — User info, org switch, logout
