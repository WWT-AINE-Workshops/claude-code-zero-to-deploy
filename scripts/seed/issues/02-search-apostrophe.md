---
title: Search fails with a 500 when a title has an apostrophe
labels: bug,api,workshop
---

Searching tasks by title works for most words, but any search with an apostrophe crashes.

**Steps to reproduce**

1. Start the API with `npm run dev`.
2. Run `curl -i "http://localhost:3001/api/tasks?q=O'Brien"`.

**What happens**

The response status is 500.

**What should happen**

Status 200, with the matching task in `items`: the interview with O'Brien Logistics. A search with no matches returns 200 with `total` 0.

**Acceptance criteria**

- A search for `O'Brien` returns 200 and the one matching task.
- A search for any text, including quotes, returns 200 and only the tasks whose title contains that text.
- A test covers it.
