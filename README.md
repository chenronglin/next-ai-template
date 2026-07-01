# Next AI SaaS Starter

AI-ready SaaS starter built with Next.js App Router, Bun, SQLite, Prisma, Better Auth, Vercel AI SDK, shadcn/ui and Zod.

## Quick Start

```bash
bun install
bun run db:generate
bun run db:migrate -- --name init
bun run dev
```

Open http://localhost:3000, register an account, then visit `/dashboard`.

## Commands

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run typecheck
bun test
bun run db:generate
bun run db:migrate -- --name <name>
bun run db:seed
bun run db:studio
```

## Runtime Note

Bun is the package manager and command entrypoint. Prisma 7's official SQLite adapter uses `better-sqlite3`, which is not currently loadable by the Bun runtime, so scripts that execute application database code invoke Node internally while still being run through `bun run`.

Do not replace Prisma with `bun:sqlite` in business code.

## Structure

```txt
src/app/                 App Router routes
src/components/ui/       shadcn/ui components
src/components/layout/   shared layout components
src/features/            feature-first business modules
src/lib/                 env, auth, db and shared constants
src/server/              server-only helpers
prisma/                  schema, migrations and seed
skills/                  project-local Codex skills
```

## Environment

Copy `.env.example` to `.env` and set:

```txt
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AI_GATEWAY_API_KEY=""
```

When `AI_GATEWAY_API_KEY` is empty, `/ai` uses a local streaming demo response. Configure Vercel AI Gateway to enable real model output.

The default SQLite file is `dev.db` in the project root because Prisma 7 resolves `prisma.config.ts` datasource URLs from the project root.
