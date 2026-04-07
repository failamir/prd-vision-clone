# API & Backend Documentation

The PRD Vision Clone backend is an Express API designed to alleviate heavy read traffic from Supabase by utilizing a Redis caching layer.

## Overview

The primary function of the API currently revolves around fetching Job postings. The frontend hits this backend instead of directly querying Supabase, which reduces read requests on the database and speeds up the response time for end users.

The backend is located in the `/backend` folder.

## Endpoints

### 1. `GET /api/jobs`

Fetches a list of all active jobs, ordered by their creation date (`created_at` descending). 

- **Response:** Array of `Job` objects.
- **Cache Key:** `jobs:active`
- **Behavior:** The API checks Redis for the `jobs:active` key. If present, it returns the stored JSON string immediately. If absent, it queries Supabase for jobs where `is_active` is `true`, caches the result, and returns it.

### 2. `GET /api/jobs/:id`

Fetches the details of a specific job by its ID.

- **Parameters:** `id` (string/uuid)
- **Response:** A single `Job` object.
- **Cache Key:** `job:<id>`
- **Behavior:** The API checks Redis for the specific job. If it misses the cache, it queries Supabase using `.single()`, caches it, and returns the data.

### 3. `POST /api/jobs/clear-cache`

A utility endpoint to invalidate Redis cache when a job has been updated, created, or deleted. 

- **Request Body:** 
  ```json
  {
    "id": "uuid-string-optional"
  }
  ```
- **Behavior:**
  - If `id` is provided, it deletes the cache for `job:<id>`.
  - If `id` is NOT provided, it deletes the general `jobs:active` cache.
- **Use Case:** The frontend Admin Dashboard or Supabase Webhooks should call this endpoint upon any mutation to the `jobs` table to ensure data consistency.

### 4. `GET /api/health`

Returns the health status of the Express server and the Redis connection state.

- **Response:**
  ```json
  {
    "status": "ok",
    "redis": "ready"
  }
  ```

---

## Technical Considerations

- **Redis Reconnection Logic:** The `redisClient.ts` handles graceful reconnection using exponential backoff (up to 2000ms delay).
- **Cache Wrapper:** The `getOrSetCache` utility abstracts the fetching and caching pattern keeping the routes clean.
- **CORS:** The backend accepts cross-origin requests by default via the `cors` middleware, allowing the Vite frontend (`localhost:8080`) to query it.
