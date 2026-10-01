# Lab 3: Extend Claude Code: a skill, a hook and an MCP server

**SDLC phase:** Build & Test · **Stage:** AI-Integrated · **Time:** 30 minutes

## Why this matters

Every team has its own way of doing things: how an endpoint is built, what must pass before work counts as done, which tools hold the data. If that lives only in people's heads, Claude guesses, and so does every new teammate.

In this lab you turn three of Tasklane's conventions into Claude Code extensions that live in the repository, so anyone who clones it gets them:

- a **skill**, a set of instructions Claude loads when a task matches, here for adding an API endpoint;
- a **hook**, a command Claude Code runs itself at a set point, here to run the tests whenever Claude tries to finish;
- an **MCP server**, a small program that gives Claude extra tools over the Model Context Protocol, here to read Tasklane's task data.

## Before you start

Open a terminal in your copy of the workshop repository (the `my-claude-code-zero-to-deploy` folder) and run the reset script from the repo root. If Claude Code is still open from lab 2, quit it first: press `Ctrl+D` twice on an empty prompt.

```bash
./scripts/reset-lab.sh 3
```

What it changes: it switches you to a new branch called `lab-3` at the start of this lab, installs packages if they changed, and resets the local database to the seed data: 3 users and 12 tasks. This starting point already has lab 2's fix and a reference `CLAUDE.md` with a commit rule, so its wording may differ from the one you wrote. Your lab 2 work stays on your `lab-2` branch. If you have uncommitted changes, the script stops and lists them instead. See "If it goes wrong".

Run every `claude` command in this lab from the repo root, not from a subfolder. The MCP server in Step 6 is found by a path relative to the folder you start Claude Code in.

## Steps

### Step 1: Write a skill for Tasklane's endpoint pattern

**Do this.** Start Claude Code in the repo root.

```bash
claude
```

Paste this prompt. It asks Claude to write the skill from the patterns already in the code.

```text
Create a project skill in .claude/skills/add-endpoint/SKILL.md. In its front matter, set name to add-endpoint and description to "Use when adding or changing a Tasklane API endpoint". In the body, list the steps our API endpoints follow, in order, based on the existing code in apps/api: a zod schema for the query and body, using toId for path ids; a data function in src/repo.ts that uses bound parameters only; the route in src/routes/, registered in src/app.ts, using HttpError or notFound for client errors; Vitest tests with makeTestApp that cover the happy path, a 400 and a 404; an update to openapi.yaml; and npm test and npm run lint passing from the repo root. Keep it short. Only write that one file.
```

Read the file Claude writes. Then load it into this session. The `.claude/skills` folder didn't exist when the session started, so Claude Code needs to be told to look.

```text
/reload-skills
```

Fallback: if `/reload-skills` isn't available in your version, quit Claude Code (press `Ctrl+D` twice on an empty prompt) and start `claude` again from the repo root.

**What you should see.** A new file `.claude/skills/add-endpoint/SKILL.md`: a front matter block with the name and description, then a short numbered list of steps. Claude's wording is its own. At the prompt, type a slash followed by `add`: `/add-endpoint` appears in the list of commands. Delete what you typed before you go on. If the skill misses a step from the prompt, ask Claude to add it.

**Why.** The description tells Claude when the skill applies, so it can load your team's pattern by itself, without anyone pasting it in.

### Step 2: Add an endpoint and watch the skill load

**Do this.** Ask for a small endpoint. Don't name the skill: the point is to see whether Claude picks it up from the task.

```text
Add an endpoint GET /api/users/:id/tasks that returns the tasks assigned to one user, ordered by id. Return 404 if the user doesn't exist. When npm test passes, commit the skill as one commit and the endpoint as another, following the commit rule in CLAUDE.md.
```

Approve the commands Claude asks to run. When it has finished, run the tests yourself.

```bash
npm test
```

**What you should see.** Before it writes code, Claude loads the `add-endpoint` skill: look for the skill's name in its output. Then it works through the skill's steps. It adds a data function in `apps/api/src/repo.ts`, a route file in `apps/api/src/routes/`, registers it in `apps/api/src/app.ts`, adds tests and updates `apps/api/openapi.yaml`. The file names it picks may differ. `npm test` passes, and the `apps/api` test count is higher than the 44 you start with. `git log --oneline -3` shows two new commits with typed messages, such as `feat(api): ...` for the endpoint.

If Claude starts writing code without loading the skill, press `Esc`, type `/add-endpoint` to load it by hand, and paste the prompt again.

**Why.** A skill turns "how we build endpoints here" into something Claude follows every time, and your teammates get it with their next `git pull`.

### Step 3: Add a hook that runs the tests

**Do this.** Quit Claude Code: press `Ctrl+D` twice on an empty prompt. Open your editor and create the file `.claude/settings.json` in the repo root, for example with `code .claude/settings.json` or `nano .claude/settings.json`. Paste in exactly this and save it.

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && out=$(npm test --silent 2>&1) || { printf '%s\n' \"$out\" | tail -40 >&2; echo \"Tests are failing. Fix them before you finish.\" >&2; exit 2; }"
          }
        ]
      }
    ]
  }
}
```

This is a `Stop` hook: Claude Code runs it each time Claude finishes responding. The command moves to the project root (`CLAUDE_PROJECT_DIR`, which Claude Code sets for the hook) and runs `npm test`. If the tests pass, nothing happens. If they fail, it prints the last 40 lines of test output and a short message, then exits with code 2. Exit code 2 tells Claude Code to block the stop and hand that message to Claude, so Claude carries on working instead of finishing.

Start Claude Code again from the repo root, so the new hook is loaded.

```bash
claude
```

Then open the list of hooks.

```text
/hooks
```

**What you should see.** `/hooks` shows a `Stop` hook that comes from the project settings, with the `npm test` command. Close the list when you've looked. If it isn't listed, check that the file is at `.claude/settings.json` in the repo root, not inside a subfolder, and see "If it goes wrong".

**Why.** A rule in `CLAUDE.md` is advice that Claude can forget. A hook runs every time, because Claude Code runs it, not Claude.

### Step 4: Break a test and watch the hook block

**Do this.** In your editor, open `packages/shared/test/shared.test.ts`. On line 6, change `['todo', 'doing', 'done']` to `['todo', 'done']` and save. The test now fails on purpose.

Go back to Claude Code and ask for a small, unrelated change.

```text
Add a one-line comment above DEFAULT_PAGE_SIZE in packages/shared/src/index.ts that says it is the page size used when a request doesn't ask for one. Make only that change, and don't run the tests yourself.
```

**What you should see.** Claude adds the comment and tries to finish. The hook runs the tests, they fail, and the stop is blocked: Claude gets the failing test output and the message "Tests are failing. Fix them before you finish." Instead of ending its turn, Claude carries on. Usually it finds the broken test in `packages/shared/test/shared.test.ts`, puts `'doing'` back, and finishes once the tests pass. That's the hook doing its job. If you missed the moment, press `Ctrl+O` to open the transcript and scroll back. Press `Ctrl+O` again to close it.

Claude Code also limits how long a Stop hook can hold Claude: if the hook blocks eight times in a row and Claude hasn't used a tool in between, Claude Code overrides the next block and ends the turn.

**Why.** You saw the hook catch a failing test that Claude was told not to check. That's the point of a hook: it enforces the rule even when the instructions say otherwise.

### Step 5: Put the test back and commit the hook

**Do this.** Make sure the test file is back to how it was, whatever Claude did, and drop the comment too. Run these in a second terminal in the repo root, and keep Claude Code open in the first.

```bash
git restore packages/shared
```

```bash
npm test
```

Then ask Claude to commit the hook.

```text
Commit .claude/settings.json on its own, following the commit rule in CLAUDE.md.
```

From now on, the hook runs the tests at the end of every turn in this repository. It adds roughly 3 to 13 seconds to each turn, depending on your machine, so expect Claude to take a little longer to hand back control.

**What you should see.** `git restore` prints nothing. `npm test` passes, with the same counts as at the end of Step 2. Claude makes one commit, with a typed message such as `chore: add a Stop hook that runs the tests`.

**Why.** The hook is part of the repository now, so it guards everyone's sessions, not only yours.

### Step 6: Connect the Tasklane MCP server

**Do this.** Tasklane comes with a small, read-only MCP server in `apps/mcp`. It reads the local database and offers three tools: `list_tasks`, `open_tasks_by_assignee` and `get_user`. Ask Claude to register it for the project.

```text
Create .mcp.json in the repo root. Register one stdio MCP server called tasklane, with the command npx and the args tsx and apps/mcp/src/index.ts. Don't add anything else. Then commit .mcp.json on its own, following the commit rule in CLAUDE.md.
```

Quit Claude Code (press `Ctrl+D` twice on an empty prompt), then start it again from the repo root, so the new session reads `.mcp.json`.

```bash
claude
```

You may be asked to approve the `tasklane` server, because it comes from the project's `.mcp.json`. Approve it. Then check the server.

```text
/mcp
```

Close the panel, and ask a question that needs the task data.

```text
Which user has the most open tasks?
```

**What you should see.** `.mcp.json` holds one entry, `tasklane`, under `mcpServers`. In the `/mcp` panel, `tasklane` is listed as connected, with 3 tools. When you ask the question, Claude may ask before it calls a `tasklane` tool: approve it. Claude calls a tool such as `open_tasks_by_assignee`, then answers with a name and a number of open tasks, taken from the tool's result rather than from reading the code. Press `Ctrl+O` and confirm the name and number in Claude's answer match the tool's result. Press `Ctrl+O` again to close the transcript.

If Claude answers without calling a `tasklane` tool, ask it to use the server.

```text
Use the tasklane MCP server to answer.
```

If `tasklane` shows as failed, or isn't listed, check that you started `claude` from the repo root. Then compare your `.mcp.json` with the block in "If it goes wrong".

**Why.** MCP gives Claude a direct line to a system's data, and because `.mcp.json` is committed, everyone who clones the repository gets the same server.

## You're done when

- `/mcp` lists `tasklane` as connected.
- The `add-endpoint` skill loaded in Step 2, and `npm test` passes with your new endpoint's tests in it.
- The Stop hook blocked Claude at least once in Step 4.
- `git status` is clean, and `git log --oneline -5` shows your commits for the skill, the endpoint, the hook and `.mcp.json`.

In a virtual or mixed session, post ✅ in the chat when you're done. If you're stuck, post 🆘 and the step number, for example "🆘 step 6".

## If it goes wrong

- **The reset script lists uncommitted changes and stops.** Commit the changes if you want to keep them. To throw them away instead, run `./scripts/reset-lab.sh 3 --force`.
- **`/add-endpoint` isn't in the list of commands.** Check that the file is at `.claude/skills/add-endpoint/SKILL.md`, and that its front matter starts and ends with a `---` line. Then run `/reload-skills`, or quit Claude Code (press `Ctrl+D` twice on an empty prompt) and start `claude` again from the repo root.
- **Claude's skill is missing steps, or you want to start from a known-good one.** Replace the contents of `.claude/skills/add-endpoint/SKILL.md` with this, then run `/reload-skills`.

```markdown
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
```

- **Claude builds the endpoint without the skill.** Press `Esc`, ask Claude to undo its changes, then type `/add-endpoint` and paste the Step 2 prompt again.
- **`/hooks` doesn't list the Stop hook.** Quit Claude Code (press `Ctrl+D` twice on an empty prompt) and start `claude` again from the repo root. If it's still missing, the file may not be valid JSON. Run `node -e "require('./.claude/settings.json')"` from the repo root: it prints nothing when the file is valid, and the position of the mistake when it isn't. Copy the block from Step 3 again.
- **The hook didn't block in Step 4.** Claude may have run the tests and fixed the file before it finished. Break the test again as in Step 4, and paste the prompt again.
- **Claude can't finish any turn.** The tests are failing, so the hook keeps blocking. Run `npm test` in a second terminal to see which test fails. If it's the one you broke on purpose, run `git restore packages/shared`.
- **`tasklane` shows as failed in `/mcp`.** Quit Claude Code (press `Ctrl+D` twice on an empty prompt), change directory to the repo root, and start `claude` there. The server also needs the local database, which the reset script creates. If you deleted `apps/api/data/`, run `npm run setup` from the repo root. Then compare your `.mcp.json` with this block, and replace it if it differs.

```json
{
  "mcpServers": {
    "tasklane": {
      "command": "npx",
      "args": ["tsx", "apps/mcp/src/index.ts"]
    }
  }
}
```

- **You turned down the `tasklane` approval by mistake.** Quit Claude Code (press `Ctrl+D` twice on an empty prompt), run `claude mcp reset-project-choices` from the repo root, then start `claude` again and approve it this time.
- **You want to quit Claude Code.** Press `Ctrl+D` twice on an empty prompt.

## Stretch goals

- **A fourth MCP tool.** Ask Claude to add a search tool to the MCP server.

```text
Add a read-only search_tasks tool to the MCP server in apps/mcp. It takes a text query and returns the tasks whose title contains it. Follow the pattern of the existing tools, pass the query as a bound parameter, and add a test. Run npm test, then commit the change following the commit rule in CLAUDE.md.
```

When it's committed, open `/mcp`, choose `tasklane` and reconnect it, so it picks up the new tool. The panel now shows 4 tools. Then ask a question that needs it, such as "Which tasks mention the API?".

- **Check the server from the shell.** In a second terminal, from the repo root, run `claude mcp list`. It shows each MCP server Claude Code knows about for this folder, and whether it connects. You could also have registered the server from the shell with `claude mcp add --scope project`, which writes the same kind of entry into `.mcp.json`.

## Recap

You wrote down three of Tasklane's conventions as Claude Code extensions. A skill that Claude loads when a task matches it, a Stop hook that won't let Claude finish while the tests fail, and an MCP server that gives Claude Tasklane's data directly. All three live in the repository, in `.claude/` and `.mcp.json`, so the whole team gets them by cloning, and the hook keeps running the tests for you through the rest of the workshop.
