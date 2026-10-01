# Pre-work for Claude Code: From Zero to Deploy-Ready

Do this before the session. It takes about **30 to 45 minutes**, and most of that is waiting for downloads. Allow up to an hour on Windows, because WSL needs a restart. In the session you start working in the first few minutes, so a ready laptop matters.

When you finish, you have the tools installed, Claude Code signed in, and your own private copy of the workshop repository on GitHub, with the workshop's issues and pull request in it. You don't need to know the topic yet.

**What you need.**

- A laptop where you can install software, and an internet connection.
- A GitHub account.
- **Your own Claude Code license.** The workshop doesn't provide one. You sign in with it in Step 4. The docs list the ways to sign in, so read their authentication page before you start: https://code.claude.com/docs/en/authentication.

**Where to type commands.** Everything below runs in a terminal, a window where you type commands. On macOS that is the Terminal app. On Linux it is your terminal. **On Windows you must use WSL**, a Linux terminal inside Windows. The workshop doesn't run in PowerShell or CMD, and Step 1 shows how to set WSL up. Lines in grey boxes are commands: copy one box at a time, paste it into the terminal and press Enter. New to the terminal? Read the terminal cheat sheet at the end of this guide first.

**Version numbers will differ.** Your numbers won't match the examples exactly. That's fine.

## Step 1: Install git and the GitHub CLI

**Who does it:** Everyone.

**Why it matters:** The labs use git to track changes and the GitHub CLI (`gh`) to create your own copy of the workshop repository.

**Windows users: set up WSL first.** Open PowerShell as an administrator (right-click it, then choose Run as administrator) and run this:

```powershell
wsl --install
```

Restart your computer when it asks. Then open Ubuntu from the Start menu, pick a username and password, and wait for the prompt to appear. From here on, type everything in that Ubuntu window, and follow the **Linux and WSL** commands below. Microsoft's guide is at https://learn.microsoft.com/en-us/windows/wsl/install. Keep your work in your Linux home folder, not under `/mnt/c`, because it is faster and avoids permission problems.

**How to do it.**

1. Install **git**.
   - **macOS:** run `xcode-select --install`, or `brew install git` if you use Homebrew (https://brew.sh).
   - **Linux and WSL:**

     ```bash
     sudo apt-get update && sudo apt-get install -y git curl build-essential
     ```

   - Tell git who you are. Use your own name and email.

     ```bash
     git config --global user.name "Your Name"
     ```

     ```bash
     git config --global user.email you@example.com
     ```

2. Install the **GitHub CLI**.
   - **macOS:** if you have Homebrew, run the command below. If you don't, either install Homebrew first from https://brew.sh (it needs administrator rights), or download the GitHub CLI installer from https://cli.github.com.

     ```bash
     brew install gh
     ```

   - **Linux and WSL:** the official apt instructions are at https://github.com/cli/cli/blob/trunk/docs/install_linux.md. For Ubuntu and Debian, paste this whole box as one command:

     ```bash
     (type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) && sudo mkdir -p -m 755 /etc/apt/keyrings && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg && sudo mkdir -p -m 755 /etc/apt/sources.list.d && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && sudo apt update && sudo apt install gh -y
     ```

3. Open a **new terminal window** so your shell picks up the changes, then check each tool.

   ```bash
   git --version
   ```

   ```bash
   gh --version
   ```

**Done when:** both commands print a version number.

**If you get stuck.**

- `wsl --install` needs a restart and may need administrator rights, so allow extra time on Windows.
- Your company laptop blocks installs: ask your IT team, or bring a personal laptop. Tell the facilitator ahead of time and we'll find a way.
- On another Linux distribution, install the same tools with your package manager. The links above have instructions.

## Step 2: Sign in to GitHub

**Who does it:** Everyone.

**Why it matters:** The GitHub CLI creates your copy of the repository and adds the workshop's issues to it, so it needs your account.

**How to do it.**

1. Sign in to GitHub. Run this and answer the prompts. Choose **GitHub.com**, then **HTTPS**. When it asks "Authenticate Git with your GitHub credentials?", answer **Yes**. Then choose to sign in with a **web browser**. `gh` shows a one-time code and waits for you to press Enter before it opens your browser. Type the code there. If no browser opens (common in WSL), copy the URL that `gh` prints into a browser on Windows.

   ```bash
   gh auth login
   ```

2. Check that it worked.

   ```bash
   gh auth status
   ```

**Done when:** `gh auth status` says you're logged in to github.com.

**If you get stuck.**

- `gh auth login` keeps asking for a code: copy the code exactly, including the dash, into the page your browser opened.
- If your company signs in to GitHub with single sign-on, you may need to authorize the GitHub CLI for your organization. This workshop only uses your personal account.

## Step 3: Install Node.js

**Who does it:** Everyone.

**Why it matters:** The workshop app and its tests run on Node.js.

**How to do it.** Install **Node.js 24 LTS** (24.15 or later). Node 22 (22.22.2 or later) and Node 26 also pass the check, but 24 is the one we tested. On Windows, run these in your Ubuntu window and use the Linux and WSL commands.

- **macOS:** download the installer from https://nodejs.org/en/download, or with Homebrew run these two commands:

  ```bash
  brew install node@24
  ```

  ```bash
  brew link --overwrite --force node@24
  ```

- **Linux and WSL:** the Node.js download page offers nvm, a small tool that installs Node for you. Copy the current nvm command from https://nodejs.org/en/download, which looks like this:

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
  ```

  Close the terminal and open a new one. Then install Node:

  ```bash
  nvm install 24
  ```

Open a **new terminal window**, then check it.

```bash
node --version
```

**Done when:** the command prints a version number. v24 is recommended. 22.22.2 or later, and 26 or later, also pass.

**If you get stuck.**

- `node --version` shows an older number after installing: you have a second copy of Node. Open a new terminal. With nvm, run `nvm use 24`.

## Step 4: Install Claude Code and sign in

**Who does it:** Everyone.

**Why it matters:** Claude Code is the tool this workshop is about, and it needs your license before it answers anything. The docs list the ways to sign in, so read their authentication page first: https://code.claude.com/docs/en/authentication.

**How to do it.**

1. Install **Claude Code** with the native installer. It works on macOS, Linux and WSL.

   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

2. Open a **new terminal window**, then check the install.

   ```bash
   claude --version
   ```

3. Sign in with your own license. Run this from any folder. On first launch Claude Code opens a browser window for you to log in. When it finishes, the terminal shows `Login successful`, and you press Enter to continue.

   ```bash
   claude
   ```

   - If the browser doesn't open, press `c` to copy the login URL, then paste it into your browser.
   - If the browser shows a login code instead of returning to the terminal, paste the code at the `Paste code here if prompted` prompt. This is common in WSL.
   - If Claude Code asks whether you trust the folder, that's its workspace trust dialog. Read it, and say yes if the folder is one you made.
   - On first run you may also see theme or onboarding screens. Click through them.

4. Leave Claude Code: press `Ctrl+D` twice on an empty prompt. You're back at the normal prompt.

**Done when:** `claude --version` prints a version number, and Claude Code showed `Login successful`.

**If you get stuck.**

- `command not found: claude`: the install folder isn't on your PATH yet. Open a new terminal and try again. If it still fails, see the install troubleshooting page: https://code.claude.com/docs/en/troubleshoot-install.
- The install fails with a `403` or a curl error: this is often a company network or proxy. Try from another network, and tell the facilitator what the error said.
- Which sign-in option to use depends on how you pay for Claude. Check the authentication page, or ask your team admin. If your organization gave you an invitation, accept it first.
- Setup docs for Claude Code: https://code.claude.com/docs/en/setup.

## Step 5: Make your private copy of the workshop repository

**Who does it:** Everyone.

**Why it matters:** You get your own private repository, so you can commit, push and open pull requests without touching anyone else's. Cloning keeps the full commit history, so don't use GitHub's fork button.

**How to do it.** Run these four commands, one at a time, in the folder where you want the project to live. On WSL, that is your Linux home folder.

1. Clone the workshop repository into a folder called `my-claude-code-zero-to-deploy`.

   ```bash
   git clone https://github.com/WWT-AINE-Workshops/claude-code-zero-to-deploy.git my-claude-code-zero-to-deploy
   ```

2. Move into the folder.

   ```bash
   cd my-claude-code-zero-to-deploy
   ```

3. Remove the link back to the workshop repository. The link is called `origin`, and your own copy takes its place in the next command.

   ```bash
   git remote remove origin
   ```

4. Create your private copy on GitHub, with the same name as the folder, and push to it. This also makes it the new `origin`.

   ```bash
   gh repo create my-claude-code-zero-to-deploy --private --source . --remote origin --push
   ```

Stay in the `my-claude-code-zero-to-deploy` folder for every step below. The labs call it "your copy".

**Done when:** the last command finishes without an error, and your new private repository shows up at `https://github.com/<your user name>/my-claude-code-zero-to-deploy`.

**If you get stuck.**

- `Repository not found` on the clone: check your network and try again. If it still fails, tell the facilitator.
- `Name already exists on this account` on the last command: you already have a repository called `my-claude-code-zero-to-deploy` on GitHub, perhaps from an earlier workshop run. Either delete or rename that one on GitHub, or run the last command again with a name of your own choosing in place of `my-claude-code-zero-to-deploy`. Only the repository on GitHub gets the new name. Your folder keeps its name, and the labs still call it the `my-claude-code-zero-to-deploy` folder.
- `fatal: destination path 'my-claude-code-zero-to-deploy' already exists`: you cloned before. Run `cd my-claude-code-zero-to-deploy` and continue from command 3, or delete the folder and start again.
- `error: No such remote 'origin'` on command 3: you already removed it. Go on to command 4.

## Step 6: Check that GitHub Actions is on

**Who does it:** Everyone.

**Why it matters:** In lab 5 you add automated checks that GitHub runs on every push, with GitHub Actions. They only run if Actions is turned on for your copy. It is on by default for a new repository, but an organization policy can turn it off, so check now.

**How to do it.**

1. Open your copy on GitHub in a browser: `https://github.com/<your user name>/my-claude-code-zero-to-deploy`.
2. Click the **Settings** tab. If you don't see it, it's under the **...** menu.
3. In the left sidebar, click **Actions**, then **General**.
4. Look at the **Actions permissions** section. If **Disable actions** is selected, choose one of the options that allows actions, then click **Save**.

**Done when:** the Actions permissions section has an option selected that allows actions, not **Disable actions**.

**If you get stuck.**

- You can't change the setting, or an organization policy blocks it: you can still do lab 5. It has a fallback that runs the same checks on your own machine. Tell the facilitator before the session.

## Step 7: Add the workshop issues and pull request

**Who does it:** Everyone.

**Why it matters:** The labs work on real GitHub issues and a pull request. A script opens them in your copy, so each person has their own.

**How to do it.** From the `my-claude-code-zero-to-deploy` folder, run the script.

```bash
./scripts/seed-github.sh
```

It talks to GitHub as you, so it needs Step 2 and Step 5 done first.

**What you should see.** A line that starts with `Seeding` and names your repository, two lines that say `created issue`, and one that says `created draft pull request`. Then a list of your two open issues, and the last line `Seeded. The workshop issues and pull requests are ready.` On GitHub, your copy now has issues 1 and 2 and one draft pull request. To check from the terminal, run `gh issue list` and `gh pr list`.

**Done when:** the last line says `Seeded.` and your copy has issues 1 and 2 and the draft pull request.

**If you get stuck.**

- `No origin remote`: Step 5's last command didn't finish. Run it again, then run the script again.
- `This is the workshop repository itself`: you skipped command 3 in Step 5. Run `git remote remove origin` and the `gh repo create` command, then run the script again.
- `The GitHub CLI is not signed in`: run `gh auth login`, then run the script again.
- It's safe to run the script again. It skips anything that already exists, and says so.
- `Permission denied`: run `chmod +x scripts/*.sh`, then try again.

## Step 8: Install the app's packages

**Who does it:** Everyone.

**Why it matters:** The labs from lab 2 on run the app and its tests. Installing its packages now saves several minutes in the session.

**How to do it.** From the `my-claude-code-zero-to-deploy` folder, run this. It can take a few minutes.

```bash
npm ci
```

`npm ci` installs exactly the package versions that the project's lock file lists, and never changes the lock file. That keeps your copy clean, which the lab scripts need.

**Done when:** the command finishes with a summary of the packages it added, and no error.

**If you get stuck.**

- `npm ci` fails with an error that mentions `node-gyp` or a compiler: a build tool is missing. On macOS run `xcode-select --install`. On Linux and WSL, run `sudo apt-get install -y build-essential python3`. Then run `npm ci` again.
- `npm ci` warns about the engine or Node version: run `node --version`. You need 22.22.2 or later, and we recommend 24.
- Anything else: run the command once more and read the first error line, not the last.

## Step 9: Check your setup

**Who does it:** Everyone.

**Why it matters:** One script checks everything above at once and tells you how to fix anything missing.

**How to do it.** In the `my-claude-code-zero-to-deploy` folder, run the script, then read the output. Each line starts with a mark: a tick means ready, a warning means fix it if you can, a cross means it must be fixed.

```bash
./scripts/check-setup.sh
```

The script may warn that a port the app needs is in use. Fix it by closing the program that uses the port.

**Done when:** the last line says `Ready for the workshop.`

**If you get stuck.**

- Each cross line says what is wrong and the command that fixes it. Run that command, then run the script again.
- `Permission denied`: run `chmod +x scripts/*.sh`, then try again.
- To check the Claude Code sign-in as well, add the `--live` option. It sends one tiny request, so it needs a working sign-in:

  ```bash
  ./scripts/check-setup.sh --live
  ```

## Before the session checklist

Tick each box.

- [ ] Windows only: WSL is installed, and I type everything in the Ubuntu window.
- [ ] `git --version` and `gh --version` print a version.
- [ ] `node --version` prints v24 (or v22.22.2 or later, or v26).
- [ ] `gh auth status` says I'm logged in.
- [ ] `claude --version` prints a version, and Claude Code showed `Login successful` with my own license.
- [ ] My private `my-claude-code-zero-to-deploy` repository exists on GitHub, and GitHub Actions is on for it.
- [ ] `./scripts/seed-github.sh` ended with `Seeded.`, and my copy has issues 1 and 2 and a draft pull request.
- [ ] `npm ci` finished without an error.
- [ ] `./scripts/check-setup.sh` ends with `Ready for the workshop.`
- [ ] I'll bring my laptop, charger and an internet connection.
- [ ] I know who to ask for help if something in this list fails: the facilitator.

If one box won't tick, don't wait. Tell the facilitator before the session what the error says.

## Terminal cheat sheet

The labs use only a handful of terminal commands. Type a command, then press Enter to run it.

| To do this                           | Type or press                           |
| ------------------------------------ | --------------------------------------- |
| See which folder you're in           | `pwd`                                   |
| List the files in this folder        | `ls`                                    |
| Move into a folder                   | `cd my-claude-code-zero-to-deploy`      |
| Go up one folder                     | `cd ..`                                 |
| Go to your home folder               | `cd ~`                                  |
| Make a new folder                    | `mkdir tasklog`                         |
| Show what's in a file                | `cat README.md`                         |
| Run a script in the `scripts` folder | `./scripts/check-setup.sh`              |
| See what git thinks has changed      | `git status`                            |
| See recent commits, one per line     | `git log --oneline`                     |
| Clear the screen                     | `clear`                                 |
| Run an earlier command again         | press the Up arrow, then Enter          |
| Finish a file or folder name for you | type the first letters, then press Tab  |
| Stop a command that is still running | press Ctrl+C                            |
| Leave Claude Code                    | press `Ctrl+D` twice on an empty prompt |

**Copy and paste.** On macOS, use Cmd+C and Cmd+V. In most Linux terminals, and in the Ubuntu window on Windows, use Ctrl+Shift+C and Ctrl+Shift+V, or right-click.

**Two terminals.** Some labs ask you to open a second terminal, for example to keep the app running in one while you work in the other. Open a new window or tab, then `cd` into your copy again.

**Where am I?** Most problems in the labs come from running a command in the wrong folder. If a command says a file or script isn't found, run `pwd` and check that you're in `my-claude-code-zero-to-deploy`.
