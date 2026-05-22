<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# simplify — Agent guide

**Project**: Health data collection dashboard for Madagascar health centers (French UI).

**Stack**: Next.js 16, Prisma 7 + Supabase PostgreSQL, NextAuth, Tailwind CSS v4, ESLint 9 flat config.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config in `eslint.config.mjs`) |
| `npx prisma generate` | Generate client to `app/generated/prisma/` |
| `npx prisma db seed` | Seed DB with test data (uses `tsx prisma/seed.ts`) |

No test suite exists yet.

## Prisma 7 quirks

- **Config file**: `prisma.config.ts` (new format, replaces `prisma` field in `package.json`)
- **Client import**: Use the generated path directly, not `@prisma/client`:
  ```ts
  import { PrismaClient, Role } from '@/app/generated/prisma/client'
  ```
  or relative: `'../app/generated/prisma/client'`
- **Client construction**: Must pass an adapter — `new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })`
- **Generator output**: `app/generated/prisma/` — do not edit manually
- **Env loading**: `prisma.config.ts` imports `dotenv/config`; `DATABASE_URL` is Supabase PostgreSQL (pooled via Supavisor), `DIRECT_URL` for migrations

## Architecture

- Two roles: `MEDECIN_CHEF` (global dashboard), `AGENT` (weekly data entry form)
- Models: `User`, `Saisie` (weekly stats, unique per user+week+year), `Rapport` (AI-generated reports with JSON snapshot)
- App is early stage: scaffold with schema + seed, no functional routes beyond home page
