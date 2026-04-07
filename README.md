# PRD Vision Clone

Welcome to the **PRD Vision Clone**, a comprehensive Job Recruitment and Manning Agency Application Portal. 

This platform connects candidates with manning agencies, managing the entire recruitment life cycle from job posting to deployment. It consists of a React/Vite frontend using Tailwind CSS and shadcn/ui, and a Node.js/Express backend that layers Redis caching over a Supabase PostgreSQL database.

## System Documentation

For detailed guides, please refer to the documents in the `/docs` directory:

1. **[Setup & Installation Guide](docs/SETUP_GUIDE.md)**: Full instructions on how to install dependencies, configure `.env` variables, and start the development servers.
2. **[Architecture & Tech Stack](docs/ARCHITECTURE.md)**: Details on the chosen frameworks, libraries, and directory structures for both the client and the API.
3. **[API Documentation](docs/API_DOCUMENTATION.md)**: Details on the Express.js endpoints and how the Redis cache operates alongside Supabase.
4. **[Application Flow](docs/APPLICATION_FLOW.md)**: A narrative of how data traverses the application.
5. **[Database Schema](docs/DATABASE_SCHEMA.md)**: Breakdown of the Supabase PostgreSQL structure.
6. **[Data Flow Diagram](docs/DATA_FLOW_DIAGRAM.md)**: Sequence diagram representations.
7. **[Technical Specifications](docs/TECHNICAL_SPECS.md)**: Deeper technical dive into constraints and standards.
8. **[User Stories](docs/USER_STORIES.md)**: The original project context and user requirements.

## Quick Start

### 1. Requirements
Ensure you have Node.js and npm installed.

### 2. Install Dependencies
```bash
npm i
cd backend && npm i && cd ..
```

### 3. Run Development Server
```bash
npm run dev:all
```
This single command runs the frontend using Vite (`http://localhost:8080`) and the Node backend API (`http://localhost:5001`) simultaneously.

## Lovable Project Info

The UI of this project was primarily initialized with **Lovable**. 
- **URL**: https://lovable.dev/projects/e6b32457-6240-4d97-9217-7d4604f4f20c
- Changes made via Lovable are committed automatically to this repo. Alternatively, use your preferred IDE to edit files directly.
