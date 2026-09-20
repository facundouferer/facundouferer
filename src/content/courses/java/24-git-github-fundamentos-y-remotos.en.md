---
course: 'java'
slug: '24-git-github-fundamentos-y-remotos'
title: 'Git and GitHub: Foundations and Remote Repositories'
description: 'Learn a safe workflow with local Git, GitHub, identity configuration, commits, remotes, clone, fetch, pull, and push.'
order: 7
lang: 'en'
published: true
---

# Git and GitHub: Foundations and Remote Repositories

Git records project versions on your computer. GitHub hosts Git repositories and adds collaboration, review, issues, and automation. **Git and GitHub are not the same thing**: you can use Git without GitHub, while GitHub is a hosting service built around Git.

This lesson builds a complete workflow without assuming that credentials are already configured. The priority is understanding what each command changes before running it.

---

## 1. Install and verify Git

Install Git from its official site or a trusted package manager for your operating system. Avoid installers redistributed by third parties. Then verify the executable and version you will use:

```bash
git --version
git help --all
```

If the terminal reports `command not found`, installation is incomplete or Git is missing from `PATH`. Close and reopen the terminal, check the expected location for your system, and fix installation before creating a repository.

Also verify the current directory before any command that changes files:

```bash
pwd
git rev-parse --show-toplevel
```

The second command fails outside a repository. That error is useful information: do not run `git init` automatically until you confirm that you intend to create a repository in that directory.

---

## 2. Configure identity at the right scope

Every commit stores its author's name and email address. Global configuration provides defaults for all repositories:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

A repository may require another identity, such as a work address. Inside that repository, local configuration takes precedence:

```bash
git config --local user.name "Your Professional Name"
git config --local user.email "your-work-email@example.com"
```

Inspect the effective value and its source before publishing:

```bash
git config --show-origin --get user.name
git config --show-origin --get user.email
```

`user.name` and `user.email` identify commits; they **do not authenticate with GitHub**. If Git reports `Author identity unknown`, configure the correct scope and retry the commit. Do not invent identity data or change every global setting when only one project needs an override.

---

## 3. Create the local repository and first commit

Start from a project directory that you have inspected:

```bash
cd my-project
git init -b main
git status
```

`git status` is the control panel: it shows untracked files, staged changes, and the current branch. Before staging files, create `.gitignore` to exclude generated or sensitive content:

```text
# Build and tools
target/
.idea/
*.class

# Local configuration and secrets
.env
*.key
```

`.gitignore` does not delete or stop tracking a file that has already been committed. It is not a substitute for inspection either: names such as `.env.production` need an appropriate rule.

Stage only what you understand, inspect it, and commit:

```bash
git status --short
git add README.md src/ .gitignore
git diff --cached
git commit -m "chore: initialize Java project"
git status
```

The staging area lets you choose what enters the next commit. If you staged the wrong file, unstage it without deleting its contents:

```bash
git restore --staged path/to/file
git status --short
```

Never commit passwords, tokens, private keys, or `.env` files. If a secret reached a commit, deleting it in a later commit does not remove it from history: **rotate or revoke the secret first**, then follow a team-reviewed history-cleanup procedure.

---

## 4. Create a GitHub repository without duplicate history

To publish an existing local repository:

1. Sign in to the GitHub account that should actually own it.
2. Create an empty repository with the correct name and visibility.
3. Do not generate a README, license, or `.gitignore` on GitHub when those already exist locally; this avoids two different initial histories.
4. Inspect `git diff --cached`, the latest commit, and the absence of secrets again.
5. Copy the HTTPS or SSH URL from the repository page instead of typing it from memory.

Public versus private controls access, but **a private repository is not a secrets manager**. Credentials and sensitive data must remain outside history.

---

## 5. HTTPS or SSH

| Transport | Advantages | Considerations |
| :--- | :--- | :--- |
| **HTTPS** | Works well behind many proxies and is straightforward with a credential manager. | GitHub does not accept the account password for Git operations; authentication may use a browser, credential manager, or token depending on the environment. Never place tokens in the URL. |
| **SSH** | Convenient for frequent use and does not send a token for every operation. | Requires creating a key, protecting the private key, and registering only the public key with GitHub. Some networks may block it. |

This lesson does not assume available credentials. Choose the method allowed by your organization and follow its authentication documentation. Never reuse another person's private key or add one to the repository.

---

## 6. Connect, validate, and publish

Add the remote using the URL you copied:

```bash
git remote add origin https://github.com/USER/REPOSITORY.git
git remote -v
git remote get-url origin
git branch --show-current
```

Before sending anything, verify three facts:

- `origin` points to the expected account and repository;
- the current branch is `main`, or the name agreed by the team;
- the working tree contains no forgotten changes.

Publish the first commit and establish upstream tracking:

```bash
git push -u origin main
```

`-u` links local `main` to `origin/main`. Later, `git push` and `git pull` can use that tracking relationship without repeating names. If your branch has another name, do not copy `main` blindly: use the validated output from `git branch --show-current`.

An authentication error is not permission to try somebody else's credentials. Confirm the URL, the chosen protocol, and the session or key explicitly configured for that account.

---

## 7. Clone and synchronize an existing repository

`git clone` creates a local copy, configures `origin`, and normally establishes tracking for the initial branch:

```bash
git clone https://github.com/USER/REPOSITORY.git
cd REPOSITORY
git remote get-url origin
git branch --show-current
git status
```

Distinguish these synchronization operations:

- `git fetch origin` downloads remote references and commits **without integrating** them into your branch.
- `git pull` downloads and then integrates according to configuration. Before using it, check that you are on the right branch and local work is preserved.
- `git push` sends local commits to the configured remote; it does not send files that were never committed.

A deliberate workflow lets you inspect before integration:

```bash
git status
git fetch origin
git log --oneline --decorate --graph HEAD..origin/main
git pull --ff-only
git push
```

`--ff-only` avoids an implicit integration when histories have diverged. If it fails, do not force the operation: inspect both histories and resolve the strategy with the team.

---

## 8. Non-destructive recovery from common errors

### `remote origin already exists`

Do not remove the remote before checking its destination:

```bash
git remote get-url origin
git remote -v
```

If the URL is wrong and you confirmed the replacement, update it explicitly:

```bash
git remote set-url origin CORRECT_URL
```

### `rejected (non-fast-forward)` during push

The remote contains commits absent from your branch. Preserve both histories while investigating:

```bash
git status
git fetch origin
git log --oneline --left-right HEAD...origin/main
```

Then integrate according to team policy. **Do not respond with a force-push or `git push --force`**: it can erase remote work. History rewriting belongs in the next lesson and requires coordination.

### A file was staged by mistake

Use `git restore --staged file`; the file remains in your working directory. Avoid `git reset --hard`, which can discard uncommitted changes.

### Wrong branch or remote

Stop and validate before retrying:

```bash
git branch --show-current
git remote get-url origin
git status --short
```

Repeating commands without understanding the diagnosis often makes state worse. Preserve data first, then correct configuration or integration.

---

## 9. Guided exercise

1. Create a directory containing a `README.md` and a small Java file.
2. Initialize Git on `main`, add `.gitignore`, and configure a local identity when appropriate.
3. Stage specific files, inspect `git diff --cached`, and create a commit.
4. Create an empty GitHub repository and deliberately choose HTTPS or SSH.
5. Add `origin`, verify URL and branch, and only then run `git push -u origin main`.
6. In another directory, use `git clone`, verify the remote, and compare `fetch` with `pull`.

The exercise is complete when you can explain which data exists locally, which data reached GitHub, and which upstream tracking relationship connects the branches.
