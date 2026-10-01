# Tasklane

A small team task tracker: a Fastify and SQLite API, plus an MCP server over the same database.
TypeScript throughout, npm workspaces, Node 22 or later.

## Layout

- `apps/api`: the HTTP API on port 3001. Migrations in `migrations/`, the contract in `openapi.yaml`.
- `apps/mcp`: a stdio MCP server that reads the API's database. Run it with `npx tsx apps/mcp/src/index.ts`.
- `packages/shared`: types and constants both apps use (`Task`, `TaskStatus`, page sizes).

## Commands

Run these from the repo root.

- `npm run setup`: typecheck, then reset and seed the database. Run it once after `npm ci`.
- `npm run dev`: start the API with reload.
- `npm test`: run every workspace's Vitest suite.
- `npm run lint`: ESLint. `npm run typecheck`: `tsc --noEmit` in every workspace.

## Patterns

- Routes live in `apps/api/src/routes/`, one file per resource, registered in `src/app.ts`.
- All SQL lives in `apps/api/src/repo.ts`.
- Validate params, query and body with zod schemas. Parse ids with `toId`.
- Signal client errors with `HttpError` (or `notFound`) from `src/errors.ts`. The error handler in
  `app.ts` turns them into `{ error: string }` responses.
- Tests use Vitest and `makeTestApp()` from `apps/api/test/helpers.ts`, which gives a seeded
  in-memory database. Call `app.inject` rather than starting a server.
- The seed is deterministic: fixed ids and timestamps. Keep it that way.

## Rules

- Write commit messages as Conventional Commits, for example `feat(api): add a due date to tasks`.
- Before you finish, run `npm test` and `npm run typecheck`.
- Update `openapi.yaml` whenever an endpoint changes.
