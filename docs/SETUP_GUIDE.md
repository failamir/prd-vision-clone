# PRD Vision Clone - Setup & Installation Guide

This document outlines the steps required to set up the PRD Vision Clone project for local development. The project consists of a React/Vite frontend and a Node.js/Express backend that utilizes Redis for caching and Supabase for the database.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **npm** (or Bun/Yarn)
- **Git**
- A **Supabase** account (if setting up your own instance)
- **Redis** (optional if using the remote VPS instance provided in the repo)

---

## 1. Local Environment Setup

Clone the repository to your local machine:
```bash
git clone <YOUR_GIT_URL>
cd prd-vision-clone
```

### Install Dependencies

The project uses a combined `package.json` at the root that manages both frontend and backend development smoothly.

To install frontend dependencies:
```bash
npm install
```

To install backend dependencies:
```bash
cd backend
npm install
cd ..
```

---

## 2. Environment Variables Integration

The project requires configuring environment variables for both the frontend and backend to interact with Supabase and Redis.

### Frontend `.env`
Create a `.env` file in the **root directory** of the project and add the following Supabase credentials:

```env
# Root /.env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
```

### Backend `.env`
Create a `.env` file in the **`backend/` directory** and add the following configuration:

```env
# Server Port
PORT=5001

# Redis Configuration (Update to localhost if running locally)
REDIS_HOST=103.189.13.153
REDIS_PORT=6379
REDIS_PASSWORD=SangatRahasia!2026

# Supabase Credentials (Same as frontend)
VITE_SUPABASE_URL=https://your_project_id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

---

## 3. Running the Application

You can run both the frontend and the backend concurrently using the pre-configured script in the root `package.json`.

```bash
# Run both frontend and backend concurrently
npm run dev:all
```

Alternatively, you can run them separately:
- **Frontend only:** `npm run dev` (Runs on `http://localhost:8080`)
- **Backend only:** `npm run dev:backend` (Runs on `http://localhost:5001`)

---

## 4. Supabase Database Setup

To set up your database schema, refer to the files located in the root repository. You can execute these SQL files in your Supabase SQL Editor:
- `database-export-full.sql`
- `secondary-database-setup.sql`

Check `docs/DATABASE_SCHEMA.md` for a deeper understanding of the relationships and tables.

## 5. Troubleshooting

- **Redis Connection Errors:** If the backend fails to connect to Redis on the VPS, ensure your IP is whitelisted or set up a local Redis instance and update `backend/.env`.
- **CORS Issues:** The backend uses the `cors` middleware. If the frontend fails to fetch data from the API, verify the proxy config (if any) or ensure the backend allows the frontend's origin limit.
