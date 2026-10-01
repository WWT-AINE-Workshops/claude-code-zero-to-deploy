# Claude Code: From Zero to Deploy-Ready

A 180-minute hands-on workshop from World Wide Technology.

This repository is your workspace for the workshop. It contains the lab guides and helper scripts, and a small sample app that the labs work on.

## Start here

Do this before the session. The full pre-work guide, with troubleshooting for every step, is [workshop/pre-work.md](workshop/pre-work.md) (also as [pre-work.docx](workshop/pre-work.docx)).

You need a GitHub account and your own Claude Code license, which you sign in with in Step 4. Allow 30 to 45 minutes.

### Step 1: Install git and the GitHub CLI

**Windows users: set up WSL first.** The workshop doesn't run in PowerShell or CMD, so you must use WSL. Open PowerShell as an administrator (right-click it, then choose Run as administrator) and run this:

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

### Step 2: Sign in to GitHub

**How to do it.**

1. Sign in to GitHub. Run this and answer the prompts. Choose **GitHub.com**, then **HTTPS**. When it asks "Authenticate Git with your GitHub credentials?", answer **Yes**. Then choose to sign in with a **web browser**. `gh` shows a one-time code and waits for you to press Enter before it opens your browser. Type the code there. If no browser opens (common in WSL), copy the URL that `gh` prints into a browser on Windows.

   ```bash
   gh auth login
   ```

2. Check that it worked.

   ```bash
   gh auth status
   ```

### Step 3: Install Node.js

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

### Step 4: Install Claude Code and sign in

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

### Step 5: Make your private copy of the workshop repository

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

### Step 6: Check that GitHub Actions is on

**How to do it.**

1. Open your copy on GitHub in a browser: `https://github.com/<your user name>/my-claude-code-zero-to-deploy`.
2. Click the **Settings** tab. If you don't see it, it's under the **...** menu.
3. In the left sidebar, click **Actions**, then **General**.
4. Look at the **Actions permissions** section. If **Disable actions** is selected, choose one of the options that allows actions, then click **Save**.

### Step 7: Add the workshop issues and pull request

**How to do it.** From the `my-claude-code-zero-to-deploy` folder, run the script.

```bash
./scripts/seed-github.sh
```

It talks to GitHub as you, so it needs Step 2 and Step 5 done first.

**What you should see.** A line that starts with `Seeding` and names your repository, two lines that say `created issue`, and one that says `created draft pull request`. Then a list of your two open issues, and the last line `Seeded. The workshop issues and pull requests are ready.` On GitHub, your copy now has issues 1 and 2 and one draft pull request. To check from the terminal, run `gh issue list` and `gh pr list`.

### Step 8: Install the app's packages

**How to do it.** From the `my-claude-code-zero-to-deploy` folder, run this. It can take a few minutes.

```bash
npm ci
```

`npm ci` installs exactly the package versions that the project's lock file lists, and never changes the lock file. That keeps your copy clean, which the lab scripts need.

### Step 9: Check your setup

**How to do it.** In the `my-claude-code-zero-to-deploy` folder, run the script, then read the output. Each line starts with a mark: a tick means ready, a warning means fix it if you can, a cross means it must be fixed.

```bash
./scripts/check-setup.sh
```

The script may warn that a port the app needs is in use. Fix it by closing the program that uses the port.

## Open the workshop guide

**[workshop/README.md](workshop/README.md)** has the agenda and links to every lab.

Fell behind during the session? `./scripts/reset-lab.sh <lab number>` puts you at the start of any lab that runs in this repository. A lab that runs outside it starts in a new empty folder, as its "Before you start" section says.

---
