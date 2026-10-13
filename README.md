# EstatePro

Real estate application workspace with a Next.js frontend and an Express API.

## Structure

- `apps/frontend` — Next.js App Router frontend
- `apps/backend` — Express API written in TypeScript

## Getting started

```bash
npm install
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000). The API runs at [http://localhost:4000](http://localhost:4000), with a health check at `/api/health`.

Copy each `.env.example` to `.env.local` (frontend) or `.env` (backend) if you need to customize local settings.
