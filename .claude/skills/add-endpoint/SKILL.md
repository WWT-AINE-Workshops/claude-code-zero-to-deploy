---
name: add-endpoint
description: Use when adding or changing a Tasklane API endpoint
---

# Add or change a Tasklane API endpoint

Work in `apps/api`. Follow these steps in order.

1. Add a zod schema for the query and body (use `toId` for path ids).
2. Add a data function in `src/repo.ts` that uses bound parameters only. Every value goes
   through a `?` placeholder. Never build SQL from request input.
3. Add the route in `src/routes/`, and register it in `src/app.ts`. Throw `HttpError` or
   `notFound` for client errors, so the error handler returns `{ error: string }`.
4. Write Vitest tests in `test/` with `makeTestApp` from `test/helpers.ts`, covering the happy
   path, a 400 and a 404. Use `app.inject` and the seeded data.
5. Update `openapi.yaml`.
6. Run `npm test` and `npm run lint` from the repo root. Both must pass.
