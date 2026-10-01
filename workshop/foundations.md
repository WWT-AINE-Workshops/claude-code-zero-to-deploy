# Foundations

This chapter explains the ideas behind the five labs. You can read it before the session or after it, and you don't need anyone in the room. It takes about ten minutes.

## The one idea

Claude Code does useful work when it can check its own result. Give it a way to tell "looks done" from "is done", such as a test, a linter or a build, and it can find and fix its own mistakes. Without one, you are the only check.

Every lab in this workshop returns to that idea. You start with a test in Lab 1, add a hook that runs the tests for you in Lab 3, and finish with CI, a set of checks that run on every pull request, in Lab 5.

## What Claude Code is

Claude Code is an AI coding agent that works in your own project. You can use it in the terminal, in an editor extension for VS Code or JetBrains, in a desktop app and on the web. They all share the same engine, so a `CLAUDE.md` file, your settings and your MCP servers work in every one of them. In this workshop you use the terminal.

It isn't a chat window that suggests code for you to copy. It reads your files, runs commands and edits code in your project, and you stay in charge of what it is allowed to do. The sections below cover the four ideas you need before Lab 1.

## 1. The agent loop and permissions

Claude Code works in a loop of three phases: it gathers context by reading files and running commands, takes an action such as an edit, and verifies the result. Then it goes round again. The phases blend together, and you can step in at any point. Press `Esc` and Claude stops what it's doing. The work it has done so far and the conversation are kept, and Claude waits for your next instruction.

A **permission mode** decides what Claude may do without asking you. Manual mode asks before every action. In auto mode, a separate classifier model reviews each action before it runs and blocks the ones that look risky, so routine work goes ahead without prompts. Recent versions of Claude Code start in auto mode, unless your organization has turned it off. Press `Shift+Tab` to cycle between the modes. The status bar at the bottom of the screen names the one you're in.

The first time you start Claude Code in a folder, it shows a trust dialog. It protects you from files that other people committed to a repository. Say yes for your own folders. You see this in Lab 1 Step 1 and Lab 2 Step 1.

**Plan mode** is the permission mode where Claude reads files and answers questions but changes nothing. You use it in Lab 1 Step 4.

## 2. Context and CLAUDE.md

Claude works from its **context**: the conversation so far, the files it has read and the rules it was given. The context fills up fast, and Claude's results get worse as it fills. So what you put in front of Claude matters.

`CLAUDE.md` is a file that Claude reads at the start of every session. It's the one place where you write a rule once and every later session follows it.

- **What goes in:** commands Claude can't guess, style rules that differ from the defaults, how to run the tests, repo etiquette such as the commit format, and decisions about the design.
- **What stays out:** anything Claude can learn by reading the code, long tutorials and file-by-file descriptions.
- **How long:** keep it short, under 200 lines. It's read every time, so only put in what applies broadly.
- **Where it lives:** a `CLAUDE.md` at the repo root is committed to source control, so the whole team shares it. Your personal preferences go in `~/.claude/CLAUDE.md`, which no one else sees.

The `/init` command writes a first draft of `CLAUDE.md` from the code. On a brand-new project it is thin, and that's fine. The rules you add by hand are the point. You write one in Lab 1 Step 3, and you run `/init` on a codebase you have never seen in Lab 2 Step 3.

## 3. The working loop: explore, plan, code, commit

This is the habit to take away. It has four steps.

1. **Explore.** Let Claude read the code and answer questions before it writes anything.
2. **Plan.** In plan mode, Claude proposes a plan. You read it. You can approve it, or choose "No, keep planning" and say what to change. Approving the plan leaves plan mode, and Claude writes the code.
3. **Code.** Claude makes the change and runs the checks.
4. **Commit.** You commit in small steps, each with a typed message.

Planning pays off when you're unsure of the approach, when the change touches several files, or when the code is new to you. If you could describe the change in one sentence, skip the plan.

A **Conventional Commit** is a commit message with a type in front, in the shape `type(scope): summary`, such as `feat(cli): add a status filter`. The scope in brackets is optional. A `fix` is a bug fix, and a `feat` is a new feature. The format makes a history that people, tools and Claude can all read. It comes from the Conventional Commits specification at conventionalcommits.org. You practise it in Lab 1 Step 5, and every lab after that uses it.

## 4. Verification: a way to check the work

Claude stops when the work looks done. If it has nothing to run, "looks done" is the only signal it has, and you become the one who checks. So give it a check that it can run: a test suite, a linter, the exit code of a build. Then ask for evidence, such as the test output, instead of taking "done" on trust.

You can make the check automatic in two ways.

- A **hook** is a command that Claude Code itself runs at a set point in its work, for example when Claude finishes responding. A rule in `CLAUDE.md` is advice that Claude can forget. A hook runs every time, with no exceptions. You build one in Lab 3 Step 3.
- **CI**, short for continuous integration, runs your checks on a clean machine every time someone pushes, so the whole team sees the same result. With GitHub Actions, the workflow is a file in your repository's `.github/workflows` folder. You build one in Lab 5 Step 1.

## Terms you meet in Lab 3

Lab 3 adds two more extension points to Claude Code. The labs explain them when you use them, so a short note is enough here.

- A **skill** is a folder with a `SKILL.md` file that holds instructions for one kind of task. Claude loads it when a task matches its description.
- **MCP**, the Model Context Protocol, is an open standard for connecting AI tools to other tools and data. An MCP server gives Claude extra tools. Check that you trust a server before you connect it, because a server that fetches outside content can expose you to prompt injection.

## The labs

| Lab | Title                                                 | Minutes | You practise                                                                                   |
| --- | ----------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| 1   | Start right: a new project with best practices        | 30      | Your own rules in `CLAUDE.md`, plan mode and typed commits                                     |
| 2   | Drop into an unknown codebase                         | 30      | Exploring with questions, reproducing a bug and fixing it with a test                          |
| 3   | Extend Claude Code: a skill, a hook and an MCP server | 30      | Putting your team's conventions into the repository                                            |
| 4   | From issue to PR, with a security review              | 30      | Finding a cause, asking a security question, opening a small PR and running `/security-review` |
| 5   | Deploy-ready: CI from red to green                    | 30      | CI as a strict gate, reading a failing log and a readiness checklist                           |

Afterwards you can start a project with good habits, find your way around a project you have never seen, add a skill, a hook and an MCP server to a repository, take an issue to a pull request with a security review, and get a pull request from a red CI run to a green one.

The best-practices chapter turns these ideas into a take-home list, and each practice points to the lab step that practises it. The workbook gives you a page per lab to tick off and to take notes on.
