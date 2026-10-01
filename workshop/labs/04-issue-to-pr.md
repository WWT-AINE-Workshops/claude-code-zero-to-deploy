# Lab 4: From issue to PR, with a security review

**SDLC phase:** Secure & Release · **Stage:** Agent Augmented · **Time:** 30 minutes

## Why this matters

A bug report describes the symptom: what someone saw. The cause can be somewhere else, and sometimes it is worse than the symptom. Fix only what the report describes, and the cause can stay in place.

In this lab you take issue 2 from Tasklane's tracker all the way to a pull request (PR), the request on GitHub to merge your branch into another one. On the way you ask Claude two different questions about the same code: "why does it break?" and "how could someone abuse it?". Then you fix it with tests, open a small PR, and run a security review on your change.

## Before you start

If Claude Code is still open from lab 3, quit it first: press `Ctrl+D` twice on an empty prompt. You start it again in Step 2, after the reset, so it loads this lab's settings fresh.

Open a terminal in your copy of the workshop repository (the `my-claude-code-zero-to-deploy` folder) and run the reset script from the repo root.

```bash
./scripts/reset-lab.sh 4
```

What it changes: it switches you to a new branch called `lab-4` at the start of this lab, installs packages if they changed, and resets the local database to the seed data: 3 users and 12 tasks. This starting point has the reference solutions for labs 2 and 3: the id fix, a `CLAUDE.md` with a commit rule, the `add-endpoint` skill, the Stop hook that runs the tests, and the `tasklane` MCP server. Your own lab 3 work stays on your `lab-3` branch. It also points `origin/HEAD`, the branch your copy compares with, at `lab-4-base`: a branch on your copy of the repository that is the start of this lab. So your PR and the security review show only your own work. It says so in a line that starts `Reviews of this branch`. If you have uncommitted changes, the script stops and lists them instead. See "If it goes wrong".

The Stop hook from lab 3 is on in this lab. It runs `npm test` each time Claude finishes, and blocks the finish while the tests fail. Expect each turn to take roughly 3 to 13 seconds longer.

## Steps

### Step 1: Read the issue and reproduce it

**Do this.** Open a second terminal in the same folder. Read issue 2 there.

```bash
gh issue view 2
```

Then start the API in that terminal. It keeps running, so leave this terminal open.

```bash
npm run dev
```

Open a third terminal in the same folder, and search for the task the issue mentions. The double quotes around the address keep your shell from reading the apostrophe.

```bash
curl -i "http://localhost:3001/api/tasks?q=O'Brien"
```

**What you should see.** `gh issue view 2` prints the issue "Search fails with a 500 when a title has an apostrophe", with steps to reproduce and acceptance criteria. `npm run dev` logs a line that says the server is listening on port 3001. The curl output starts with `HTTP/1.1 500 Internal Server Error`, and its last line is `{"error":"internal error"}`. In the second terminal, the server logs an error for that request.

**Why.** You've seen the symptom for yourself, so you'll know when it's gone, and you have the exact request to test against.

### Step 2: Ask for the root cause

**Do this.** Go back to your first terminal and start Claude Code in the repo root.

```bash
claude
```

What this does: starts an interactive Claude Code session in the repo root. It changes no files.

If Claude Code asks you to approve the `tasklane` MCP server from `.mcp.json`, approve it. Then paste this into the Claude Code prompt and press Enter:

```prompt
Read issue 2 with gh issue view 2. The API is already running on port 3001 in another terminal, so don't start another one. Reproduce the 500 with curl and show me the response. Then find the root cause: the file, the function and the exact line, and explain why an apostrophe breaks it. Don't change any files yet.
```

Claude may ask before it runs `gh` or `curl`. Read each request, then approve it.

**What you should see.** Claude shows the 500 response first. Then it points to `listTasks` in `apps/api/src/repo.ts`, quotes the line that adds the title search to the query, and explains how the apostrophe in `O'Brien` ends up breaking the SQL that the database runs. It may also read the server's error in the log. Its wording is its own. If it changes a file, press `Esc` and remind it that this step only reads.

**Why.** "Why does it crash?" is the question the issue asks. You need that answer before you can ask the next, harder question.

### Step 3: Ask for a security review of the search code

**Do this.** Ask Claude to look at the same code as an attacker would. Paste this into the Claude Code prompt and press Enter:

```prompt
Now review the search code in listTasks for security, not for the bug. Look at the two text filters separately: q, which searches titles, and assignee, which searches user names. For each one, tell me whether a caller could abuse it by sending a crafted value, how, and why or why not. Quote the lines that decide it. Don't change any files.
```

When Claude has answered, try the kind of request it describes, in your third terminal. This sends a search text with quotes and SQL in it. Search text with spaces and quotes has to be encoded before it can go in a web address: the curl options `-G --data-urlencode` do that for you. If Claude didn't describe one, run it anyway.

```bash
curl -G "http://localhost:3001/api/tasks" --data-urlencode "q=zzz' OR 1=1 --"
```

**What you should see.** Claude names a kind of attack for the title search, explains what a caller could send, and says what they could do with it. For the assignee search, it reaches its own conclusion and explains it by how the value reaches the database. A good answer treats the two filters differently and gives a reason for each, not a general warning about both.

The curl returns status 200 and a page of tasks, with `"total":12` near the end. No task title contains `zzz`, yet the search matched all 12 tasks. That's the problem Claude described, working for real.

If Claude says both filters are safe, or both unsafe, ask it to prove each answer with a request, as in "If it goes wrong".

**Why.** The bug report only said "crash". Asking a security question about the same lines shows whether the crash is a sign of something worse.

### Step 4: Fix it and test it in one request

**Do this.** Check which branch you're on. In your third terminal, run:

```bash
git branch --show-current
```

It prints `lab-4`, the branch the reset made for you. That's the branch your PR comes from, so you never commit to `main` directly.

The next prompt asks for the fix and its tests in one request, on purpose: if you asked for a failing test first and the fix later, the Stop hook would block Claude from finishing the first turn, because a test is red.

Now go back to Claude Code, paste this into the Claude Code prompt and press Enter:

```prompt
Fix issue 2. In listTasks, pass the title search text to the database as a bound parameter, the way the other filters pass their values, and keep the assignee search as it is. In the same change, add tests to apps/api/test: a search for O'Brien returns 200 and only task 9; a search for zzz' OR 1=1 -- returns 200 with a total of 0; an ordinary word such as roadmap still matches. Do the fix and the tests together in this turn. Run npm test, and when it passes, commit the fix and the tests as one fix commit, following the commit rule in CLAUDE.md.
```

When Claude has finished, check the result in your third terminal. The server reloads on its own when a file changes.

```bash
curl -i "http://localhost:3001/api/tasks?q=O'Brien"
```

```bash
curl -G "http://localhost:3001/api/tasks" --data-urlencode "q=zzz' OR 1=1 --"
```

```bash
npm test
```

Then look at the commit.

```bash
git log -1 --oneline
```

What this does: prints your last commit on one line. It changes nothing.

**What you should see.** Claude changes the title search in `apps/api/src/repo.ts`, adds a test file or extends an existing one, runs `npm test` and commits. The Stop hook runs the tests once more as Claude finishes, and they pass, so it doesn't block. The first curl now starts with `HTTP/1.1 200 OK`, and its body holds one task, task 9, "Plan the interview with O'Brien Logistics", with `"total":1`. The second returns `"total":0` and an empty `items` list. `npm test` passes, and the `apps/api` count is higher than the 47 you start with. `git log -1 --oneline` shows one commit whose message starts with `fix`, such as `fix(api): bind the title search as a parameter`.

If Claude commits the test and the fix separately, or changes the assignee search too, paste this into the Claude Code prompt and press Enter:

```prompt
Explain why you committed the test and the fix separately, or why you changed the assignee search.
```

Keep the commit to what issue 2 needs.

**Why.** A fix with a test for the attack, not only for the apostrophe, keeps the hole closed the next time someone edits this query.

### Step 5: Look at your change and open the PR

**Do this.** In your third terminal, look at your own commit. Press `q` to leave the diff.

```bash
git diff origin/lab-4-base...HEAD
```

What this does: compares your branch with the start of this lab. It changes nothing.

Push your branch to your copy on GitHub.

```bash
git push -u origin HEAD
```

What this does: pushes the current branch and remembers where it went. It changes no files.

Then open the PR. Passing a title and a body means `gh` doesn't stop to ask you for them. If Claude's commit message reads better than this title, use it instead.

```bash
gh pr create --base lab-4-base --title "fix(api): bind the title search as a parameter" --body "Fixes #2. The title search now passes its text to the database as a bound parameter, so an apostrophe no longer breaks the query and SQL in the search text is treated as plain text. Adds tests for O'Brien and for an injection payload."
```

```bash
gh pr view
```

**What you should see.** `git diff origin/lab-4-base...HEAD` shows only your change: a few lines in `apps/api/src/repo.ts` and the new tests. `git push` ends with a line that says your `lab-4` branch is set up to track `origin/lab-4`. `gh pr create` prints the web address of your new PR. `gh pr view` shows the PR as open, merging `lab-4` into `lab-4-base`, with your title and body.

The PR lists only your own work, because its base is `lab-4-base`, the start of this lab, and not `main`. The commits that brought in labs 2 and 3 are already on the base.

The GitHub CLI's help for `gh pr create` explains that a body that mentions `Fixes #2` closes issue 2 when the PR is merged. GitHub does that only for a PR into the repository's default branch, `main`. This PR goes into `lab-4-base`, so `Fixes #2` stays plain text: it doesn't link the issue, and merging wouldn't close it. Don't merge it in this lab.

**Why.** A small PR with its tests is quick to review, and the issue number in its body tells the reviewer why it exists.

### Step 6: Run a security review on the branch

**Do this.** The security review compares your branch with `origin/HEAD`, which the reset pointed at `lab-4-base`. Check it in your third terminal:

```bash
git rev-parse --abbrev-ref origin/HEAD
```

Then go back to Claude Code and run the security review. Type this into the Claude Code prompt and press Enter:

```prompt
/security-review
```

Fallback: if `/security-review` isn't available in your version, or it takes more than a few minutes, press `Esc`. Then paste this into the Claude Code prompt instead and press Enter:

```prompt
Review the change in git diff origin/lab-4-base...HEAD for security problems: injection, data exposure, missing input checks, and anything else an attacker could use. Look at the changed lines and the code they call. Report only issues you are confident are real and exploitable, each with the file, the line and how it would be exploited. If you find none, say so.
```

**What you should see.** `git rev-parse` prints `origin/lab-4-base`. `/security-review` reads every change on your branch since the start of this lab, which is your fix and its tests, and reports what it finds. For your fix, a good result is that it finds no new problem. It may say that the title search is now safe. If it flags your fix, paste this into the Claude Code prompt and press Enter:

```prompt
Show me the request that would exploit the problem you found in my fix.
```

`/security-review` only looks at what your branch changes. The hole you fixed was already there at the start of the lab, so a review of a branch could never have found it. Your question in Step 3 is what found it. Use both: a security question when you read code, and a security review on every PR.

**Why.** A security review of each PR checks that a change doesn't open a new hole, even one that fixes an old one.

## You're done when

- `gh pr view` shows your PR as open, from `lab-4` into `lab-4-base`.
- `git diff origin/lab-4-base...HEAD` shows your fix and tests, and one test sends an injection payload and expects no matches.
- `npm test` passes.
- The `O'Brien` search (the first `curl` in Step 4) returns 200 and task 9.
- You ran `/security-review`, or the fallback prompt, and read what it found.

In a virtual or mixed session, post ✅ in the chat when you're done. If you're stuck, post 🆘 and the step number, for example "🆘 step 5".

When you finish, stop the API: press `Ctrl+C` in the second terminal.

## If it goes wrong

- **The reset script lists uncommitted changes and stops.** Commit the changes if you want to keep them. To throw them away instead, run `./scripts/reset-lab.sh 4 --force`.
- **`gh issue view 2` says the issue can't be found.** Your copy wasn't seeded with the workshop's issues. Run `./scripts/seed-github.sh` from the repo root, then try again. If `gh` says you aren't signed in, run `gh auth login` first.
- **curl says "URL rejected" or "Malformed input".** You sent the attack text straight in the address, with its spaces and quotes, so curl refused to send anything. Use the form with `-G --data-urlencode` from Step 3.
- **curl says it failed to connect.** The API isn't running. Start it in your second terminal with `npm run dev`.
- **`npm run dev` fails because port 3001 is in use.** Another copy of the API is running, maybe one Claude started. Find the terminal that runs it and press `Ctrl+C` there. If Claude started it, paste this into the Claude Code prompt and press Enter:

  ```prompt
  Stop the API server you started on port 3001.
  ```

- **Claude says both filters are safe, or both unsafe.** Ask it for evidence, one filter at a time. Paste this into the Claude Code prompt and press Enter:

```prompt
Prove each answer with a request. With the API on port 3001, use curl -G with --data-urlencode to send zzz' OR 1=1 -- first as q and then as assignee. Show me the total in each response, and explain the difference from the code.
```

- **Claude keeps trying to finish and the hook keeps blocking it.** A test is red, often because Claude wrote the tests before the fix. Let it carry on: it usually finishes the fix, and the hook lets it stop once the tests pass. If it's stuck, run `npm test` in your third terminal to see which test fails, and tell Claude.
- **The commit message doesn't start with `fix`.** Paste this into the Claude Code prompt and press Enter:

  ```prompt
  Amend the last commit's message, following the commit rule in CLAUDE.md.
  ```

- **`gh pr create` asks where to push the branch.** The branch isn't on GitHub yet. Press `Ctrl+C`, run `git push -u origin HEAD`, then run `gh pr create` again.
- **`gh pr create` says a pull request already exists.** You already opened it. Run `gh pr view` to see it.
- **`/security-review` stops with an "ambiguous argument" error, or `git rev-parse --abbrev-ref origin/HEAD` doesn't print `origin/lab-4-base`.** Your copy lost track of the lab's base. In your third terminal, run `git fetch origin lab-4-base`, then `git remote set-head origin lab-4-base`, then run `/security-review` again. Don't run `git remote set-head origin --auto`: it points `origin/HEAD` at `main`, and the review then reads the lab 2 and lab 3 changes too.
- **`gh pr create` or `git fetch origin lab-4-base` says `lab-4-base` doesn't exist.** Your copy was seeded without it. Run `./scripts/seed-github.sh` from the repo root, then try again.
- **`/security-review` isn't recognised, or runs for a long time.** Press `Esc` and use the fallback prompt in Step 6.
- **You want to quit Claude Code.** Press `Ctrl+D` twice on an empty prompt.

## Stretch goals

- **Review a teammate's PR.** Your copy has a draft PR, one marked as not ready to merge yet, from a teammate who adds a list of users to the API. Review it with Claude, the way you'd review a colleague's work. First make sure your own work is committed (`git status` shows nothing to commit), then quit Claude Code: press `Ctrl+D` twice on an empty prompt. In your first terminal, list the PRs and check out the teammate's.

```bash
gh pr list
```

```bash
gh pr checkout users-v2
```

This branch was made before labs 2 and 3, so it has no `CLAUDE.md`, no Stop hook and none of the earlier fixes. That's expected. Start Claude Code from the repo root.

```bash
claude
```

What this does: starts a new Claude Code session on the teammate's branch. It changes no files.

Paste this into the Claude Code prompt and press Enter:

```prompt
Review the pull request on this branch as a careful teammate would. Read its description with gh pr view, and its changes with gh pr diff. If you use git, compare with git diff main...HEAD, not main...users-v2, because a tag and a branch share the name users-v2. Look for security and privacy problems, and for anything that only looks risky but isn't. For each finding, say how serious it is, why, and what the smallest fix would be. Don't change any files.
```

Check what Claude flags against the code yourself, and ask for evidence. Don't push changes to your teammate's branch. When you're done, quit Claude Code (press `Ctrl+D` twice on an empty prompt) and go back to your own branch.

```bash
git switch lab-4
```

## Recap

You took a bug report that said "crash" and found out it was a security hole: the search text was being run as SQL. You fixed it with a bound parameter, added a test for the attack as well as the apostrophe, and opened a small PR that links the issue. Then you ran a security review on the branch, and saw why it confirms a change is safe but can't find a hole that was already on `main`. Asking "how could someone abuse this?" while you read code is what found it.
