# Best practices

This is a take-home reference. Each practice says what to do, why it works, and which lab step practised it. Most of them follow from one fact about Claude Code: its context fills up fast, and it works worse as it fills. So you give it less to guess, a way to check its own work, and small steps.

Step references read "Lab 2 Step 4", so you can go back to the exact place in the lab.

## Working with Claude

### 1. Give Claude a way to check its work

**Do this.** Give Claude a check it can run: a test suite, a build's exit code, a linter, or a script that compares output with a known result. Then ask it to show the output.

**Why.** Claude stops when the work looks done. Without a check it can run, "looks done" is the only signal, so you become the check. With one, Claude can see a failure and fix it.

**Practised in.** Lab 1 Step 2 (the tests Claude runs), Lab 2 Step 5 (a failing result before the fix and a passing one after it), Lab 3 Steps 3 and 4 (a hook runs the tests for Claude), Lab 4 Step 4 (the fix and its tests) and Lab 5 Steps 1 and 2 (CI runs the checks).

### 2. Explore before you change anything

**Do this.** On a codebase you don't know, ask Claude to read first. Ask the questions you would ask a teammate: how the parts fit, how to run the tests, why something was built the way it was. Tell it not to change files yet, and ask where each answer came from.

**Why.** Claude reads files before it answers, so you don't have to describe where the code lives. The answers to "who" and "why" are often in the history, not in the code.

**Practised in.** Lab 2 Step 1 (a tour and a test run, with no changes), Lab 2 Step 2 (three questions, with the source of each answer) and Lab 4 Step 2 (a read-only question about the cause, asked in normal mode, not plan mode).

### 3. Plan before you code, and skip the plan when the change is tiny

**Do this.** Switch to plan mode, ask for the change, and read the plan before you approve it. If the plan is missing something, choose "No, keep planning" and say what to change. If you could describe the change in one sentence, skip the plan.

**Why.** In plan mode Claude reads and proposes but changes nothing. A wrong plan is cheap to fix, and wrong code is not. Planning pays off most when you're unsure of the approach, when the change touches several files, or when the code is new to you.

**Practised in.** Lab 1 Step 4 (plan mode with `Shift+Tab`, then approving the plan).

### 4. Reproduce a bug before you fix it

**Do this.** Make the bug happen first and look at the result. Then ask for the fix and a test. Watch the result change from failing to passing.

**Why.** You can only tell that something is fixed if you have seen it broken. A test that fails before the change and passes after it proves the fix and keeps it fixed.

**Practised in.** Lab 2 Step 4 and Lab 2 Step 5 (a bad id), and Lab 4 Step 1 and Lab 4 Step 2 (a search that fails).

### 5. Ask for evidence, not a claim

**Do this.** Ask Claude to show the file and line, or the command it ran and its result. Ask for a pass or a gap on each item of a checklist, with proof.

**Why.** An answer from memory can be wrong and still sound sure. Evidence lets you check it in seconds.

**Practised in.** Lab 2 Step 2 (the source of each orientation answer) and Lab 5 Step 5 (a deploy-readiness checklist with evidence for each item).

### 6. Stay in control: read each request, and stop when needed

**Do this.** Read each permission request before you approve it. Know which permission mode you're in. Press `Esc` the moment Claude goes somewhere you didn't ask it to go, and tell it what to do instead. Say yes to the trust dialog only for folders you trust.

**Why.** A permission mode decides what runs without asking you. Manual mode asks before every action, and auto mode lets a classifier block the risky ones. `Esc` stops Claude and keeps the work and context so far.

**Practised in.** Lab 1 Step 1 (the trust dialog), Lab 1 Step 2 (approving requests, and `Esc`), Lab 2 Step 1 and Lab 5 Step 1 (stopping Claude when it goes beyond the task).

### 7. Let Claude use the command-line tools you already use

**Do this.** Name the tool in your prompt, for example the `gh` command for reading an issue. Claude can also learn a tool it hasn't seen from its help output.

**Why.** Command-line tools are the most context-efficient way for Claude to work with outside services.

**Practised in.** Lab 2 Step 5 and Lab 4 Step 2 (the prompt tells Claude to read the issue with `gh issue view`).

## Teaching Claude your project

### 8. Write your rules in CLAUDE.md, and keep it short

**Do this.** Put in what Claude can't guess: the test command, style rules that differ from the defaults, and your commit format. Leave out what it can learn from the code. Keep the file under 200 lines, commit it so your team shares it, and keep personal preferences in `~/.claude/CLAUDE.md`. Use `/init` for a first draft, then edit it by hand.

**Why.** Claude reads `CLAUDE.md` at the start of every session, so a rule written there once applies every time. A long file buries the rules that matter.

**Practised in.** Lab 1 Step 3 (your own four rules) and Lab 2 Step 3 (the commit rule in a codebase you don't know). Later labs use the rule: Lab 3 Steps 2, 5 and 6, Lab 4 Step 4 and Lab 5 Steps 4 and 5 all say "following the commit rule in CLAUDE.md".

### 9. Commit in small steps, with typed messages

**Do this.** Make one commit for one change, with a Conventional Commit message such as `fix(api): return 400 for an invalid task id`. Put the rule in `CLAUDE.md` so Claude follows it.

**Why.** A `feat` is a new feature and a `fix` is a bug fix, so the type says what kind of change each commit is. Tools can write a changelog and pick the next version from it, and Claude can read it. The format comes from conventionalcommits.org.

**Practised in.** Lab 1 Steps 3 and 5, Lab 2 Step 5, Lab 3 Steps 2, 5 and 6, Lab 4 Step 4 and Lab 5 Steps 2, 4 and 5.

### 10. Turn a team convention into a skill

**Do this.** When you explain the same procedure more than once, write it as a skill: a `SKILL.md` file in `.claude/skills/<name>/` with a clear description of when it applies. Commit it.

**Why.** Claude uses the description to decide when to load the skill, so your team's way of doing a task is applied without anyone pasting it in. Teammates get it when they pull.

**Practised in.** Lab 3 Step 1 (write the skill) and Lab 3 Step 2 (watch it load).

### 11. Use a hook for what must happen every time

**Do this.** If a rule must hold with no exceptions, make it a hook. A `Stop` hook runs when Claude finishes responding, and if it exits with code 2, Claude Code blocks the stop and Claude carries on working.

**Why.** An instruction in `CLAUDE.md` is advice, and Claude can forget it. A hook is a command that Claude Code runs itself, so it always happens. Claude Code limits how long a `Stop` hook can keep Claude going, so a hook can't loop forever.

**Practised in.** Lab 3 Step 3 (add the hook and check it with `/hooks`), Lab 3 Step 4 (watch it block) and Lab 3 Step 5 (commit it). The hook stays on in Lab 4 Step 4 and Lab 5 Step 4, where it runs the tests as Claude finishes.

### 12. Connect Claude to your tools through MCP, and trust each server

**Do this.** Register a project MCP server in `.mcp.json` at the repo root and commit the file, so everyone who clones the repo gets it. Check it with `/mcp`. Connect only servers you trust.

**Why.** MCP gives Claude a direct line to a system's data, and its answers come from the tool, not from reading the code. Claude Code asks you to approve a project server before it uses it. A server that fetches outside content can expose you to prompt injection, so check who wrote it first.

**Practised in.** Lab 3 Step 6 (register and use the server). In Lab 4 Step 2 and Lab 5 Step 1 you approve the server when Claude Code asks.

## Reviewing and shipping

### 13. Treat a bug report as a symptom, then ask about the cause

**Do this.** A report says what someone saw. Ask Claude for the root cause: the file, the function and why it fails. Then ask a second question about the same code: how could someone misuse it? Ask for each part separately, and ask Claude to prove its answers.

**Why.** The cause can be worse than the symptom. If you fix only what the report describes, the cause can stay in place.

**Practised in.** Lab 4 Step 2 (the root cause) and Lab 4 Step 3 (a security question about the same code).

### 14. Run a security review on every pull request, and keep its scope tight

**Do this.** Run `/security-review` on your branch before you ask for a review. Ask reviewers, human or Claude, to report only what affects correctness or the stated requirements, and is real.

**Why.** `/security-review` compares your branch with the default branch and looks for problems such as authentication problems and data exposure. It only looks at what your branch changes, so it complements a security question you ask while you read code. A reviewer asked to find gaps usually reports some, even when the work is sound. Chasing every finding leads to over-engineering.

**Practised in.** Lab 4 Step 6. The fallback prompt there asks for only the issues Claude is confident are real.

### 15. Keep pull requests small, and include the tests

**Do this.** Open one pull request per change, with its tests, a title in the commit format and a description that links the issue.

**Why.** A small pull request with its tests is quick to review, and the link tells the reviewer why it exists.

**Practised in.** Lab 4 Step 4 (the fix and tests in one commit), Lab 4 Step 5 (the PR) and Lab 5 Step 2 (a PR title in the commit format).

### 16. Let CI be the strict gate, and read the log

**Do this.** Put your checks in a workflow in `.github/workflows` so they run on every pull request. Make the gate strict: with `--max-warnings 0`, ESLint fails when it finds even one warning. When a check fails, read the log of the failed step, not just the red mark.

**Why.** CI runs on a clean machine, so it doesn't depend on what your laptop has learned to ignore. The log tells you the file, the line and the rule.

**Practised in.** Lab 5 Step 1 (the workflow), Lab 5 Step 2 (open the PR and watch the checks) and Lab 5 Step 3 (read the failing log).

### 17. Fix the cause, not the warning

**Do this.** When a check complains, find out what it points at and fix that. Don't silence the message, and don't turn the rule down to make it pass. If a setting was relaxed for a reason, check whether the reason still holds.

**Why.** A warning is often the only sign of a real problem. Making it go away hides the problem and leaves it in place.

**Practised in.** Lab 5 Step 4.

### 18. Check readiness against a list

**Do this.** Before you call a project deploy-ready, ask Claude to go through a short checklist of yes-or-no questions: can someone start it, check it's alive, configure it and run it from the README? Ask for evidence on each item, and fix the gaps with the smallest change.

**Why.** Green CI says the code builds and its tests pass. A checklist turns "is it ready?" into questions that have answers.

**Practised in.** Lab 5 Step 5.

## Beyond the labs

The labs don't practise these two habits, but they save you time in your own work.

- **Keep your context clean.** Use `/clear` to start a new conversation between unrelated tasks. If Claude is still wrong after two corrections on the same problem, `/clear` and write a better prompt that uses what you learned. Use `/context` to see what is filling your context.
- **Watch for the common failure patterns.** Five common failure patterns are: a session that mixes unrelated tasks, correcting over and over, a `CLAUDE.md` that has grown too long, trusting output without verifying it, and open-ended exploration. A too-long `CLAUDE.md` can often be pruned, and a rule that must always hold can become a hook.
