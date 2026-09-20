---
title: 'Merging Branches and Conflicts'
course: 'git'
slug: 'conflictos'
description: 'Master parallel branching workflows with branch and merge, and learn how to interpret and resolve integration conflicts step by step.'
order: 3
lang: 'en'
published: true
---

# 🔀 Branching, Merging, and Conflict Resolution in Git

When multiple developers work simultaneously on the same codebase, lines of history inevitably diverge. Mastering how to branch, merge, and confidently resolve integration conflicts is an essential skill for any software engineer.

In this lesson, you will learn:
1. How to create, switch, and isolate development lines with `git branch` and `git switch`.
2. How to merge branches with `git merge` (fast-forward vs three-way merge commit).
3. What causes an integration conflict and why Git halts the merge.
4. How to dissect and understand conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
5. The step-by-step method to resolve conflicts, verify fixes, and complete the merge cleanly.

---

# 🌿 MERGING BRANCHES — EXPLAINED STEP BY STEP

## 🧠 Core Idea (Concept First, Then Commands)

Imagine this scenario:

* `main` branch → stable, working version of your project
* `login` branch → isolated line of work for a new user authentication feature

👉 **Merging (`git merge`)** means:

> Integrating the commits from one branch into another branch

Typically, you develop and test in a secondary branch, then switch to `main` and merge your feature branch into it.

---

# 📊 Visual Diagram: Branching and Merging

<figure class="diagram">
<svg viewBox="0 0 720 280" role="img" aria-labelledby="d-git-merge-conflict-en-t">
<title id="d-git-merge-conflict-en-t">Branch divergence, git merge integration, and conflict markers</title>
<defs>
  <marker id="ar-main-l3-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-branch-l3-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Branch main line -->
<path d="M 60 70 L 620 70" fill="none" stroke="var(--color-accent)" stroke-width="3"/>
<text x="45" y="75" font-size="13" font-weight="700" font-family="monospace" text-anchor="end" fill="var(--color-accent-700)">main</text>

<!-- Branch feature/login curve -->
<path d="M 180 70 C 220 70, 230 150, 270 150 L 450 150 C 490 150, 500 70, 540 70" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="7 4"/>
<text x="210" y="170" font-size="13" font-weight="700" font-family="monospace" fill="var(--color-accent-2-800)">login</text>

<!-- Commits on main -->
<circle cx="90" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="90" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="180" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>

<circle cx="360" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="360" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="360" y="45" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Edit on line 2</text>

<!-- Commits on login -->
<circle cx="300" cy="150" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="300" y="155" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>

<circle cx="420" cy="150" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="420" y="155" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>
<text x="420" y="185" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Different edit on line 2</text>

<!-- Merge Commit F -->
<circle cx="540" cy="70" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="3.5"/>
<text x="540" y="76" font-size="13" font-weight="800" text-anchor="middle" fill="var(--color-accent-700)">F</text>
<text x="540" y="40" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Merge Commit</text>

<!-- Conflict Marker Box (inset) -->
<rect x="60" y="205" width="600" height="60" rx="12" fill="var(--color-surface)" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="80" y="228" font-size="11.5" font-family="monospace" fill="var(--color-accent-700)">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (current version on main)</text>
<text x="80" y="244" font-size="11.5" font-family="monospace" fill="var(--color-neutral-700)">======= (separator)</text>
<text x="80" y="260" font-size="11.5" font-family="monospace" fill="var(--color-accent-2-800)">&gt;&gt;&gt;&gt;&gt;&gt;&gt; login (incoming version)</text>
<text x="530" y="234" font-size="12" font-weight="700" fill="var(--color-accent-700)">Conflict!</text>
<text x="530" y="252" font-size="11" fill="var(--color-neutral-700)">Same line modified</text>
</svg>
<figcaption>Evolution of a merge with divergent branches: the <code>login</code> branch forks from commit B and advances in parallel to <code>main</code>. If both branches touch the same lines, Git inserts conflict markers before sealing the merge commit F.</figcaption>
</figure>

---

# 🧪 REAL STEP-BY-STEP EXAMPLE (Clean Merge)

## Step 1️⃣ Create test project

```bash
# Initialize a new local Git repository
git init
```

Create file `message.txt`:

```text
Hello world
```

```bash
# Stage and commit initial baseline on main
git add .
git commit -m "chore: initial commit"
```

---

## Step 2️⃣ Create a new feature branch

```bash
# Create secondary branch and switch to it in one command
git checkout -b login
```

📌 You are now working on the `login` branch.

---

## Step 3️⃣ Make changes in the new branch

Edit `message.txt`:

```text
Hello world
Adding login screen
```

Save:

```bash
# Commit the modification to the login branch
git add .
git commit -m "feat: add login screen"
```

---

## Step 4️⃣ Switch back to `main`

```bash
# Return to the main branch (files revert to main state)
git checkout main
```

📌 Notice that `message.txt` in your editor returns to its original single-line content.

---

## Step 5️⃣ Merge the `login` branch

```bash
# Integrate login commits into the current branch (main)
git merge login
```

🎉 **Successful merge without conflicts (Fast-Forward or clean merge).**

---

# ⚠️ NOW: MERGE CONFLICTS (The Critical Part)

## 🧠 When do conflicts happen?

A merge conflict occurs when:

* Two branches
* Modify the **exact same lines** of the same file
* With different content

Git cannot infer human intent automatically 🤯

---

# 💥 REAL EXAMPLE OF A CONFLICT

## Step 1️⃣ Initial state

File `message.txt` on `main`:

```text
Hello world
```

---

## Step 2️⃣ Branch `login` changes the line

```bash
# Switch to the feature branch
git checkout -b login
```

Edit `message.txt`:

```text
Hello world from login
```

```bash
# Stage and commit on branch login
git add .
git commit -m "feat: update message in login"
```

---

## Step 3️⃣ Return to `main` and change the same line

```bash
# Switch back to main
git checkout main
```

Edit `message.txt` with a different line:

```text
Hello world from main
```

```bash
# Stage and commit conflicting line on main
git add .
git commit -m "feat: update message in main"
```

---

## Step 4️⃣ Attempt to merge (BOOM 💥)

```bash
# Attempt to merge login into main (Git detects the collision)
git merge login
```

Git halts execution and reports:

```text
CONFLICT (content): Merge conflict in message.txt
Automatic merge failed; fix conflicts and then commit the result.
```

---

# 🔍 ANATOMY OF A CONFLICT (Inside the File)

Open `message.txt` in your code editor:

```text
<<<<<<< HEAD
Hello world from main
=======
Hello world from login
>>>>>>> login
```

### What does this mean?

* `<<<<<<< HEAD` → content present on your current branch (`main`)
* `=======` → center division marker
* `>>>>>>> login` → content coming from the incoming branch (`login`)

---

# 🛠️ HOW TO RESOLVE A CONFLICT (Step by Step)

## Step 1️⃣ Decide what remains

* **Option A**: Keep your version (`Hello world from main`)
* **Option B**: Keep the incoming version (`Hello world from login`)
* **Option C**: Combine both into a cohesive result:

```text
Hello world from main and login
```

👉 You make the engineering call.

---

## Step 2️⃣ Delete the conflict markers

⚠️ **CRITICAL STEP**:
You must delete all marker lines:

```text
<<<<<<<
=======
>>>>>>>
```

---

## Step 3️⃣ Save the clean file

The file must contain only clean, valid code:

```text
Hello world from main and login
```

---

## Step 4️⃣ Mark the conflict as resolved

```bash
# Tell Git that the conflict in this file is resolved
git add message.txt
```

---

## Step 5️⃣ Create the resolution commit

```bash
# Create the merge commit that finalizes conflict resolution
git commit -m "merge: resolve conflict between main and login"
```

🎉 The merge conflict is now completely resolved.

---

# 🔄 COMPLETE MERGE CONFLICT WORKFLOW

```bash
# 1. Attempt the branch merge
git merge login

# 2. Git stops and reports CONFLICT (content)
# 3. Open affected files in your editor and resolve markers

# 4. Stage resolved files
git add .

# 5. Commit the merge result
git commit -m "merge: resolve conflict"
```

---

# 🧠 Professional Advice

✔️ Always run `git pull` before branching or starting work  
✔️ Keep commits small and focused  
✔️ Use descriptive branch names (`feat/login`, `fix/nav`)  
✔️ Inspect conflict markers calmly; Git never erases your code silently  

---

# ❌ Common Mistakes

❌ Deleting entire files by mistake during conflict resolution  
❌ Committing files without removing the `<<<<<<<` and `>>>>>>>` markers  
❌ Panicking and closing your terminal without completing or aborting the merge (`git merge --abort`)
