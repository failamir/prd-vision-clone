# Architecture & Technology Stack

The PRD Vision Clone is a "Job Recruitment and Manning Agency Application Portal" separated into a Single Page Application (SPA) frontend and a Node.js API backend. This micro-architecture ensures scalability, security, and responsiveness.

## 1. High-Level Architecture Overview

1. **Client (Frontend)**: React application served via Vite. Handles rendering, state management, and user interaction. Connects directly to Supabase for authentication and specific row-level data updates, while fetching cached reads via the custom Node API.
2. **API Layer (Backend)**: An Express.js Node server that serves as a custom API layer. Its primary role is to fetch heavy read-operations from Supabase and cache them inside a Redis cluster to serve frequent requests (like fetching the active job lists).
3. **Database & Auth (Supabase)**: Provides PostgreSQL database, Authentication (JWT), and Row Level Security (RLS).
4. **Cache Layer (Redis)**: Acts as in-memory storage for high-frequency operations.

Read more about data flows in [DATA_FLOW_DIAGRAM.md](./DATA_FLOW_DIAGRAM.md) and [APPLICATION_FLOW.md](./APPLICATION_FLOW.md).

---

## 2. Frontend Technologies

- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/) as the bundler. Vite enforces fast Hot Module Replacement during development.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type checking and improved developer experience.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling. 
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) paired with [Radix UI](https://www.radix-ui.com/) primitives. Ensures accessibility and a beautiful out-of-the-box design system.
- **Routing**: [React Router DOM v6](https://reactrouter.com/) handling public, candidate, and admin-protected routes.
- **Form Management**: [React Hook Form](https://react-hook-form.com/) linked with [Zod](https://zod.dev/) for robust, type-safe schema validation.
- **State Management & Data Fetching**: [TanStack/React Query](https://tanstack.com/query) handles caching UI data effectively and keeping it synced with the backend/Supabase. The global user context is handled natively via React Context API (`UserProvider`).

---

## 3. Backend Technologies

- **Runtime Engine**: [Node.js](https://nodejs.org/en/) & [ts-node](https://typestrong.org/ts-node/) wrapper.
- **Framework**: [Express.js v5](https://expressjs.com/) for rapid API endpoint construction.
- **Caching Service**: [ioredis](https://github.com/luin/ioredis), a robust, performance-focused Redis client for Node. Handles exponential backoff and reconnection logic seamlessly.
- **Service Integration**: The `@supabase/supabase-js` SDK is used server-side with an Anonymous Key (or Service Role Key) to fetch data while bypassing clientside latency.

---

## 4. Directory Structure

A brief overview of the project's layout:

```text
prd-vision-clone/
├── backend/                  # Node.js/Express API Server
│   ├── src/                  # Backend source files
│   │   ├── index.ts          # Main Express app and routes
│   │   ├── redisClient.ts    # Redis connection configuration
│   │   ├── cacheUtils.ts     # Wrapper for interacting with Redis 
│   │   └── supabaseClient.ts # Supabase initialization
│   ├── package.json          # Backend dependencies
│   └── .env                  # Backend environment variables
├── docs/                     # Documentation directory (you are here)
├── public/                   # Static assets
├── src/                      # Frontend React application
│   ├── App.tsx               # Root component and Routing wrapper
│   ├── components/           # Reusable UI components (shadcn ui)
│   ├── pages/                # Route-level page components (Admin, Candidate, Public)
│   ├── context/              # React context providers
│   ├── utils/                # Utility and helper functions
│   └── setupTests.ts         # Vitest test configurations
├── .env                      # Frontend environment variables
├── package.json              # Main project dependencies and concurrent scripts
├── tailwind.config.ts        # Tailwind styling configuration
└── vite.config.ts            # Vite bundler configuration
```
