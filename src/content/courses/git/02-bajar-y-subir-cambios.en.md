---
title: 'Pulling and Pushing Changes'
course: 'git'
slug: 'bajar-y-subir-cambios'
description: 'Learn how to synchronize local work with GitHub using pull, push, and upstream tracking, safely integrating remote changes.'
order: 2
lang: 'en'
published: true
---

# 🔄 Pulling and Pushing Changes: Remote Repositories and GitHub

Working in isolation on your local machine is only the first step. The true power of version control emerges when you synchronize your work with remote repositories hosted on platforms like GitHub, collaborating smoothly with other developers.

In this lesson, you will learn:
1. The architecture connecting local repositories and remote origins (`origin`).
2. How to publish local commits to the cloud with `git push`.
3. The crucial difference between `git fetch` and `git pull`.
4. How to configure upstream tracking branches with `-u`.
5. The daily synchronization workflow to safely pull remote updates without losing progress.

---

# 🔁 Key Idea Before Starting

When you use Git, there are typically **two copies of the project**:

1️⃣ **Your Computer** (local repository)  
2️⃣ **Internet (GitHub)** (remote repository, conventionally named **origin**)

👉 **Pulling changes (`git pull`)** = bringing what is on GitHub into your local PC  
👉 **Pushing changes (`git push`)** = sending what you committed locally to GitHub

<figure class="diagram">
<svg viewBox="0 0 720 270" role="img" aria-labelledby="d-git-sync-en-t">
<title id="d-git-sync-en-t">Synchronization Between Local Repository and Remote Repository (GitHub)</title>
<defs>
  <marker id="ar-push-l2-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-fetch-l2-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-pull-l2-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<!-- Local Box -->
<rect x="20" y="25" width="280" height="220" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="160" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">💻 Local Repository (Your PC)</text>
<rect x="40" y="75" width="240" height="42" rx="10" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="55" y="101" font-size="12" font-family="monospace" fill="var(--color-text)">Working Tree &amp; Staging</text>
<rect x="40" y="130" width="240" height="42" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="55" y="156" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">Local branch: main</text>
<rect x="40" y="185" width="240" height="42" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="55" y="211" font-size="12" font-family="monospace" fill="var(--color-neutral-700)">Tracking ref: origin/main</text>

<!-- Remote Box -->
<rect x="420" y="25" width="280" height="220" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="560" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">☁️ Remote (GitHub - origin)</text>
<rect x="440" y="100" width="240" height="85" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="560" y="135" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">refs/heads/main</text>
<text x="560" y="160" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Shared history in the cloud</text>

<!-- Arrow Push (Local -> Remote) -->
<path d="M 300 95 L 414 95" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-push-l2-en)"/>
<text x="360" y="86" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git push</text>

<!-- Arrow Fetch (Remote -> Local tracking ref) -->
<path d="M 420 150 L 306 150" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ar-fetch-l2-en)"/>
<text x="360" y="142" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git fetch</text>

<!-- Arrow Pull (Remote -> Local working tree + merge) -->
<path d="M 420 205 L 306 205" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-pull-l2-en)"/>
<text x="360" y="196" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git pull (fetch+merge)</text>
</svg>
<figcaption>Git synchronization: <code>git push</code> uploads your local commits to GitHub, while <code>git pull</code> downloads remote commits and merges them into your active branch.</figcaption>
</figure>

---

# 📥 PULLING CHANGES (pull)

## 🧠 When do you need to pull changes?

- When starting your workday
- When a teammate pushed updates to the project
- When working across multiple machines
- To prevent unnecessary merge conflicts

💡 **Golden Rule**:  
👉 _Before you start working → pull changes_

---

## 🔹 Primary command to pull changes

```bash
# Download commits from the remote repository and merge them into the active branch
git pull
```

### What does `git pull` do?

It performs **two operations automatically**:

1. 📥 **`git fetch`**: Downloads newly pushed commits from the remote repository without touching your working files.
2. 🔀 **`git merge`**: Automatically merges those remote commits into your active local working branch.

---

## 📌 Real Step-by-Step Example

### Situation:

- Your project is hosted on GitHub
- A teammate modified a file
- You want those changes on your machine

### Steps:

1️⃣ Navigate to the project directory:

```bash
# Navigate to the project root directory
cd my-project
```

2️⃣ Pull the latest changes:

```bash
# Fetch and merge updates from GitHub
git pull
```

3️⃣ Git responds with an update summary:

```text
Updating a1b2c3d..e4f5g6h
Fast-forward
 1 file changed, 4 insertions(+)
```

🎉 You now have the latest project state locally.

---

## ❗ Common Error When Pulling

If Git reports:

```text
error: Your local changes to the following files would be overwritten by merge
```

👉 This means:

> You have uncommitted changes in your working tree on lines that also changed on the remote branch.

### Solution:

Commit your local changes first before pulling:

```bash
# 1. Stage your local work
git add .

# 2. Commit your modifications
git commit -m "chore: save local work before pulling"

# 3. Pull and merge the remote updates
git pull
```

---

# 📤 PUSHING CHANGES (push)

## 🧠 When do you need to push changes?

- When you complete a specific task or feature
- When you want to backup your work to GitHub
- When teammates need your commits

💡 **Golden Rule**:  
👉 _After you finish and verify your work → push changes_

---

## 🔹 Full Workflow to Push Changes

⚠️ **Remember this core sequence**:

```text
Edit → git add → git commit → git push
```

---

## 📌 Complete Example of Pushing Changes

### 1️⃣ Modify a file

Edit `hello.txt` in your editor.

---

### 2️⃣ Check status

```bash
# Check modified files in the working directory
git status
```

---

### 3️⃣ Stage changes

```bash
# Stage the modified files for the upcoming commit
git add .
```

---

### 4️⃣ Commit changes

```bash
# Save the new version snapshot to your local repository
git commit -m "docs: update greeting message"
```

👉 Up to this point, **EVERYTHING IS LOCAL** (only on your PC).

---

### 5️⃣ Push to GitHub

```bash
# Send your local commits to the tracked remote branch
git push
```

🎉 Your commits are now live on GitHub.

---

## 🌍 Pushing for the First Time (Upstream Tracking)

The **first time** you push a branch, Git needs to know the target remote and branch name:

```bash
# Push the local 'main' branch to remote 'origin' and set upstream tracking (-u)
git push -u origin main
```

### What does this mean?

- `origin` → the default alias for your remote GitHub repository
- `main` → the branch you are publishing
- `-u` (or `--set-upstream`) → records the link between local `main` and `origin/main`

After configuring this once, for everyday work you simply run:

```bash
# Push commits to the configured upstream branch
git push
```

---

# 🔄 Real-World Daily Workflow

In professional teams, you follow this exact disciplined sequence:

```bash
# 1. At the beginning of the workday: get teammates' latest work
git pull

# 2. Write code, add tests, and verify locally...

# 3. Stage completed modifications
git add .

# 4. Commit with a clear, single-purpose message
git commit -m "feat: add discount calculation logic"

# 5. Publish your commits to the shared repository
git push
```

📌 **Following this cycle keeps your repository healthy.**

---

# ⚠️ Conflicts When Pulling Changes

A **conflict** occurs when:

- You modified a line in a file
- Someone else modified that exact same line on GitHub
- Git cannot automatically determine which version to keep

### Git will display conflict markers in the file:

```text
<<<<<<< HEAD
Your local changes
=======
Changes coming from GitHub
>>>>>>> remote_commit_hash
```

### How to resolve it:

1. Open the file in your code editor.
2. Decide which version to preserve (or combine them).
3. Delete the conflict marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Save the clean file.
5. Record the resolution commit:

```bash
# 1. Stage the resolved file
git add .

# 2. Create the conflict resolution merge commit
git commit -m "fix: resolve merge conflict with origin/main"

# 3. Push the resolved state to GitHub
git push
```

---

# 🧠 Essential Commands Summary

| Action | Command |
| :--- | :--- |
| Check status | `git status` |
| Download and merge remote changes | `git pull` |
| Stage changes | `git add .` |
| Commit changes | `git commit -m "message"` |
| Push commits to remote | `git push` |
| Push and set upstream tracking | `git push -u origin main` |

---

# ❌ Common Beginner Mistakes

❌ Running `git push` without running `git pull` first  
❌ Making massive commits with vague messages like "changes"  
❌ Committing directly to shared `main` without feature branches  
❌ Panicking when a merge conflict occurs instead of inspecting the file markers  

---

# 🧠 Final Golden Rule

📥 **Before starting work** → `git pull`  
📤 **After completing work** → `git push`
