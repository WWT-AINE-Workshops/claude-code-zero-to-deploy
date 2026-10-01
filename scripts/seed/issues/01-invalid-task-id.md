---
title: Invalid task id returns 500 instead of 400
labels: bug,api,workshop
---

Requesting a task with an id that is not a number crashes the request instead of rejecting it.

**Steps to reproduce**

1. Start the API with `npm run dev`.
2. Run `curl -i http://localhost:3001/api/tasks/abc`.

**What happens**

The response status is 500.

**What should happen**

A bad id is a bad request: status 400 with the body `{"error":"invalid id"}`. A valid id such as `/api/tasks/1` still returns the task.

**Acceptance**

- `GET /api/tasks/<bad id>` returns 400 with `{"error":"invalid id"}`.
- A test covers the bad id, and `npm test` passes.
