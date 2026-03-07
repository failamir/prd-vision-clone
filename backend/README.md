# Backend with Redis Caching

This is a Node.js Express backend that implements Redis caching for Supabase queries.

## Prerequisites

- Node.js
- Redis server (local or managed like Upstash/Aiven)

## Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in the root `.env`:
    ```env
    REDIS_URL=redis://localhost:6379
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
    ```

## Running the Server

- **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

## API Endpoints

- `GET /api/jobs`: Get active jobs (cached for 1 hour).
- `GET /api/jobs/:id`: Get job details by ID (cached for 1 hour).
- `POST /api/jobs/clear-cache`: Clear cache for all jobs or a specific job.
  - Body: `{ "id": "optional-job-id" }`
- `GET /api/health`: Check server and Redis status.

## Implementation Details

- **Redis Client**: Uses `ioredis` for robust connection management.
- **Cache Strategy**: "Cache-aside" pattern using the `getOrSetCache` utility in `src/cacheUtils.ts`.
- **Expiration**: Default cache expiration is set to 3600 seconds (1 hour).
