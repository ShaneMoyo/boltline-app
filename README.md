# Boltline

A manufacturing ERP application for managing parts libraries, bill of materials (BOM) trees, inventory, and work orders.

## Quick Start

```bash
docker-compose up
```

This starts:
- **PostgreSQL 16** on port `5432`
- **API** (Apollo Server / GraphQL) on port `4000` — runs `prisma migrate deploy` automatically
- **Web** (Vite / React) on port `5173`

Then open [http://localhost:5173](http://localhost:5173).

To seed with sample Merlin-1D rocket engine data:

```bash
# After docker-compose up is running:
pnpm --filter @boltline/api db:seed
```

## Architecture

```
boltline-app/
├── apps/
│   ├── api/           # Apollo Server 4 + GraphQL + Prisma ORM
│   └── web/           # Vite + React 18 + TypeScript + Tailwind + Apollo Client
├── packages/
│   └── shared/        # Shared TypeScript types
├── e2e/               # Playwright end-to-end tests
├── docker-compose.yml
└── docker-compose.test.yml
```

### Data Flow

```
Browser
  │  Apollo Client (HTTP /graphql)
  ▼
Vite Dev Server (proxy /graphql → api:4000)
  │
  ▼
Apollo Server 4
  │  Context: { prisma }
  ▼
Prisma ORM
  │
  ▼
PostgreSQL 16
```

### Key Design Decisions

- **pnpm workspaces** — monorepo with shared lockfile
- **Apollo Server 4** — `startStandaloneServer` pattern (no Express)
- **Prisma** — migrations deployed via `prisma migrate deploy` in Docker entrypoint
- **DataLoader** — batches BOM child lookups to prevent N+1 queries
- **Circular BOM guard** — visited `Set<string>` passed through recursive `buildTree`

## Development (without Docker)

```bash
# Install dependencies
pnpm install

# Start postgres locally (or set DATABASE_URL to an existing instance)
docker-compose up postgres -d

# Generate Prisma client
pnpm --filter @boltline/api db:generate

# Apply migrations
pnpm --filter @boltline/api db:migrate

# Start API
pnpm --filter @boltline/api dev

# Start web (in another terminal)
pnpm --filter @boltline/web dev
```

## Testing

```bash
# Unit tests (all workspaces)
pnpm test

# Integration tests (requires test DB on port 5433)
docker-compose -f docker-compose.test.yml up -d
DATABASE_URL=postgresql://boltline:boltline@localhost:5433/boltline_test \
  pnpm --filter @boltline/api test:integration

# E2E tests (requires full docker-compose stack running)
docker-compose up -d
pnpm e2e
```

## Features

| Feature | Status |
|---|---|
| Parts Library (CRUD, search) | ✅ |
| BOM Tree (recursive, circular guard, DataLoader) | ✅ |
| Inventory (filter by part/location, low-stock highlight) | ✅ |
| Work Orders (Kanban board, step checklist, auto-complete) | ✅ |
| Dashboard (stats cards, Recharts bar chart, activity log) | ✅ |

## CI

GitHub Actions runs on every push:
1. **Lint** — ESLint + Prettier check
2. **Typecheck** — `tsc --noEmit` across all workspaces
3. **Unit tests** — Vitest (mocked Prisma)
4. **Integration tests** — Vitest against real test DB
5. **E2E tests** — Playwright against full docker-compose stack
