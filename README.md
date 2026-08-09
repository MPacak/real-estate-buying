# House Buying Tracker

Private, mobile-first application for tracking houses under consideration.

The project currently contains the Next.js application foundation,
Neon/Drizzle database configuration, Better Auth email/password login,
protected routes, the responsive authenticated shell, and the initial Property
database model. Authenticated users can create, view, edit, and archive
properties. The mobile-first dashboard displays active properties ordered by
priority with immediate agent, listing, and viewing actions. Quick filters,
detailed filters, text search, and URL-based sorting keep larger property lists
manageable. Exact decimal financial calculations provide acquisition-cost
estimates and price-per-square-metre values without persisting derived data.
Two to four dashboard properties can be selected for a horizontally scrollable
side-by-side comparison.

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
