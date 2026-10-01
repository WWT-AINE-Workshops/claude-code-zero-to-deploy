# Lab 1: Start right: a new project with best practices

**SDLC phase:** Plan · **Stage:** AI-Integrated · **Time:** 30 minutes

## Why this matters

The first ten minutes of a project set its habits. In this lab you build `tasklog` from an empty folder. It's a tiny TypeScript command-line tool that reads a `tasks.json` file and prints how many tasks are in each status: `todo`, `doing` and `done`.

Along the way you set up three habits. You write your own rules into `CLAUDE.md`, the file Claude Code reads at the start of every session. You plan a change before Claude writes it. And you commit in small steps, each with a typed message that says what kind of change it is. Without these habits, Claude guesses at your conventions, and your history turns into a list of "update" and "fix stuff".

## Before you start

This lab runs outside the workshop repository. Open a terminal in your home folder, or in any folder that is not inside the workshop repository. You make a new empty folder for the lab in Step 1.

What you need: Node.js at the version from pre-work, git and Claude Code, all set up in pre-work. Nothing gets installed from npm, and Node's built-in test runner runs the tests.

## Steps

### Step 1: Make the project folder

**Do this.** Make a folder called `tasklog`, move into it and turn it into a git repository. Run each command on its own.

```bash
mkdir tasklog
```

```bash
cd tasklog
```

```bash
git init
```

Then start Claude Code in the folder.

```bash
claude
```

**What you should see.** `git init` prints a line that starts with "Initialized empty Git repository". Git may also print a hint about the default branch name. You can ignore it. When Claude Code starts in a folder for the first time, it asks whether you trust the folder. This is your own new folder, so say yes. Then you see the Claude Code prompt, ready for your first message.

**Why.** A git repository from the first minute means every change Claude makes can be seen, compared and undone.

### Step 2: Ask Claude to scaffold tasklog

**Do this.** Paste this prompt into Claude Code.

```text
Create a tiny TypeScript command-line tool called tasklog in this folder. It reads tasks.json and prints how many tasks are in each status: todo, doing and done. Put the code in src/tasklog.ts and run it with node src/tasklog.ts. Add a sample tasks.json with five or six tasks, one test in src/tasklog.test.ts, and a package.json with "type": "module" and a test script that runs node --test. Use only Node's built-in modules: no dependencies, no build step and no tsconfig. Import local files with the .ts extension, and use plain types only: no enum and no namespaces. Then run the tests and show me the result.
```

Claude may ask for permission before it creates files or runs a command. Read each request, then approve it. Depending on your setup, Claude may not ask at all. To stop Claude at any point, press `Esc`.

When Claude has finished, run the tests yourself.

```bash
node --test
```

**What you should see.** Claude creates `package.json`, `tasks.json`, `src/tasklog.ts` and `src/tasklog.test.ts`, then runs the tests. Your own `node --test` run ends with a summary that shows a pass count of at least 1 and `fail 0`. Run `node src/tasklog.ts` too: it prints one line for each status with a count, and the three counts add up to the number of tasks in `tasks.json`. If Claude adds a dependency or a `node_modules` folder, ask it to remove them and use only Node's built-in modules.

**Why.** A test Claude can run is its way to check its own work, and yours.

### Step 3: Run /init and write your own rules

**Do this.** Ask Claude Code to write a first `CLAUDE.md` for the project.

```text
/init
```

Read the `CLAUDE.md` it writes. Then quit Claude Code: press `Ctrl+D` twice on an empty prompt. Open `CLAUDE.md` in any editor you like, for example `code CLAUDE.md` or `nano CLAUDE.md`. Add these four rules in your own words, and keep anything useful that `/init` wrote:

- the command that runs the tests: `node --test`;
- one style rule you care about, such as "use named exports" or "keep functions short";
- never add a dependency without asking first;
- write commit messages as Conventional Commits, such as `feat(cli): add a status filter`.

Save the file and start Claude Code again, so the session reads your new rules.

```bash
claude
```

Then ask Claude to make the first commit.

```text
Commit everything in this folder as the first commit. Follow the commit rule in CLAUDE.md.
```

**What you should see.** `/init` writes a short `CLAUDE.md` that describes the project and how to run it. On a project this small it's thin, and that's expected. If `/init` asks you follow-up questions, answer briefly or accept its suggestions. After your edit, the file holds your four rules. The first commit has a message that starts with a type, such as `feat:` or `chore:`, and a short summary.

**Why.** Claude reads `CLAUDE.md` at the start of every session, so a rule written there once applies to every session after it.

### Step 4: Plan the status filter before Claude codes it

**Do this.** Switch Claude Code to plan mode. In plan mode, Claude reads files and proposes a plan, but changes nothing. Press `Shift+Tab` until the status bar at the bottom shows `⏸ plan mode on`. If your session started in auto mode, that's three presses. Fallback: if you can't reach plan mode with `Shift+Tab`, type `/plan` and a space, paste the prompt below after it, and send it as one message.

Then paste this prompt.

```text
Add a --status <name> option to tasklog. With it, the tool lists only the tasks in that status, one per line with the id and the title. Without it, the tool prints the counts as it does now. An unknown status prints a clear error and exits with a non-zero code. Add tests for the filter and for an unknown status.
```

Read the plan. Check that it changes `src/tasklog.ts`, adds tests, adds no dependency, and handles an unknown status. If something is missing or wrong, choose "No, keep planning" and tell Claude what to change. When the plan looks right, approve it. "Yes, manually approve edits" lets you see each change before it's made. The other "Yes" option lets Claude work without asking. Its wording varies by Claude Code version.

**What you should see.** Before you approve, Claude changes no files. The plan names the files it will change, the new option, the error case and the new tests. After you approve, plan mode turns off, Claude makes the change and runs the tests, and they pass. Run `node src/tasklog.ts --status todo` yourself: it lists only the `todo` tasks from your `tasks.json`.

**Why.** A plan is cheap to fix, and a wrong change is not, so you catch the misunderstanding before any code exists.

### Step 5: Commit the change as a Conventional Commit

**Do this.** Ask Claude to check the tests and commit the new feature.

```text
Run the tests. If they pass, commit the status filter and its tests. Follow the commit rule in CLAUDE.md.
```

Then look at your history yourself: run `git log --oneline`.

> **Sidebar: Conventional Commits.** A Conventional Commit message has the shape `type(scope): summary`, for example `feat(cli): add a status filter`. The scope in brackets is optional. Common types are `feat` for a new feature, `fix` for a bug fix, and `docs`, `test` and `chore` for the rest. Here is why the format pays off:
>
> - **You can read the history at a glance.** The type says what kind of change each commit is before you read the rest.
> - **Tools can write your changelog and pick the next version.** A `feat` commit means a minor release, and a `fix` means a patch. A `!` after the type, as in `feat!:`, marks a breaking change, which means a major release.
> - **CI can check it.** Because the format is fixed, a check in your pipeline can reject a message that doesn't follow it.
> - **Claude reads it more reliably.** When Claude explores a project, a typed history tells it what kind of change each commit was. You use this in Lab 2.
>
> The format and the version rules come from the Conventional Commits specification at conventionalcommits.org.

**What you should see.** Claude runs the tests, they pass, and it makes one commit. `git log --oneline` shows at least two commits, newest first. Each message starts with a type, an optional scope in brackets and a colon, such as `feat(cli): add a status filter`. If a message doesn't follow the format, ask Claude to amend it, and check that the rule is in your `CLAUDE.md`.

**Why.** Small commits with typed messages make a history that people, tools and Claude can all read.

## You're done when

- `node --test` passes, with `fail 0`.
- `git log --oneline` shows at least two commits in the `type: summary` form, with or without a scope.
- `CLAUDE.md` holds your own rules: the test command, your style rule, the dependency rule and the commit rule.

In a virtual or mixed session, post ✅ in the chat when you're done. If you're stuck, post 🆘 and the step number, for example "🆘 step 3".

## If it goes wrong

- **The tests fail before any test runs.** Paste the error to Claude and ask it to fix the setup so that `node --test` passes, keeping to the rules in the Step 2 prompt.
- **`/init` writes very little.** That's expected on a project this new: there isn't much code to describe yet. The rules you add by hand are the part that matters.
- **Claude added a dependency.** Ask it to remove the dependency and use Node's built-in modules, then check that your `CLAUDE.md` has the dependency rule.
- **Claude started coding before you approved a plan.** Press `Esc` to stop it. Then switch to plan mode with `Shift+Tab` until you see `⏸ plan mode on`, and paste the prompt again.
- **The commit fails because git doesn't know who you are.** Set your name and email with the two `git config --global` commands from pre-work, then ask Claude to commit again.
- **You want to quit Claude Code.** Press `Ctrl+D` twice on an empty prompt.
- **Scaffolding is taking too long.** Press `Esc`, then paste this prompt. It builds a working skeleton in one turn.

```text
In this folder, create exactly these four files and nothing else, then run node --test. package.json: name tasklog, "type": "module", a "test" script of "node --test", no dependencies. tasks.json: an array of six tasks, each with id, title and status, where status is todo, doing or done. src/tasklog.ts: export a type Task and a function countByStatus(tasks) that returns the number of tasks in each status; when run directly (import.meta.main), read the file named in the first argument or tasks.json and print one line per status, such as "todo: 2". src/tasklog.test.ts: one node:test test of countByStatus that imports './tasklog.ts' with the extension. Use only Node's built-in modules.
```

## Stretch goals

- **Your own language.** Start a second empty folder and build the same tool in the language your team uses. Use the same steps: scaffold, `/init`, your own rules, a plan, a typed commit.
- **JSON output.** Plan and add a --json option that prints the counts as JSON, with a test. Commit it as a `feat` commit.

## Recap

You built a small project from an empty folder, wrote your own rules into `CLAUDE.md`, planned a change before Claude made it, and committed in small, typed steps. These three habits carry into every lab that follows, and into your own projects.
