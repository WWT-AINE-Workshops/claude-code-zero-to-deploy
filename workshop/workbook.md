# Workbook

Use this workbook as you go. Each lab has one page: its goal, a checkpoint you tick off, and space for notes. A glossary at the end explains the terms. Fill in the notes at the end of each lab, so you have something to take back to your own work.

---

## Lab 1: Start right: a new project with best practices

**Goal.** Build a small project from an empty folder. Write your own rules into `CLAUDE.md`, plan a change before Claude makes it, and commit in small steps with typed messages.

**Checkpoint.** Tick each box when it's true.

- [ ] `node --test` passes, with `fail 0`.
- [ ] `git log --oneline` shows at least two commits in the `type: summary` form, with or without a scope.
- [ ] `CLAUDE.md` holds your own rules: the test command, your style rule, the dependency rule and the commit rule.

In a virtual or mixed session, post ✅ in the chat when you're done. If you're stuck, post 🆘 and the step number.

**Notes.**

What I did:

....................................................................................................

What surprised me:

....................................................................................................

The rule I wrote in `CLAUDE.md` that I will reuse:

....................................................................................................

What I will try in my own work:

....................................................................................................

---

## Lab 2: Drop into an unknown codebase

**Goal.** Find your way around a project you have never seen, using only questions to Claude. Then reproduce one real bug and fix it with a test.

**Checkpoint.** Tick each box when it's true.

- [ ] `npm test` passes, including the new test for a bad id.
- [ ] `git log -1 --oneline` shows a `fix` commit, in the `fix: summary` or `fix(scope): summary` form.
- [ ] The bad-id request (the first `curl` in Lab 2 Step 5) returns 400 with `{"error":"invalid id"}`.
- [ ] You have an answer to each of the three orientation questions, and you know where each one came from.

**Notes.**

My answers to the orientation questions, and where each came from:

1. ............................................................................................................................................

2. ............................................................................................................................................

3. ............................................................................................................................................

What I did:

....................................................................................................

What surprised me:

....................................................................................................

What I will try in my own work:

....................................................................................................

---

## Lab 3: Extend Claude Code: a skill, a hook and an MCP server

**Goal.** Turn three of your team's conventions into extensions that live in the repository: a skill, a hook that runs the tests when Claude tries to finish, and an MCP server.

**Checkpoint.** Tick each box when it's true.

- [ ] `/mcp` lists `tasklane` as connected.
- [ ] The `add-endpoint` skill loaded in Step 2, and `npm test` passes with your new endpoint's tests in it.
- [ ] The Stop hook blocked Claude at least once in Step 4.
- [ ] `git status` is clean, and `git log --oneline -5` shows your commits for the skill, the endpoint, the hook and `.mcp.json`.

**Notes.**

A convention in my own team that could be a skill:

....................................................................................................

A rule in my own work that must happen every time, so it could be a hook:

....................................................................................................

A tool or data source I would connect through MCP:

....................................................................................................

What surprised me:

....................................................................................................

---

## Lab 4: From issue to PR, with a security review

**Goal.** Take an issue all the way to a pull request. Ask Claude why the code breaks and how it could be abused, fix it with tests, open a small PR and run a security review.

**Checkpoint.** Tick each box when it's true.

- [ ] `gh pr view` shows your PR as open, from `lab-4` into `main`.
- [ ] `git diff HEAD~1` shows your fix and tests, and one test sends a crafted search value and expects no matches.
- [ ] `npm test` passes.
- [ ] The `O'Brien` search (the first `curl` in Lab 4 Step 4) returns 200 and one task.
- [ ] You ran `/security-review`, or the fallback prompt, and read what it found.

**Notes.**

The two questions I asked Claude about the same code, and how the answers differed:

....................................................................................................

What `/security-review` found:

....................................................................................................

What I will try in my own work:

....................................................................................................

---

## Lab 5: Deploy-ready: CI from red to green

**Goal.** Add a CI workflow, open a pull request and watch CI fail. Read the failing log, fix the cause and check the project against a deploy-readiness list. Finish with every check green.

**Checkpoint.** Tick each box when it's true.

- [ ] `gh pr checks` shows the `ci` check passing on your PR.
- [ ] Your PR has your own commits for the workflow, the fix for the failing check and the readiness fixes, after the lab 2 to 4 reference commits.
- [ ] `npm run lint -- --max-warnings 0` passes locally with no warnings.
- [ ] `npm start` from the repo root starts the API, and the README says how to run it.

**Notes.**

What the failing log told me that the red mark did not:

....................................................................................................

The items on the readiness list that I would add for my own project:

....................................................................................................

What I will try in my own work:

....................................................................................................

---

## My takeaway

The one thing I will do differently on Monday:

....................................................................................................

---

## Glossary

**CLAUDE.md.** A file that Claude Code reads at the start of every session. You write your rules in it once, such as how to run the tests and what commit format to use. Keep it short, and commit it so your team shares it. (Labs 1 and 2)

**Plan mode.** A permission mode where Claude reads files and answers questions but changes nothing. It proposes a plan, and you approve it or ask for changes. Press `Shift+Tab` until the status bar shows plan mode. (Lab 1)

**Skill.** A folder with a `SKILL.md` file that holds instructions for one kind of task. Claude loads it when a task matches its description. (Lab 3)

**Hook.** A command that Claude Code runs itself at a set point, such as when Claude finishes responding. Unlike a rule in `CLAUDE.md`, it runs every time. (Lab 3)

**MCP.** The Model Context Protocol, an open standard for connecting AI tools to other tools and data. An MCP server gives Claude extra tools. Connect only servers you trust. (Lab 3)

**Conventional Commits.** A commit message format with a type in front, in the shape `type(scope): summary`, such as `feat(cli): add a status filter`. The type says what kind of change it is. The format is defined at conventionalcommits.org. (Labs 1 to 5)

**Scenario check.** A test that proves a bug is fixed: a check that fails while the bug exists and passes once it is fixed. The test you ask Claude to add in Labs 2 and 4 works this way. (Labs 2 and 4)

**CI.** Continuous integration: checks that run on a clean machine every time someone pushes, so the whole team sees the same result. With GitHub Actions, the checks are defined in a workflow file in `.github/workflows`. (Lab 5)

**`--max-warnings`.** An ESLint option that sets how many warnings are allowed before ESLint exits with an error. With `--max-warnings 0`, a single warning fails the run. (Lab 5)
