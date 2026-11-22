---
course: 'git'
slug: 'rebase-y-buenas-practicas'
title: 'Rebase and Best Practices in Git'
description: 'Learn how to maintain a clean history with git rebase, resolve step-by-step conflicts, structure atomic commits, and follow industry best practices.'
order: 4
lang: 'en'
published: true
---

# 🌿 Rebase and Best Practices in Git

So far you have learned how to create branches with `git branch`, combine them with `git merge`, and resolve direct merge conflicts. In professional teams and high-performing environments, how you integrate your changes and document your work directly impacts the long-term maintainability of the codebase.

In this lesson, you will learn:
1. What `git rebase` is and how its mental model works internally.
2. When to choose `merge` vs `rebase` (technical tradeoffs and architectural reasoning).
3. How to resolve conflicts during a rebase step by step.
4. The Golden Rule of Rebase (and why breaking it harms your team).
5. Professional best practices: atomic commits, Conventional Commits, and disciplined `.gitignore` management.

---

# 🔄 What is Git Rebase?

The `git merge` command combines two divergent histories by creating a dedicated **merge commit**. This preserves exact chronological ordering, but introduces branching curves and crossings in the history graph.

`git rebase` offers an alternative approach: **re-basing** your branch. Instead of creating a merge commit, Git takes the commits you created on your feature branch, temporarily "unplugs" them, fast-forwards your branch to the tip of `main`, and reapplies (*replays*) your commits one by one onto that new base.

### Mental Model (Before and After)

Imagine this scenario: you branched `feature` off commit `B`. While you were developing, your teammates pushed commit `C` to `main`.

<figure class="diagram">
<svg viewBox="0 0 720 305" role="img" aria-labelledby="d-git-rebase-en-t">
<title id="d-git-rebase-en-t">Mental model of git rebase: replaying commits for a linear history</title>
<defs>
  <marker id="ar-rb-main-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-rb-feat-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-replay-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<!-- SECTION 1: BEFORE REBASE -->
<text x="30" y="32" font-size="13" font-weight="700" fill="var(--color-neutral-800)">1. BEFORE REBASE (Divergent branches)</text>

<!-- main line 1 -->
<path d="M 60 70 L 370 70" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-rb-main-en)"/>
<text x="45" y="75" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<!-- feature curve 1 -->
<path d="M 180 70 C 210 70, 220 120, 250 120 L 460 120" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-rb-feat-en)"/>
<text x="200" y="138" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">feature</text>

<!-- Commits section 1 -->
<circle cx="100" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>

<circle cx="300" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="300" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>

<circle cx="280" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="280" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>

<circle cx="390" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="390" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>

<!-- Replay Arrow -->
<path d="M 500 115 C 560 115, 560 180, 500 190" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-replay-en)"/>
<text x="590" y="152" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Replay commits</text>

<!-- Divider -->
<line x1="30" y1="160" x2="690" y2="160" stroke="var(--color-divider)" stroke-width="1" stroke-dasharray="4 4"/>

<!-- SECTION 2: AFTER REBASE -->
<text x="30" y="185" font-size="13" font-weight="700" fill="var(--color-neutral-800)">2. AFTER git rebase main (Linear history)</text>

<!-- Line 2: fully linear -->
<path d="M 60 230 L 640 230" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-rb-main-en)"/>
<text x="45" y="235" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<circle cx="100" cy="230" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="235" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="230" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="235" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>

<circle cx="280" cy="230" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="280" y="235" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>

<!-- Rebased commits -->
<circle cx="390" cy="230" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="390" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D'</text>

<circle cx="500" cy="230" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="500" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E'</text>
<text x="500" y="268" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">feature (tip)</text>

<rect x="360" y="278" width="280" height="20" rx="6" fill="var(--color-surface)" stroke="var(--color-divider)"/>
<text x="500" y="292" font-size="10" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Recalculated SHA-1 hashes · 100% linear history</text>
</svg>
<figcaption>Mental model of <code>git rebase</code>: feature branch commits are temporarily unplugged and replayed sequentially on top of the latest commit of <code>main</code>, producing a clean, linear history without merge bubbles.</figcaption>
</figure>

Notice the commits are now labeled `D'` and `E'`: **their commit hashes (SHA-1) have changed**, because they now have a different parent commit (`C` instead of `B`).

The result is a **completely linear history**, as if you had started writing your feature right after commit `C`.

---

# ⚖️ Merge vs Rebase: Architectural Tradeoffs

Neither command is inherently superior; they address different needs with different priorities:

| Aspect | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| **History shape** | Branching graph with explicit join commits | Clean, single linear line |
| **Historical context** | Accurately records when branches diverged and merged | Rewrites history to represent sequential progress |
| **Conflict resolution** | Handled once in the final merge commit | Handled commit-by-commit during the replay |
| **Pull Request traceability** | Ideal for documenting complete feature merges | Ideal for keeping local feature branches updated |

### Practical industry rule of thumb:
* Use **`git rebase`** to keep your local branch up to date with `main` before opening or merging a Pull Request.
* Use **`git merge`** (or the GitHub pull request merge workflow) to formally integrate an approved feature into a shared branch.

---

# 🛠️ Running a Rebase Step by Step

Suppose you are working on branch `feature/cart` and want to catch up with changes merged into `main`.

### 1. Update your local main branch

```bash
# 1. Switch to main branch
git switch main

# 2. Fast-forward pull latest remote changes
git pull --ff-only
```

### 2. Switch back to your working branch

```bash
# Switch back to your active feature branch
git switch feature/cart
```

### 3. Rebase onto main

```bash
# Replay feature/cart commits on top of the current tip of main
git rebase main
```

If your changes do not conflict with lines changed on `main`, Git replays each commit automatically:

```text
Successfully rebased and updated refs/heads/feature/cart.
```

---

# 💥 Handling Conflicts During a Rebase

Unlike a merge (where all conflicting changes are resolved at once at the end), a rebase replays commits **one by one**. If commit `D` conflicts with changes on `main`, Git pauses execution at that exact commit.

### Step-by-step conflict resolution:

#### 1. Inspect conflicting files

```bash
# Check which files have conflicts in the current commit
git status
```

Git will list conflicting files as `both modified`.

#### 2. Open the file and resolve the conflict markers

Just like in a traditional merge, you will see standard conflict markers:

```text
<<<<<<< HEAD (incoming changes from main)
const TAX_RATE = 0.21;
=======
const TAX_RATE = 0.18;
>>>>>>> D (your commit currently being replayed)
```

Edit the file, choose the correct logic, and delete the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).

#### 3. Stage the resolved file

```bash
# Mark the conflict for this step as resolved
git add src/config.js
```

#### 4. Continue the rebase (Do NOT commit!)

⚠️ **Critical detail**: During a rebase, do **not** run `git commit`. The original commit already exists; you only need to tell Git that the current conflict is resolved so it can continue replaying the remaining commits:

```bash
# Instruct Git to continue applying the remaining commits
git rebase --continue
```

Git will proceed to the next commit. If another commit introduces a conflict, repeat these steps until finished.

#### Need to abort?

If something went wrong or you want to return to the exact state before starting the rebase, abort cleanly:

```bash
# Abort the rebase operation entirely and restore previous branch state
git rebase --abort
```

---

# 🚫 The Golden Rule of Rebase

> **NEVER rebase public or shared branches.**

Apply `rebase` only to your **private local branches** that have not been pulled or depended upon by others.

### Why?
Rebasing changes commit identifiers. If you rebase a branch that your colleagues have already cloned (such as `main` or `develop`) and then force-push with `git push --force`, you rewrite their history. Their local clones will diverge, resulting in confusing sync errors and potential loss of team work.

---

# 🏆 Professional Git Best Practices

Knowing commands is only the foundation. Professional engineering teams demand disciplined workflows:

## 1. Atomic and Focused Commits

An atomic commit encompasses **a single, indivisible logical change**.
* ❌ **Bad**: A single commit that adds a login page, fixes a shopping cart bug, and re-indents 15 stylesheets (`"various fixes and login"`).
* ✔️ **Good**: Three separate commits, each with a single responsibility.

### Why atomic commits matter:
* They make Pull Requests easy and pleasant to review.
* They allow reverting a broken feature with `git revert` without losing unrelated fixes.
* They make tracking regressions effortless using `git bisect`.

---

## 2. Conventional Commits (Industry Standard)

Professional organizations follow the **Conventional Commits** specification for clear, machine-parseable, and human-readable commit messages:

```text
<type>(<optional scope>): <short imperative description>
```

### Primary types:
* **`feat:`** A new user-facing feature.
  * Example: `feat(auth): add google oauth login`
* **`fix:`** A bug fix.
  * Example: `fix(cart): prevent negative item quantities`
* **`docs:`** Documentation-only changes.
  * Example: `docs(api): update endpoints table`
* **`refactor:`** Code changes that neither fix a bug nor add a feature.
  * Example: `refactor(db): extract query builder helper`
* **`test:`** Adding or fixing tests.
  * Example: `test(auth): add unit test for token validation`
* **`chore:`** Maintenance, dependencies, or configuration tasks.
  * Example: `chore(deps): bump astro to version 6.0`

---

## 3. Strict `.gitignore` Management

The `.gitignore` file specifies intentionally untracked files that Git should ignore:

```text
# Package dependencies
node_modules/
vendor/

# Build artifacts
dist/
build/
*.class

# Environment variables and secrets (CRITICAL!)
.env
.env.local
*.pem
*.key

# OS and IDE temporary files
.DS_Store
Thumbs.db
.vscode/
.idea/
```

### 🔒 Security Rule:
**Never commit passwords, tokens, API keys, or `.env` files.** Removing a secret in a subsequent commit does not purge it from Git history; anyone with access to the repo can inspect previous commits. If a secret is committed, rotate or revoke it immediately.

---

## 4. Inspect Before You Commit

Before running `git add` and `git commit`, develop the habit of inspecting what changed:

```bash
# Check a concise summary of modified and untracked files
git status --short

# Inspect line-by-line differences in the working tree against the last commit
git diff
```

Avoid blindly running `git add .` without checking that you are not unintentionally staging temporary logs, test files, or unintended modifications.

---

# 📌 Lesson Command Summary

| Action | Command |
| :--- | :--- |
| Rebase current branch on top of `main` | `git rebase main` |
| Resume rebase after resolving conflicts | `git rebase --continue` |
| Abort rebase and restore previous state | `git rebase --abort` |
| View short working tree status | `git status --short` |
| View unstaged modifications | `git diff` |
