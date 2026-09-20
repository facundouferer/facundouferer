---
title: 'Getting Started with Git'
course: 'git'
slug: 'el-principio-con-git'
description: 'Understand version control fundamentals, install and configure your identity with git config, and master the three-state workflow.'
order: 1
lang: 'en'
published: true
---

# 🚀 Getting Started with Git: Fundamentals and First Steps

Version control is the foundational skill of every modern software engineer. Without it, coordinating code across a team or safely reverting to a working state is virtually impossible.

In this lesson you will learn:
1. What Git is and why it became the undisputed industry standard.
2. Core concepts: repositories, tracked files, commits, and project history.
3. How to install Git and configure your required identity with `git config`.
4. The three-state lifecycle: Working Directory, Staging Area, and Repository.
5. How to inspect log history and create your first branches.

---

# What is Git?

**Git is a version control system.**

👉 In simple terms:  
**Git stores the history of changes in a project**, just like a "save game" in a video game.

### Simple Analogy

Imagine you're writing a paper in Word:

- Version 1
- Version 2
- Final version
- Final FINAL version 😅

Git does this automatically, but:

- It saves **every change**
- It lets you **go back in time**
- It allows you **to work in a team without overwriting each other**
- It works perfectly with code

---

# 🧠 Why is Git So Important?

Learning Git lets you:

- Never lose your work
- Collaborate with others
- Try ideas without breaking anything
- Work like a professional programmer

💡 **ALL** tech companies use Git.

---

# 🧩 Core Concepts (very important)

Before using commands, you need to understand **these key concepts**:

## 1️⃣ Repository (repo)

It's the **project**.

📦 Think of a repository as:

> A special folder that Git controls

It can contain:
- Code
- Images
- Documentation
- Any file

---

## 2️⃣ File

These are your normal files:
- `.html`
- `.css`
- `.js`
- `.txt`

Git **watches** these files and detects changes.

---

## 3️⃣ Version / Commit

A **commit** is a **snapshot of the project at a point in time**.

📸 Each commit:
- Has a message ("what I did")
- Has a date
- Has an author

Example commit message:
```
Add login button
```

---

## 4️⃣ History

Git stores all commits in order.

This lets you:
- See what changed
- Go back to a previous version
- Know who did what

---

# 🧰 Installing Git

### On Windows

Download from:  
👉 [https://git-scm.com](https://git-scm.com/)

Install with default options.

### On macOS

```
brew install git
```

### On Linux

```
sudo apt install git
```

Verify it's installed:
```bash
git --version
```

---

# ⚙️ Initial Configuration (mandatory before starting)

Before creating your first commit, Git **needs to know who you are**. Every change in history is signed with an author name and email.

### Setting up your identity

Run in your terminal:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

> 💡 **Important note**: `user.name` and `user.email` are metadata used to sign commits, not credentials to authenticate with GitHub. Use the email associated with your GitHub account so GitHub links your commits to your profile.

### Setting the default initial branch

Git historically used `master` as the default branch name. The modern industry and GitHub standard is `main`:

```bash
git config --global init.defaultBranch main
```

### Where is this configuration saved?

* **`--global`**: Applies to all projects on your machine (saved in `~/.gitconfig`).
* **`--local`**: Applies only to the current repository (useful if you have separate personal and work emails).

To verify your active configuration at any time:

```bash
git config --list
```

---

# 🚀 Getting Started with Git (first steps)

## Step 1: Create a project

Create a folder and navigate into it:

```bash
# Create the directory for our new project
mkdir my-project

# Enter the project directory
cd my-project
```

---

## Step 2: Initialize Git

Inside the folder:

```bash
# Initialize an empty local Git repository in this folder
git init
```

👉 This creates a Git repository.

💡 Git now controls this folder.

---

# 📂 Git Status (very important)

You can always ask:

```bash
# Check the current status of the working tree and staging area
git status
```

This tells you:
- What files changed
- What's ready to save
- What's not

---

# 📝 Create Your First File

Create a file named:

```text
hello.txt
```

Content:

```text
Hello, this is my first Git project
```

Check status:

```bash
# See how Git detects the new untracked file
git status
```

You'll see something like:
> untracked new file

---

# ➕ Adding Files (staging)

Git works with **3 core areas**:

### 1️⃣ Working Directory
Your everyday files on disk where you code and make changes.

### 2️⃣ Staging Area (Index)
The staging area where you hand-pick exactly which modifications will form the next commit snapshot.

### 3️⃣ Repository (.git)
The local database where Git permanently stores history as immutable commits.

<figure class="diagram">
<svg viewBox="0 0 720 260" role="img" aria-labelledby="d-git-3areas-en-t">
<title id="d-git-3areas-en-t">The Three Areas of Git: Working Directory, Staging Area, and Repository</title>
<defs>
  <marker id="ar-fwd-l1-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-back-l1-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Zone 1: Working Directory -->
<rect x="20" y="30" width="200" height="155" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="120" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">1. Working Directory</text>
<text x="120" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Files on disk</text>
<rect x="40" y="100" width="160" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="120" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-text)">hello.txt (modified)</text>
<text x="120" y="162" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Untracked / unstaged</text>

<!-- Zone 2: Staging Area -->
<rect x="260" y="30" width="200" height="155" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">2. Staging Area</text>
<text x="360" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Staged for commit</text>
<rect x="280" y="100" width="160" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="360" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">hello.txt (staged)</text>
<text x="360" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-700)">Ready for snapshot</text>

<!-- Zone 3: Repository -->
<rect x="500" y="30" width="200" height="155" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="600" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">3. Repository (.git)</text>
<text x="600" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Permanent history</text>
<rect x="520" y="100" width="160" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="600" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">commit: a1b2c3d</text>
<text x="600" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Snapshot recorded</text>

<!-- Arrow 1: git add -->
<path d="M 220 116 L 254 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1-en)"/>
<text x="240" y="106" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git add</text>

<!-- Arrow 2: git commit -->
<path d="M 460 116 L 494 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1-en)"/>
<text x="480" y="106" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git commit</text>

<!-- Arrow 3: restore staged -->
<path d="M 360 185 C 360 225, 120 225, 120 191" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ar-back-l1-en)"/>
<text x="240" y="235" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git restore --staged (unstage)</text>
</svg>
<figcaption>Git three-state lifecycle: modified files in your working directory are selected with <code>git add</code> into the Staging Area, and committed with <code>git commit</code> to the permanent local repository.</figcaption>
</figure>

To move a file to staging:

```bash
# Stage a specific modified or new file
git add hello.txt
```

Or all modified files at once:

```bash
# Stage all current working directory changes
git add .
```

---

# 💾 Saving Changes (commit)

Now save the changes:

```bash
# Create a commit that records staged changes into history with an author message
git commit -m "Add hello.txt file"
```

🎉 First commit done!

---

# 🔁 Basic Git Flow (memorize this)

This is the **most important Git flow**:

```text
Edit → git add → git commit
```

It's always like this.

---

# 🧪 Modifying a File

Edit `hello.txt`:

```text
Hello world
I'm learning Git
```

Check status:

```bash
# Verify which files have unstaged modifications
git status
```

Add and save:

```bash
# Stage the modified file
git add .

# Record the new version into the local repository
git commit -m "Update greeting message"
```

---

# ⏪ Going Back in Time

View history:

```bash
# Show the chronological list of commits with hashes, authors, and dates
git log
```

You'll see a list of commits. Each commit has a unique **ID** (hash).

To go back to a commit:

```bash
# Inspect the project state at a specific past commit (read-only mode)
git checkout COMMIT_ID
```

⚠️ This is read-only mode (not for working directly).

---

# 🌿 Branches

## What is a branch?

A branch is a **parallel line of work**.

🌱 It lets you:
- Try ideas without breaking the main project
- Collaborate simultaneously without interfering with others

The main branch is called:

```text
main
```

---

## Creating a branch

```bash
# Create a new branch pointing to the current commit
git branch new-feature
```

Switch to it:

```bash
# Switch to the newly created branch
git checkout new-feature
```

Or in one step (recommended):

```bash
# Create and switch to the branch immediately
git checkout -b new-feature
```

---

## Merging branches

Go back to main:

```bash
# Return to the main branch
git checkout main
```

Merge:

```bash
# Merge commits from new-feature into the active branch (main)
git merge new-feature
```

---

# 🌍 Git vs GitHub (very important)

🚫 **Git is NOT GitHub**

| Git | GitHub |
|---|---|
| Local tool | Online platform |
| Controls versions | Stores repositories |
| Works offline | Requires internet |

GitHub uses Git, but **they are not the same thing**.

---

# ☁️ Uploading a Project to GitHub (basic)

1. Create an empty repository on GitHub (without initial README or .gitignore).
2. Connect your local repository:

```bash
# Link the local repo to GitHub under the standard remote alias 'origin'
git remote add origin https://github.com/your-user/your-repo.git
```

3. Upload code and establish upstream tracking:

```bash
# Push the local 'main' branch to 'origin' and remember tracking (-u)
git push -u origin main
```

---

# 📥 Downloading a Project

```bash
# Clone an entire repository from GitHub to your local machine
git clone https://github.com/user/repo.git
```

---

# ⚠️ Common Mistakes

❌ Not committing often  
❌ Bad commit messages  
❌ Working without branches  
❌ Not using git status

---

# 🧠 Next Steps in this Course

Now that you know the fundamentals and local cycle, continue with the following lessons in this course:

1. **Lesson 2: Pulling and Pushing Changes**: Remote synchronization with GitHub (`pull`, `push`, tracking branches).
2. **Lesson 3: Merging Branches and Conflicts**: Collaborative branching workflows (`branch`, `merge`) and step-by-step conflict resolution.
3. **Lesson 4: Rebase and Best Practices**: Step-by-step rebase, linear history, atomic commits, Conventional Commits, and proper `.gitignore` management.

---

# 📌 Final Summary

Git lets you:
- Save versions
- Go back in time
- Work in a team
- Program professionally

Key everyday flow:

```bash
# 1. Check which files changed
git status

# 2. Stage the selected modifications
git add .

# 3. Save the snapshot with a clear message
git commit -m "feat: add clear message"
```
