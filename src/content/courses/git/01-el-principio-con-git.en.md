---
title: 'Getting Started with Git'
course: 'git'
slug: 'el-principio-con-git'
description: 'Install and configure Git, create your first repository and master the local three-area cycle: git status, git add, git commit, git diff and git log.'
order: 1
lang: 'en'
published: true
---

# Getting Started with Git

Git is the tool almost every software team uses to keep the history of its code. In this lesson you work alone, on your computer, with no internet.

In this lesson you will learn:

1. What Git is and what a repository, a commit and the history are.
2. How to install Git and configure your identity with `git config`.
3. How to create a repository with `git init`.
4. The three-area cycle: `git status`, `git add`, `git restore --staged` and `git commit`.
5. How to see what changed with `git diff` and `git diff --staged`.
6. How to read the history with `git log`.

## What Git is

**Git is a version control system**: it saves successive snapshots of your project so you can see what changed, when, who did it, and go back to an earlier version.

Without Git, you end up with folders like these:

```text
report.docx
report-v2.docx
report-final.docx
report-final-REALLY.docx
```

With Git you have a single file and an ordered history of all its versions, with an explanation of each change.

### Core concepts

- **Repository (repo)**: a folder whose history Git tracks. Git stores that history in a hidden subfolder named `.git`.
- **Commit**: a snapshot of the files at a given moment. It is the unit of the history.
- **History**: the chain of commits, from the most recent to the first one.

Each commit stores:

- **Hash**: a unique identifier of 40 hexadecimal characters, for example `c5b1fcbcb89c0c3c091da7935c2090a571c34df7`. It is usually shown shortened to the first 7: `c5b1fcb`.
- **Author**: name and email of whoever created it.
- **Date**: when it was created.
- **Message**: what changed and why, written by you.
- **Parent**: the hash of the previous commit. This is how the history is chained. The first commit of the repository has no parent.

### Git and GitHub are not the same

| Git | GitHub |
| --- | --- |
| A program you install on your computer | A web service |
| Keeps the history of your project | Hosts copies of Git repositories on the internet |
| Works without internet | Needs internet |
| You use it from the terminal | You use it from the browser (and from Git) |

GitHub uses Git so several people can share a repository, but everything in this lesson happens only on your computer.

## Install Git

### Windows

Download the installer from [git-scm.com](https://git-scm.com/) and install it with the default options. You can also use `winget` from PowerShell:

```bash
winget install --id Git.Git -e --source winget
```

Use the **Git Bash** terminal that is installed with Git to follow this lesson.

### macOS

Install the Xcode Command Line Tools, which include Git:

```bash
xcode-select --install
```

Or, if you use Homebrew:

```bash
brew install git
```

### Linux (Debian and Ubuntu)

```bash
sudo apt update
sudo apt install git
```

### Linux (Fedora)

```bash
sudo dnf install git
```

### Check the installation

```bash
git --version
```

```text
git version 2.52.0
```

Your version number may differ; any recent version works.

## Configure your identity

Git signs every commit with a name and an email. Set them once:

```bash
git config --global user.name "Ana Garcia"
git config --global user.email "ana@example.com"
```

`user.name` and `user.email` are just data written into each commit; they are not a password or an account. If you use GitHub later, use the same email as your account so it links your commits to your profile.

Also configure the name of the main line of the history. The current standard is `main`:

```bash
git config --global init.defaultBranch main
```

### `--global` and `--local`

- `--global`: applies to all your repositories. It is stored in `~/.gitconfig`.
- `--local`: applies only to the repository you are in and takes priority over the global one. It is stored in `.git/config`. It is the default when you specify neither.

For example, to use your work email in a single repository (run it inside that repository):

```bash
git config --local user.email "ana@work.com"
```

To see your whole configuration:

```bash
git config --list
```

```text
user.name=Ana Garcia
user.email=ana@example.com
init.defaultbranch=main
```

The real list may include more lines; what matters is that your three values appear. Git shows key names in lowercase (`init.defaultbranch`).

## Create a repository

Create a folder for the project and enter it:

```bash
mkdir my-project
cd my-project
```

Turn the folder into a repository:

```bash
git init
```

```text
Initialized empty Git repository in /home/ana/my-project/.git/
```

Git created the hidden `.git` folder, where it will keep the whole history. Do not edit it by hand: if you delete it, you lose the history.

## Ask Git what is going on: `git status`

`git status` is the command you will use most. It tells you which files changed and what will go into the next commit:

```bash
git status
```

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

`No commits yet` means the history is empty. `On branch main` shows the name of the main line you configured with `init.defaultBranch`.

Create a file `hello.txt` with this content:

```text
Hello, this is my first project with Git
```

And ask again:

```bash
git status
```

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	hello.txt

nothing added to commit but untracked files present (use "git add" to track)
```

`Untracked files` are files Git sees but does not track yet.

## The three areas of Git

Git works with three areas:

1. **Working Directory**: your files on disk, where you edit.
2. **Staging Area**: what you chose to include in the next commit.
3. **Repository (`.git`)**: the history of commits.

<figure class="diagram">
<svg viewBox="0 0 720 260" role="img" aria-labelledby="d-git-3areas-en-t">
<title id="d-git-3areas-en-t">The three areas of Git: Working Directory, Staging Area and Repository</title>
<defs>
  <marker id="ar-fwd-l1-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-back-l1-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Zone 1: Working Directory -->
<rect x="20" y="30" width="180" height="155" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="110" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">1. Working Directory</text>
<text x="110" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Files on disk</text>
<rect x="35" y="100" width="150" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="110" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-text)">hello.txt (modified)</text>
<text x="110" y="162" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Unstaged changes</text>

<!-- Zone 2: Staging Area -->
<rect x="270" y="30" width="180" height="155" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">2. Staging Area</text>
<text x="360" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Staged for commit</text>
<rect x="285" y="100" width="150" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="360" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">hello.txt (staged)</text>
<text x="360" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-700)">Goes into the next commit</text>

<!-- Zone 3: Repository -->
<rect x="520" y="30" width="180" height="155" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="610" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">3. Repository (.git)</text>
<text x="610" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">History of commits</text>
<rect x="535" y="100" width="150" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="610" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">commit c5b1fcb</text>
<text x="610" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Snapshot recorded</text>

<!-- Arrow 1: git add -->
<path d="M 200 116 L 264 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1-en)"/>
<text x="234" y="106" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git add</text>

<!-- Arrow 2: git commit -->
<path d="M 450 116 L 514 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1-en)"/>
<text x="484" y="106" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git commit</text>

<!-- Arrow 3: git restore staged -->
<path d="M 360 185 C 360 225, 110 225, 110 191" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ar-back-l1-en)"/>
<text x="235" y="242" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git restore --staged (unstage)</text>
</svg>
<figcaption>With <code>git add</code> you move a change from the working directory to the Staging Area, with <code>git commit</code> you record it in the history, and with <code>git restore --staged</code> you take it out of the Staging Area without losing what you edited.</figcaption>
</figure>

The basic cycle, which you will repeat every day:

```text
edit → git add → git commit
```

## Stage changes: `git add`

Add `hello.txt` to the Staging Area:

```bash
git add hello.txt
```

To add every new and modified file in the current folder (and its subfolders) in one step:

```bash
git add .
```

## Save a version: `git commit`

Create the commit with a message:

```bash
git commit -m "Add initial greeting"
```

```text
[main (root-commit) c5b1fcb] Add initial greeting
 1 file changed, 1 insertion(+)
 create mode 100644 hello.txt
```

- `c5b1fcb` is the shortened hash of the commit. Yours will differ: it depends on the content, the author and the date.
- `root-commit` means it is the first commit, the one without a parent.

### How to write a good message

A good message says what the commit does, in a few words and in the imperative, like an instruction:

| Bad | Good |
| --- | --- |
| `changes` | `Add initial greeting` |
| `fixed stuff` | `Fix the footer date` |
| `asdf` | `Add a second line to the greeting` |

Simple rules:

- One idea per commit.
- One short line (about 50 characters).
- Start with a verb: "Add", "Fix", "Remove", "Update".

## See what changed: `git diff`

Add a second line to `hello.txt`:

```text
Hello, this is my first project with Git
I am learning Git
```

```bash
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

The file is modified but not staged. Git suggests `git restore <file>` to discard the change; do not use it yet: it deletes what you edited, and you will study it carefully in the next lesson.

To see exactly what changed:

```bash
git diff
```

```text
diff --git a/hello.txt b/hello.txt
index fe5a809..b902729 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1 +1,2 @@
 Hello, this is my first project with Git
+I am learning Git
```

Lines with `+` were added and lines with `-` were removed. The rest is context.

There are two different comparisons:

| Command | Compares | Shows |
| --- | --- | --- |
| `git diff` | Working Directory against Staging Area | What you changed and have **not** staged yet |
| `git diff --staged` | Staging Area against the last commit | What **will go** into the next commit |

Check it: stage the change and run both commands again.

```bash
git add hello.txt
git diff
git diff --staged
```

Now `git diff` shows nothing (there are no unstaged changes) and `git diff --staged` shows the line `+I am learning Git`, because it is in the Staging Area waiting for the commit.

## Take a file out of the Staging Area: `git restore --staged`

If you staged something you did not want to include, take it out of the Staging Area:

```bash
git status
```

```text
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   hello.txt
```

```bash
git restore --staged hello.txt
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

The change went back to the Working Directory: **the file keeps what you wrote**, it is just no longer staged. This is exactly the dashed arrow in the diagram.

`git restore --staged` needs at least one commit in the repository. If you use it before the first commit, Git answers `fatal: could not resolve HEAD`.

Stage the change again and save it:

```bash
git add hello.txt
git commit -m "Add a second line to the greeting"
```

```text
[main 24c9a2a] Add a second line to the greeting
 1 file changed, 1 insertion(+)
```

## Read the history: `git log`

```bash
git log
```

```text
commit 24c9a2a515dd29510a41f53737e26e6875a01e98 (HEAD -> main)
Author: Ana Garcia <ana@example.com>
Date:   Sun Nov 22 01:18:09 2026 -0300

    Add a second line to the greeting

commit c5b1fcbcb89c0c3c091da7935c2090a571c34df7
Author: Ana Garcia <ana@example.com>
Date:   Sun Nov 22 01:18:09 2026 -0300

    Add initial greeting
```

Each block is a commit, from newest to oldest, with its full hash, author, date and message. Commit `24c9a2a` has `c5b1fcb` as its parent, and `c5b1fcb` has no parent because it is the first one. `(HEAD -> main)` marks the commit you are on right now.

For a compact view, one line per commit:

```bash
git log --oneline
```

```text
24c9a2a (HEAD -> main) Add a second line to the greeting
c5b1fcb Add initial greeting
```

If the history does not fit on the screen, Git shows it in a pager: move forward with the space bar and quit with `q`.

## Common mistakes

- **Forgetting `git add`**: `git commit` answers `no changes added to commit` (if you only modified files) or `nothing added to commit` (if there are only new files), or saves only what was staged. Check with `git status` before every commit.
- **Committing without an identity**: if you did not set `user.name` and `user.email`, Git refuses to create the commit (`Author identity unknown`) or signs it with data guessed from your system. Set your identity before the first commit.
- **Running `git init` in the wrong folder**: run it inside the project folder, never in your home folder.
- **Huge commits with vague messages**: make small, frequent commits, each with a clear message.

## Summary

- Git keeps the history of your project as a chain of commits; each commit has a hash, author, date, message and parent.
- `git config --global` sets your identity once; `--local` changes it for a single repository.
- `git init` creates the repository and `git status` tells you which area each change is in.
- `git add` moves changes to the Staging Area, `git restore --staged` takes them out and `git commit -m` records them in the history.
- `git diff` shows what is not staged and `git diff --staged` shows what will go into the next commit.
- `git log` and `git log --oneline` show the history.

In the next lesson, Undoing changes, you will learn to discard modifications and go back to earlier versions; later you will see branches, conflicts and how to publish your repository on GitHub.

## Practice exercises

### Exercise 1: your first repository

Create a folder `recipes`, turn it into a repository, create a file `omelette.txt` with the line `Ingredients: eggs and potatoes` and save it in a commit with the message `Add omelette recipe`. Check the result with `git log --oneline`.

<details>
<summary>Show solution</summary>

```bash
mkdir recipes
cd recipes
git init
echo "Ingredients: eggs and potatoes" > omelette.txt
git status
git add omelette.txt
git commit -m "Add omelette recipe"
git log --oneline
```

`git status` shows `omelette.txt` under `Untracked files` before the `git add`. At the end, `git log --oneline` shows a single commit with your message (with a hash different from anyone else's).

</details>

### Exercise 2: `git diff` versus `git diff --staged`

In the `recipes` repository, add the line `Step 1: peel the potatoes` to `omelette.txt` and stage it with `git add`. Then add the line `Step 2: beat the eggs` without staging it. Before running them, predict what `git diff` and `git diff --staged` will show.

<details>
<summary>Show solution</summary>

```bash
echo "Step 1: peel the potatoes" >> omelette.txt
git add omelette.txt
echo "Step 2: beat the eggs" >> omelette.txt
git diff
git diff --staged
```

- `git diff` shows only `+Step 2: beat the eggs`: it is the change in the Working Directory that is not in the Staging Area yet.
- `git diff --staged` shows only `+Step 1: peel the potatoes`: it is what would go into the next commit.

`git status` lists `omelette.txt` twice, under `Changes to be committed` and under `Changes not staged for commit`, because the file has one staged part and one unstaged part.

</details>

### Exercise 3: choose what goes into the commit

Stay in `recipes`. Stage everything with `git add .`, create a new file `notes.txt` with the line `Try it with onion` and stage it too. Then decide `notes.txt` must not go into this commit: take it out of the Staging Area, commit only `omelette.txt` with the message `Add the first omelette steps`, and check that `notes.txt` is still on disk.

<details>
<summary>Show solution</summary>

```bash
git add .
echo "Try it with onion" > notes.txt
git add notes.txt
git restore --staged notes.txt
git status
git commit -m "Add the first omelette steps"
git status
```

After `git restore --staged notes.txt`, `git status` shows `omelette.txt` under `Changes to be committed` and `notes.txt` under `Untracked files`. The commit includes only `omelette.txt`. `notes.txt` is still on disk with its content, ready for a future commit.

</details>

### Exercise 4: an identity for one repository only

In the `recipes` repository, set the email `ana@kitchen.com` for that repository only. Check which email Git uses inside `recipes` and create a commit to see it is signed with that email.

<details>
<summary>Show solution</summary>

```bash
git config --local user.email "ana@kitchen.com"
git config user.email
git add notes.txt
git commit -m "Add recipe notes"
git log
```

`git config user.email` shows `ana@kitchen.com`, because the local configuration takes priority over the global one. In `git log`, the most recent commit appears with `Author: Ana Garcia <ana@kitchen.com>`, and the earlier ones keep the email they were created with. In any other repository Git still uses the global email.

</details>
