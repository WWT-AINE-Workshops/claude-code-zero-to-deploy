---
title: List users for the assignee picker
branch: users-v2
---

The task form needs a list of people to pick an assignee from, and the API has no way to ask for one yet.

**What changed**

- Adds `GET /api/users`, which returns `{ items: [{ id, name, email }] }` ordered by id.
- Registers the new route in `app.ts` next to the task routes.
- Adds a test that checks the status code, the number of users and the fields on each one.

**How I checked it**

- `npm test` passes.
- `curl http://localhost:3001/api/users` returns the three seeded users.

The picker itself comes in a follow-up PR.
