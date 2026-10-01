# Workshop materials

Welcome to _Claude Code: From Zero to Deploy-Ready_, a 3-hour workshop from World Wide Technology. You will work through five short labs on a working app. Everything in this folder is course material. It is not part of the app.

## Agenda

| Time | Segment                                                      | Minutes |
| ---- | ------------------------------------------------------------ | ------- |
| 0:00 | AI-Native Engineering at WWT                                 | 6       |
| 0:06 | How Claude Code works                                        | 9       |
| 0:15 | Lab 1: Start right: a new project with best practices        | 30      |
| 0:45 | Lab 2: Drop into an unknown codebase                         | 30      |
| 1:15 | Lab 3: Extend Claude Code: a skill, a hook and an MCP server | 30      |
| 1:45 | Lab 4: From issue to PR, with a security review              | 30      |
| 2:15 | Lab 5: Deploy-ready: CI from red to green                    | 30      |
| 2:45 | Wrap-up, questions and close                                 | 15      |

## Your materials

- [Pre-work](pre-work.md) ([Word version](pre-work.docx)): set up your computer before the session.
- [Foundations](foundations.md): the ideas behind the labs. Read it before or after the session.
- [Lab 1: Start right: a new project with best practices](labs/01-start-right.md) (30 minutes)
- [Lab 2: Drop into an unknown codebase](labs/02-unknown-codebase.md) (30 minutes)
- [Lab 3: Extend Claude Code: a skill, a hook and an MCP server](labs/03-extend-claude-code.md) (30 minutes)
- [Lab 4: From issue to PR, with a security review](labs/04-issue-to-pr.md) (30 minutes)
- [Lab 5: Deploy-ready: CI from red to green](labs/05-deploy-ready.md) (30 minutes)
- [Best practices](best-practices.md): a take-home reference for working with Claude Code.
- [Workbook](workbook.md) ([Word version](workbook.docx)): notes and exercises to fill in as you go.
- [Slides](slides.pptx): the deck from the session.

## Scripts

| Script                      | What it does                                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/setup-workshop.sh` | Sets up your copy after the clone, one step at a time, asking before each step (`--yes` answers yes to all)                                   |
| `scripts/check-setup.sh`    | Checks your computer has everything the workshop needs and tells you how to fix anything missing                                              |
| `scripts/seed-github.sh`    | Creates the workshop issues (and any draft pull requests) in your copy of the repository, and the branches the pull request labs are based on |
| `scripts/reset-lab.sh <n>`  | Moves you to the start of lab `n` on a fresh branch                                                                                           |

Fell behind? `./scripts/reset-lab.sh <lab number>` puts you at the start of any lab that runs in this repository. A lab that runs outside it starts in a new empty folder, as its "Before you start" section says.

## Next steps

Anthropic Academy has follow-on courses at https://anthropic.skilljar.com:

- Claude Code 101
- Claude Code in Action
- Introduction to agent skills
- Introduction to subagents
