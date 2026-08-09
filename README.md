# House Buying Tracker

Private, mobile-first application for tracking houses under consideration.

Phase 1 contains the Next.js application foundation, Neon/Drizzle database
configuration, Better Auth email/password login, protected routes, and the
responsive authenticated shell. Property data is intentionally not implemented
yet.

## Requirements

- Node.js 20.9 or newer
- npm
- A Neon PostgreSQL project

## Environment

Copy `.env.example` to `.env.local` and provide:

- `DATABASE_URL`: Neon's pooled connection string for the application
- `DATABASE_URL_DIRECT`: Neon's direct connection string for migrations
- `BETTER_AUTH_SECRET`: at least 32 random characters; generate one with
  `npx auth@latest secret`
- `BETTER_AUTH_URL`: `http://localhost:3000` locally and the deployed HTTPS
  origin in production

Credentials and secrets must never be committed.

## Setup

```bash
npm install
npm run db:migrate
npm run create-user -- --name "Your Name" --email "you@example.com" --password "a-secure-password"
npm run dev
```

Open `http://localhost:3000/login`.

Public signup is disabled. Run `npm run create-user` again whenever another
household user needs access.

## Database changes

The Drizzle schema is the source of truth.

```bash
npm run db:generate
npm run db:migrate
```

Application runtime uses the pooled Neon URL. Migration commands use the direct
Neon URL.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```
