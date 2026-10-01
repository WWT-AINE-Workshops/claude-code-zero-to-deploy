# Lab 5: Deploy-ready: CI from red to green

**SDLC phase:** Operate · **Stage:** Agent Augmented · **Time:** 30 minutes

## Why this matters

"It works on my machine" isn't the bar for shipping. Continuous integration (CI) is a set of checks that run on a clean machine every time someone pushes, so the whole team sees the same result. If CI is stricter than your laptop, it catches what you've learned to ignore, such as a lint warning you scroll past every day.

In this lab you add a CI workflow to Tasklane with GitHub Actions, GitHub's built-in CI service. You open a pull request (PR), watch CI fail, read the exact failing line in the log, and fix the cause rather than hide it. Then you check the project against a short deploy-readiness list and close the gaps. You finish with every check green.

## Before you start

If Claude Code is still open from lab 4, quit it first: press `Ctrl+D` twice on an empty prompt. You start it again in Step 1, after the reset, so it loads this lab's settings fresh. If the API from lab 4 is still running, press `Ctrl+C` in its terminal.

Open a terminal in your copy of the workshop repository (the `my-claude-code-zero-to-deploy` folder) and run the reset script from the repo root.

```bash
./scripts/reset-lab.sh 5
```

What it changes: it switches you to a new branch called `lab-5` at the start of this lab, installs packages if they changed, and resets the local database to the seed data: 3 users and 12 tasks. This starting point has the reference solutions for labs 2 to 4: the id fix, `CLAUDE.md`, the `add-endpoint` skill, the Stop hook that runs the tests, the `tasklane` MCP server, and the search fix. Your own lab 4 work stays on your `lab-4` branch. It also points `origin/HEAD`, the branch your copy compares with, at `lab-5-base`: a branch on your copy of the repository that is the start of this lab. So your PR shows only your own work. It says so in a line that starts `Reviews of this branch`. If you have uncommitted changes, the script stops and lists them instead. See "If it goes wrong".

The Stop hook from lab 3 is on in this lab. It runs `npm test` each time Claude finishes, and blocks the finish while the tests fail. Expect each turn to take a few seconds longer.

This lab runs GitHub Actions on your copy of the repository on GitHub. Actions is on by default for a new repository. If you can't use it, the fallback in Step 2 shows you the same red and green on your own machine.

## Steps

### Step 1: Ask Claude for a CI workflow

**Do this.** Start Claude Code in the repo root.

```bash
claude
```

If Claude Code asks you to approve the `tasklane` MCP server from `.mcp.json`, approve it. Then paste this prompt.

```text
Create a GitHub Actions workflow at .github/workflows/ci.yml. Name the workflow ci, with one job called ci that runs on ubuntu-latest. Run it on pushes to main and on pull requests. Limit the push trigger to main, so a pull request branch doesn't run it twice. Steps, in order: check out the code with actions/checkout; set up Node 22 with actions/setup-node and its npm cache; then run npm ci, npm run lint -- --max-warnings 0, npm run typecheck and npm test. Write only this one file. Don't run lint or any of these commands, and don't change any other file, even if you notice something to fix: I want to see what CI finds on its own. Show me the file when you're done.
```

**What you should see.** Claude creates `.github/workflows/ci.yml` and shows it. The file has an `on:` section with `push` limited to `main`, and `pull_request`. It has one job that uses `actions/checkout` and `actions/setup-node` with Node 22 and an npm cache, then four `run` steps: `npm ci`, `npm run lint -- --max-warnings 0`, `npm run typecheck` and `npm test`. The version tags after `@` may differ from your neighbour's. If Claude changes any other file, or runs lint, press `Esc` and remind it that this step writes only the workflow. If Claude committed the workflow itself, that's fine: the commit in Step 2 then prints "nothing to commit", and you go on to push.

`npm ci` installs exactly the versions in the lock file. In `npm run lint -- --max-warnings 0`, the maximum of zero warnings makes ESLint fail when it finds even one warning, so in CI a warning breaks the build just as an error does.

**Why.** A workflow in the repository runs the same checks for everyone, on every PR, without anyone remembering to.

### Step 2: Commit, push and open a PR

**Do this.** Open a second terminal in the same folder. Check which branch you're on.

```bash
git branch --show-current
```

It prints `lab-5`. Run `git status`. If it lists `apps/api/src/server.ts` as changed, Claude edited it in Step 1: put it back with `git restore apps/api/src/server.ts`, so you commit only the workflow. Commit the workflow there: run `git add .github/workflows/ci.yml`, then `git commit -m "ci: run lint, typecheck and tests on pull requests"`. Push the branch with `git push -u origin HEAD`.

Then open the PR. Passing a title and a body means `gh` doesn't stop to ask for them.

```bash
gh pr create --base lab-5-base --title "ci: run lint, typecheck and tests on pull requests" --body "Adds a GitHub Actions workflow that installs with npm ci, then runs lint with no warnings allowed, the typecheck and the tests, on pushes to main and on pull requests."
```

Opening the PR starts the workflow. Watch its checks until they finish.

```bash
gh pr checks --watch
```

**What you should see.** `gh pr create` prints the web address of your new PR. `gh pr checks --watch` shows one check, `ci`, as pending, then refreshes until it finishes. It ends as failed. CI is red. If `gh` says no checks are reported, wait about 10 seconds and run it again.

The PR lists only your own commit, because its base is `lab-5-base`, the start of this lab, and not `main`. The commits that brought in labs 2 to 4 are already on the base.

If no check appears after a minute or so, see "If it goes wrong".

Fallback: if Actions is slow, blocked or out of minutes, run the workflow's four commands yourself, one at a time, from the repo root: `npm ci`, `npm run lint -- --max-warnings 0`, `npm run typecheck`, `npm test`. The lint command fails, as CI does. Carry on with Step 3 using its output, and your facilitator shows a real CI run on screen.

**Why.** CI runs on GitHub's machine, not yours, so a red check is something the whole team sees.

### Step 3: Read the failing log

**Do this.** A red check only tells you something failed. Read the log of the step that failed.

```bash
gh run view --log-failed
```

If it asks which run to view, pick the newest one for your `lab-5` branch.

Then run plain lint, the way you would on your laptop.

```bash
npm run lint
```

**What you should see.** `gh run view --log-failed` prints only the failed step's log, each line prefixed with the job and step names. The failed step is the lint step. It names one file, `apps/api/src/server.ts`, with one warning at line 19, `Empty block statement`, from the rule `no-empty`. Then ESLint says it found too many warnings, with a maximum of 0, and the step fails.

Plain `npm run lint` shows the same warning, but it passes. That's the gap: on your laptop the warning scrolls past, in CI it stops the build.

**Why.** The log tells you the file, the line and the rule. The red mark alone tells you none of that.

### Step 4: Fix the cause, not the warning

**Do this.** Open `apps/api/src/server.ts` and find line 19 if you want to see it for yourself: an empty `catch {}` in the shutdown code. Any error while the server shuts down is caught and thrown away, and the process still exits as if all went well.

There's a quick way to make the warning go away that isn't a fix: put a comment in the empty block, like `catch { /* ignore */ }`. ESLint stops warning, because the block is no longer empty, but the error is still swallowed. A real fix logs the error, or handles it. Go back to Claude Code and paste this prompt.

```text
CI fails at the lint step: no-empty reports an empty catch block in apps/api/src/server.ts, in the shutdown code. Fix it properly. Today any error during shutdown is swallowed and the process exits 0 as if all went well. Log the error and exit with a non-zero code, or handle it another way you can justify. Don't silence the warning: no comment inside an empty block, no eslint-disable, and no change that only turns the rule down. Then read the git log for eslint.config.js to see why no-empty is set to warn. If that reason no longer holds after your fix, remove the override in the same change. Run npm run lint -- --max-warnings 0, npm run typecheck and npm test. When all three pass, commit following the commit rule in CLAUDE.md. Don't push.
```

When Claude has finished, check it in your second terminal. Run `npm run lint -- --max-warnings 0`, then `git show --stat HEAD` to see what the commit changed. Then push with `git push`, and watch the checks again.

```bash
gh pr checks --watch
```

**What you should see.** Claude changes the `catch` in `apps/api/src/server.ts` so it takes the error, logs it and exits with a non-zero code, or something close to that. It reads the commit that set `no-empty` to `warn`, which says the relaxation was temporary while the team decided how to report shutdown errors, and removes that line from `eslint.config.js`. Strict lint passes with no warnings. The Stop hook runs the tests as Claude finishes, and they pass. `git show --stat HEAD` lists `apps/api/src/server.ts` and `eslint.config.js`, and the message starts with `fix`. After your push, `gh pr checks --watch` ends with `ci` passing. CI is green.

If Claude's change adds a comment inside the empty block, adds an `eslint-disable` comment, or only edits `eslint.config.js`, ask it why that isn't swallowing the error any more, and ask for a fix that logs or handles it.

**Why.** A swallowed error hides an outage. The warning was the only sign of it, so the fix belongs in the code, not in the lint settings.

### Step 5: Check the project is ready to deploy

**Do this.** Green CI says the code builds and its tests pass. Deploy-ready asks a bit more: can someone else start it, check it's alive and configure it, without reading the source? Paste this prompt into Claude Code.

```text
Audit this project for deploy readiness, from the repo root, against this checklist:
1. A start script: npm start from the repo root starts the API without watch mode.
2. A health endpoint that a load balancer could poll.
3. Configuration through environment variables, such as the port and the database location, with sensible defaults.
4. No secrets committed to the repo.
5. Run instructions in the README: how to install, set up, start the API and check it's healthy.
For each item, say pass or gap, and show the evidence: the file and the line, or the command you ran and its result. Then fix each gap, with the smallest change that closes it. Don't change items that pass. Run npm run lint -- --max-warnings 0, npm run typecheck and npm test, then commit following the commit rule in CLAUDE.md. Don't push.
```

When Claude has finished, push from your second terminal with `git push`, and watch the checks once more.

```bash
gh pr checks --watch
```

**What you should see.** Claude reports on each item with evidence. The health endpoint passes: `GET /api/health` in `apps/api/src/routes/health.ts`. Configuration passes: the port comes from `PORT` and the database file from `TASKLANE_DB`, each with a default. Secrets pass: nothing in the repo looks like a key or a password. Two items are typically gaps. The root `package.json` has no `start` script, only `apps/api` has one. And the README has no section on running the app. Claude adds a root `start` script that runs the API's own, and a short run section in `README.md`, then commits. Its wording and the exact README text are its own. After your push, `ci` passes again.

Claude may also point out that the API listens only on `127.0.0.1`, so it can't be reached from outside its own machine or container. That's a fair finding. If it changes this, check that it reads the address from an environment variable and keeps `127.0.0.1` as the default.

To try the start script, run `npm start` in your second terminal, then `curl http://localhost:3001/api/health` in a third. It returns `{"ok":true}`. Press `Ctrl+C` in the second terminal to stop it.

**Why.** A checklist turns "is it ready?" into questions with yes-or-no answers, and asking for evidence stops anyone, you or Claude, from answering from memory.

## You're done when

- `gh pr checks` shows the `ci` check passing on your PR.
- Your PR, into `lab-5-base`, has only your own commits: the workflow, the shutdown fix and the readiness fixes.
- `npm run lint -- --max-warnings 0` passes locally with no warnings.
- `npm start` from the repo root starts the API, and the README says how to run it.

In a virtual or mixed session, post ✅ in the chat when you're done. If you're stuck, post 🆘 and the step number, for example "🆘 step 3".

## If it goes wrong

- **`gh pr create` says `lab-5-base` doesn't exist.** Your copy was seeded without it. Run `./scripts/seed-github.sh` from the repo root, then run `gh pr create` again.
- **The reset script lists uncommitted changes and stops.** Commit the changes if you want to keep them. To throw them away instead, run `./scripts/reset-lab.sh 5 --force`.
- **CI is green on the first run.** Claude probably fixed `server.ts` in Step 1 as well. Run `git show --stat HEAD`. If it lists more than `.github/workflows/ci.yml`, put the two files back as they were at the start of the lab with `git restore --source=lab-5-start -- apps/api/src/server.ts eslint.config.js`. Run `git status`, and only if it lists changed files, commit with `git commit -am "chore: restore the shutdown code for lab 5"`. Then run `git push`. CI then goes red.
- **No check appears on the PR.** If `gh` says no checks are reported, wait about 10 seconds and run it again. If there's still none, open your copy on GitHub, then Settings, Actions, General, and check that Actions is allowed under "Actions permissions". If your organization blocks it, use the fallback in Step 2. Also check the workflow is at exactly `.github/workflows/ci.yml` on your branch.
- **Two `ci` checks appear for each push.** The workflow runs on every push as well as on the pull request. Ask Claude to limit the push trigger to `main`, commit, and push again.
- **`gh pr checks` says there's no pull request for this branch.** Run `gh pr create` from Step 2 first. If it asks where to push the branch, press `Ctrl+C`, run `git push -u origin HEAD`, then run it again.
- **`gh run view --log-failed` asks you to pick a run.** Pick the newest run whose branch is `lab-5`. If the run is still going, wait for `gh pr checks --watch` to finish first.
- **CI fails at a step other than lint.** Read that step's log with `gh run view --log-failed`, and paste the failing lines to Claude. Ask what's different between CI and your machine, and to fix the cause.
- **Claude's fix hides the error.** It added a comment in the empty block, an `eslint-disable` comment, or only changed `eslint.config.js`. Ask it for a fix that logs or handles the error, as in Step 4.
- **Claude keeps trying to finish and the hook keeps blocking it.** A test is red. Let it carry on. If it's stuck, run `npm test` in your second terminal to see which test fails, and tell Claude.
- **`npm start` fails because port 3001 is in use.** Another copy of the API is running. Find the terminal that runs it and press `Ctrl+C` there, or ask Claude to stop the server it started.
- **You want to quit Claude Code.** Press `Ctrl+D` twice on an empty prompt.

## Stretch goals

- **Package the API as a container image.** A container image bundles the app with everything it needs to run, so it starts the same way anywhere. Paste this prompt into Claude Code.

```text
Add a Dockerfile at the repo root that builds a container image for the API. Use an official Node 22 image, install with npm ci, run npm run setup to create the database, and start the API with npm start. The API must listen on all interfaces inside the container, and still default to 127.0.0.1 outside it, so read the host from an environment variable. Add a .dockerignore that keeps node_modules and the local database out of the image. Then add a step to .github/workflows/ci.yml, after the tests, that builds the image without pushing it anywhere. Explain each line of the Dockerfile. Run npm run lint -- --max-warnings 0, npm run typecheck and npm test, then commit following the commit rule in CLAUDE.md. Don't push.
```

Read the Dockerfile and Claude's explanation before you push. Then push, and watch `gh pr checks --watch` build the image.

## Recap

You added a CI workflow, watched it fail on a warning that your laptop had been letting through, and read the exact line in the failed step's log. You fixed the cause, a swallowed error in the shutdown code, rather than silencing the warning, and CI went green. Then you checked the project against a deploy-readiness list, with evidence for each item, and closed the gaps. That's the habit to keep: let CI be strict, read the log, and never swallow an error.
