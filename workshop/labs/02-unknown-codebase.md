# Lab 2: Drop into an unknown codebase

**SDLC phase:** Build & Test · **Stage:** AI-Integrated · **Time:** 30 minutes

## Why this matters

Sooner or later you join a project you've never seen. Someone else wrote it, the people who know it are busy, and there's a bug with your name on it. In this lab that project is Tasklane, a small team task tracker with a REST API (a set of web addresses that other programs call to read and change data).

You use only Claude Code to find your way around: what the parts are, how to run the tests, and why the code is the way it is. Then you fix one real bug. You make the bug happen first, so you know what "fixed" looks like, and you give Claude a test it can run to check its own work.

## Before you start

You work in your own copy of the workshop repository, the one you made in pre-work. Pre-work also opened issues in your copy on GitHub, and this lab uses issue 1. Lab 1 ran in a folder of its own and left nothing in this repository, so lab 2 starts from the same commit as `main`.

Open a terminal in your copy (the `my-claude-code-zero-to-deploy` folder) and run the reset script from the repo root.

```bash
./scripts/reset-lab.sh 2
```

What it changes: it switches you to a new branch called `lab-2` at the start of this lab, installs packages if they changed, and resets the local database to the seed data: 3 users and 12 tasks. It ends with a line that says you're at the start of Lab 2 on branch `lab-2`. If you have uncommitted changes, it stops and lists them instead. See "If it goes wrong".

## Steps

### Step 1: Ask for a tour and a test run

**Do this.** Start Claude Code in the repo root.

```bash
claude
```

What this does: starts an interactive Claude Code session in the repo root. It changes no files.

If Claude Code asks whether you trust the folder, say yes: it's your own copy. Then paste this into the Claude Code prompt and press Enter:

```prompt
I'm new to this repository. Give me a short tour of its architecture: the apps and packages, what each one does, how a request flows through the API, where the data lives and how the tests are organised. Then run the test suite and tell me the result. Don't change any files.
```

Claude may ask before it runs a command such as `npm test`. Read each request, then approve it.

**What you should see.** Claude reads files before it answers, then describes a TypeScript project with two apps and a shared package: an API in `apps/api`, an MCP server in `apps/mcp`, and shared types in `packages/shared`. It runs the tests, and every one passes: 2 tests in `packages/shared`, 36 in `apps/api` and 13 in `apps/mcp`. Claude's tour is in its own words and differs from run to run. If it changes a file, press `Esc` and remind it that this step only reads.

**Why.** Exploring before you change anything shows you how the project fits together, and a passing test run is your baseline.

### Step 2: Answer three orientation questions

**Do this.** Ask Claude these three questions, one at a time, in your own words. Ask it to tell you where it found each answer.

1. Which commit added the task routes, and who wrote it?
2. Why was the search feature added?
3. How do you reset the local database to its seed data, using the app's own scripts? (`./scripts/reset-lab.sh` belongs to the workshop, so it doesn't count.)

Write each answer down in a line or two. Your facilitator may ask for one.

**What you should see.** Claude runs commands or reads files to find each answer, and names its source: a commit, a file or a script. The first answer names a commit by its message and an author. The second gives a reason a person had, not only a description of what search does. The third names a command you could run. If Claude guesses, or answers from the code alone, paste this into the Claude Code prompt and press Enter:

```prompt
Show me the evidence for that answer: the command you ran, or the file and line you read.
```

If it drifts, use the prepared prompts in "If it goes wrong".

**Why.** You can ask Claude the questions you'd ask a teammate, and the answers to "who" and "why" are rarely in the code itself.

### Step 3: Run /init and keep your commit rule

**Do this.** Ask Claude Code to write a `CLAUDE.md` for Tasklane, the file Claude Code reads at the start of every session. Type this into the Claude Code prompt and press Enter:

```prompt
/init
```

Read the `CLAUDE.md` it writes. Then add the rules you started in lab 1, so every session in this repository follows them. Paste this into the Claude Code prompt and press Enter:

```prompt
Add a Rules section to CLAUDE.md with two rules. First: write commit messages as Conventional Commits, for example feat(api): add a due date to tasks. Second: run npm test before you say a change is done. Then commit CLAUDE.md on its own, following the commit rule.
```

**What you should see.** `/init` reads the repository and writes `CLAUDE.md` in the repo root. It describes the layout and the commands to build, run and test the project. Its wording is Claude's own. If `/init` asks you follow-up questions, answer briefly or accept its suggestions. After your prompt, the file has a Rules section with both rules, and Claude makes one commit whose message starts with a type, such as `docs:`.

**Why.** A rule in `CLAUDE.md` is one you write once and Claude follows in every session after it, including the fix you're about to commit.

### Step 4: Read the issue and reproduce the bug

**Do this.** Open a second terminal in the same folder. Read issue 1 there.

```bash
gh issue view 1
```

Then start the API in that terminal. It keeps running, so leave this terminal open.

```bash
npm run dev
```

Open a third terminal in the same folder, and ask the API for a task with an id that isn't a number.

```bash
curl -i http://localhost:3001/api/tasks/abc
```

**What you should see.** `gh issue view 1` prints the issue "Invalid task id returns 500 instead of 400", with steps to reproduce and what should happen instead. `npm run dev` logs a line that says the server is listening on port 3001. The curl output starts with `HTTP/1.1 500 Internal Server Error`, and its last line is the body `{"error":"internal error"}`. That's the bug: a bad id is the caller's mistake, but the API answers as if the server broke.

**Why.** You've seen the bug happen with your own eyes, so you'll know for sure when it's gone.

### Step 5: Fix it, test it, commit it

**Do this.** Go back to Claude Code in your first terminal. Paste this into the Claude Code prompt and press Enter:

```prompt
Fix issue 1. Read it with gh issue view 1. The API is already running on port 3001 in another terminal, so don't start another one. First reproduce the bug with curl and show me the response. Then fix it so a bad id returns 400 with the body {"error":"invalid id"}, and add a test for it. Keep the change to what the issue needs. Run npm test, and when it passes, commit the fix and the test as a fix commit, following the commit rule in CLAUDE.md.
```

When Claude has finished, check the result yourself in the third terminal. The server reloads on its own when a file changes, so you don't need to restart it.

```bash
curl -i http://localhost:3001/api/tasks/abc
```

```bash
curl -i http://localhost:3001/api/tasks/1
```

Then run the tests.

```bash
npm test
```

Finally, look at your last commit.

```bash
git log -1 --oneline
```

What this does: prints your last commit on one line. It changes nothing.

**What you should see.** Claude shows the 500 response before it changes anything. Then it changes how the API checks an id, adds a test, runs `npm test` and commits. Its exact steps differ from run to run. Look for a failing result before the change and a passing one after it. In your third terminal, the first curl now starts with `HTTP/1.1 400 Bad Request`, and its body is `{"error":"invalid id"}`. The second returns status 200 and task 1. `npm test` passes, and the `apps/api` test count is higher than the 36 from Step 1. `git log -1 --oneline` shows a message that starts with `fix`, such as `fix(api): return 400 for an invalid task id`.

If Claude fixed the bug without showing the 500 first, that's fine this time, but notice it. Next time, ask it to reproduce before it changes anything.

**Why.** A fix you watched fail, then pass, with a test that keeps it fixed, is one you can trust without reading every line.

## You're done when

- `npm test` passes, including the new test for a bad id.
- `git log -1 --oneline` shows a `fix` commit, in the `fix: summary` or `fix(scope): summary` form.
- The bad-id request (the first `curl` in Step 5) returns 400 with `{"error":"invalid id"}`.
- You have an answer to each of the three orientation questions, and you know where each one came from.

In a virtual or mixed session, post ✅ in the chat when you're done. If you're stuck, post 🆘 and the step number, for example "🆘 step 4".

When you finish, stop the API: press `Ctrl+C` in the second terminal.

## If it goes wrong

- **The reset script lists uncommitted changes and stops.** Commit the changes if you want to keep them. To throw them away instead, run `./scripts/reset-lab.sh 2 --force`.
- **Orientation drifts, or Claude can't find an answer.** Use these prepared prompts, one at a time.

For the first question, paste this into the Claude Code prompt and press Enter:

```prompt
Use git log to find the commit that first added the file with the task routes in apps/api/src/routes/. Tell me its subject and its author, and show me the command you ran.
```

For the second question, paste this into the Claude Code prompt and press Enter:

```prompt
Find the commit that added search to the tasks API, and show me its full commit message. What does the message say about why search was added?
```

For the third question, paste this into the Claude Code prompt and press Enter:

```prompt
Which command resets the local database to its seed data? Look in the package.json files, not in scripts/reset-lab.sh. Show me where the command is defined and which file it runs.
```

- **`gh issue view 1` says the issue can't be found.** Your copy wasn't seeded with the workshop's issues. Run `./scripts/seed-github.sh` from the repo root, then try again. If `gh` says you aren't signed in, run `gh auth login` first.
- **curl says it failed to connect.** The API isn't running. Start it in your second terminal with `npm run dev`.
- **`npm run dev` fails because port 3001 is in use.** Another copy of the API is running, maybe one Claude started. Find the terminal that runs it and press `Ctrl+C` there. If Claude started it, paste this into the Claude Code prompt and press Enter:

  ```prompt
  Stop the API server you started on port 3001.
  ```

- **curl still returns 500 after the fix.** Look at the second terminal for an error. If the server stopped, press `Ctrl+C` and start it again with `npm run dev`.
- **The commit message doesn't start with `fix`.** Check that the commit rule is in `CLAUDE.md`. Then paste this into the Claude Code prompt and press Enter:

  ```prompt
  Amend the last commit's message so it follows the commit rule in CLAUDE.md.
  ```

- **The commit fails because git doesn't know who you are.** Set your name and email with the two `git config --global` commands from pre-work, then ask Claude to commit again.
- **Claude starts changing code you didn't ask about.** Press `Esc` to stop it. Then paste this into the Claude Code prompt and press Enter:

  ```prompt
  Undo the change you just made that issue 1 doesn't need, and keep to issue 1.
  ```

- **You want to quit Claude Code.** Press `Ctrl+D` twice on an empty prompt.

## Stretch goals

- **A request-flow diagram.** Ask Claude to draw how a request moves through the API. Paste this into the Claude Code prompt and press Enter:

```prompt
Draw a text diagram of how GET /api/tasks/:id flows through the API, from the incoming request to the database and back, including what happens when the id is bad. Name the file and function at each step.
```

- **More bad ids.** With the API running, try ids that look like numbers but aren't plain whole numbers.

```bash
curl -i http://localhost:3001/api/tasks/1.0
```

```bash
curl -i http://localhost:3001/api/tasks/0x10
```

Both should return 400 with `{"error":"invalid id"}`. If either returns a task, paste this into the Claude Code prompt and press Enter:

```prompt
Tighten the id check so ids like 1.0 and 0x10 return 400, and add both cases to the test. Then commit it as another fix commit, following the commit rule in CLAUDE.md.
```

## Recap

You found your way around a project you'd never seen, using only questions to Claude: its architecture, its tests, and the history behind its code. The typed commit messages in Tasklane's history are the same Conventional Commits you wrote in lab 1, and they told Claude what each change was. Then you wrote down your rules in `CLAUDE.md`, reproduced a bug, and let Claude fix it with a test it could run to check its own work.
