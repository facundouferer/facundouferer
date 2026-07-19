---
title: 'Getting Started with Git'
course: 'git'
slug: 'el-principio-con-git'
order: 1
lang: 'en'
published: true
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
```
git --version
```

---

# 🚀 Getting Started with Git (first steps)

## Step 1: Create a project

Create a folder:
```
my-project
```

Enter the folder:
```
cd my-project
```

---

## Step 2: Initialize Git

Inside the folder:
```
git init
```

👉 This creates a Git repository.

💡 Git now controls this folder.

---

# 📂 Git Status (very important)

You can always ask:
```
git status
```

This tells you:
- What files changed
- What's ready to save
- What's not

---

# 📝 Create Your First File

Create a file named:
```
hello.txt
```

Content:
```
Hello, this is my first Git project
```

Check status:
```
git status
```

You'll see something like:
> untracked new file

---

# ➕ Adding Files (staging)

Git works with **3 areas**:

### 1️⃣ Working Directory
Your normal files

### 2️⃣ Staging Area
Files ready to save

### 3️⃣ Repository
Saved files (commits)

To move a file to staging:
```
git add hello.txt
```

Or all files:
```
git add .
```

---

# 💾 Saving Changes (commit)

Now save the changes:
```
git commit -m "Add hello.txt file"
```

🎉 First commit done!

---

# 🔁 Basic Git Flow (memorize this)

This is the **most important Git flow**:
```
Edit → git add → git commit
```

It's always like this.

---

# 🧪 Modifying a File

Edit `hello.txt`:
```
Hello world
I'm learning Git
```

Check status:
```
git status
```

Add and save:
```
git add .
git commit -m "Update greeting message"
```

---

# ⏪ Going Back in Time

View history:
```
git log
```

You'll see a list of commits.

Each commit has an **ID**.

To go back to a commit:
```
git checkout COMMIT_ID
```

⚠️ This is read-only mode (not for working).

---

# 🌿 Branches

## What is a branch?

A branch is a **parallel line of work**.

🌱 It lets you:
- Try ideas
- Not break the main project

The main branch is called:
```
main
```

---

## Creating a branch

```
git branch new-feature
```

Switch to it:
```
git checkout new-feature
```

Or in one step:
```
git checkout -b new-feature
```

---

## Merging branches

Go back to main:
```
git checkout main
```

Merge:
```
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

1. Create a repository on GitHub
2. Connect your local repository:
```
git remote add origin URL
```
3. Upload code:
```
git push -u origin main
```

---

# 📥 Downloading a Project

```
git clone REPO_URL
```

---

# ⚠️ Common Mistakes

❌ Not committing often
❌ Bad commit messages
❌ Working without branches
❌ Not using git status

---

# 🧠 What to Learn Next

When you master this:
1. `.gitignore`
2. Merge conflicts
3. Rebase
4. GitHub Flow
5. Pull Requests

---

# 📌 Final Summary

Git lets you:
- Save versions
- Go back in time
- Work in a team
- Program professionally

Key flow:
```
git status
git add .
git commit -m "clear message"
```
