---
course: 'git'
slug: 'rebase-y-buenas-practicas'
title: 'Rebase and best practices in Git'
description: 'Update your branch with git rebase, resolve conflicts during a rebase, tidy your commits with rebase -i and adopt the practices of a professional team: atomic commits, Conventional Commits, .gitignore and reviewing before you commit.'
order: 6
lang: 'en'
published: true
---

# Rebase and best practices in Git

In the [previous lesson](/en/courses/git/ramas-y-pull-requests) you worked on a feature branch with a Pull Request, and you updated your branch with `git fetch` + `git merge origin/main`. That works, but every update adds a merge commit to your branch. In this lesson you will learn the alternative many teams use to keep a clean history, and the practices that make that history useful.

In this lesson you will learn:

1. What `git rebase` does and why it changes the hashes of your commits.
2. When to use `merge` and when to use `rebase`.
3. How to update your branch with `git fetch` + `git rebase origin/main`.
4. How to resolve a conflict during a rebase, and why "ours" and "theirs" are swapped.
5. The golden rule of rebase and how to push your branch with `git push --force-with-lease`.
6. How to tidy your commits with `git rebase -i`.
7. Best practices: atomic commits, `git bisect`, Conventional Commits, `.gitignore`, secrets and reviewing before you commit.

From this lesson on, every commit message follows the **Conventional Commits** standard, explained below.

## What rebase is

`git merge` joins two histories by creating a **merge commit** with two parents. It keeps exactly what happened, but the history fills up with forks and joins.

`git rebase` does something else: it **changes the base of your branch**. Git takes the commits you made on your branch, sets them aside, moves your branch to the tip of the other branch and applies your commits again (*replay*), one by one, on top.

### Mental model

You created the branch `feature/cart` from commit `B`. While you were working, someone on the team integrated commit `C` into `main`.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-git-rebase-l6-t">
<title id="d-git-rebase-l6-t">Mental model of git rebase: the branch commits are applied again on top of the tip of main with new hashes</title>
<defs>
  <marker id="ar-rb-main-l6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-rb-feat-l6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-replay-l6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<text x="30" y="32" font-size="13" font-weight="700" fill="var(--color-neutral-800)">1. Before the rebase: the branches diverge</text>

<path d="M 60 70 L 330 70" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-rb-main-l6)"/>
<text x="45" y="75" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<path d="M 180 70 C 210 70, 220 120, 250 120 L 440 120" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-rb-feat-l6)"/>
<text x="460" y="125" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">feature/cart</text>

<circle cx="100" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="180" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<circle cx="290" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="290" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<circle cx="280" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="280" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>
<circle cx="390" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="390" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>

<path d="M 600 110 C 650 120, 650 190, 600 205" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-replay-l6)"/>
<text x="668" y="162" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">replay</text>

<text x="30" y="190" font-size="13" font-weight="700" fill="var(--color-neutral-800)">2. After git rebase origin/main: linear history</text>

<path d="M 60 240 L 290 240" fill="none" stroke="var(--color-accent)" stroke-width="3"/>
<path d="M 290 240 L 530 240" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-rb-feat-l6)"/>
<text x="45" y="245" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<circle cx="100" cy="240" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="180" cy="240" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<circle cx="290" cy="240" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="290" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="290" y="278" font-size="11" font-family="monospace" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">main</text>

<circle cx="380" cy="240" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="380" y="245" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D'</text>
<circle cx="480" cy="240" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="480" y="245" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E'</text>
<text x="550" y="245" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">feature/cart</text>

<rect x="340" y="288" width="300" height="22" rx="8" fill="var(--color-surface)" stroke="var(--color-divider)"/>
<text x="490" y="303" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">D' and E' are new commits: new hashes</text>
</svg>
<figcaption>Mental model of <code>git rebase</code>: the branch commits <code>D</code> and <code>E</code> are applied again on top of <code>C</code>, the tip of <code>main</code>. The result is two new commits, <code>D'</code> and <code>E'</code>, and a history with no forks.</figcaption>
</figure>

The commits are now called `D'` and `E'` because **they are new commits**: same change and same message, but a different parent (`C` instead of `B`). Since a commit hash depends on its parent, their hashes change. The original commits `D` and `E` are not deleted right away: no branch points to them any more, and you can still find them with `git reflog` (you saw it in [Undoing changes](/en/courses/git/deshacer-cambios)).

This has an important consequence: **a rebase rewrites the history of your branch**. Below you will see when that is safe and when it is not.

## Merge or rebase: how to choose

Neither is better; they solve the same problem with different priorities.

| Criterion | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| Shape of the history | Forks and merge commits | Linear |
| What happens to your commits | They do not change | They are replaced by new commits (new hashes) |
| Conflicts | Resolved once, in the merge commit | Resolved commit by commit, as they are replayed |
| Safe on shared branches | Yes | No |
| If you make a mistake | `git merge --abort` during the merge | `git rebase --abort` during the rebase |

A practical rule many teams use:

- Use **`git rebase origin/main`** to update **your own** feature branch before opening or updating a Pull Request. The review then shows only your changes, on top of the latest `main`.
- Use **merge** (on GitHub, with the Pull Request button) to integrate the finished feature into `main`. In [lesson 5](/en/courses/git/ramas-y-pull-requests) you saw GitHub's options: *Rebase and merge* does exactly this replay on the server.
- If several people share your branch, update it with `git merge origin/main`, as in the previous lesson.

## Rebase step by step

Let's pick up the lesson 5 workflow. You are on your branch `feature/cart`, which you already pushed with `git push -u origin feature/cart` to open the Pull Request. It has two commits. Meanwhile, Beto integrated a change to the shipping cost into `main`.

### 1. Download the news

```bash
git fetch
```

```text
From github.com:your-user/shop
   1264b56..d5e72ab  main       -> origin/main
```

`git status` does not warn you, because it compares your branch with `origin/feature/cart`, not with `main`:

```text
On branch feature/cart
Your branch is up to date with 'origin/feature/cart'.

nothing to commit, working tree clean
```

To see the divergence, look at the graph of every branch:

```bash
git log --oneline --graph --all
```

```text
* d5e72ab fix(shipping): update the shipping cost
| * b4c6c0a feat(shipping): add free shipping from 10000
| * a45c681 feat(cart): compute the total
|/
* 1264b56 chore: add initial configuration
```

### 2. Rebase onto origin/main

You do not need to update your local `main` first: `origin/main` already has the latest you downloaded.

```bash
git rebase origin/main
```

If your commits do not clash with the changes in `main`, Git replays them on its own and ends with:

```text
Successfully rebased and updated refs/heads/feature/cart.
```

In this example, Beto and you changed the same line of `config.js`, so the rebase stops with a conflict.

## Conflicts during a rebase

In a merge, all conflicts show up together at the end. In a rebase, Git replays your commits **one at a time**, and stops at the first commit that clashes:

```text
Auto-merging config.js
CONFLICT (content): Merge conflict in config.js
error: could not apply b4c6c0a... feat(shipping): add free shipping from 10000
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: run "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
hint: Disable this message with "git config set advice.mergeConflict false"
Could not apply b4c6c0a... # feat(shipping): add free shipping from 10000
```

The first commit (`a45c681`, which only creates `cart.js`) was already replayed without problems; the second one is the one that clashes.

### 1. Check the status

```bash
git status
```

```text
interactive rebase in progress; onto d5e72ab
Last commands done (2 commands done):
   pick a45c681 # feat(cart): compute the total
   pick b4c6c0a # feat(shipping): add free shipping from 10000
No commands remaining.
You are currently rebasing branch 'feature/cart' on 'd5e72ab'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this patch)
  (use "git rebase --abort" to check out the original branch)

Unmerged paths:
  (use "git restore --staged <file>..." to unstage)
  (use "git add <file>..." to mark resolution)
	both modified:   config.js

no changes added to commit (use "git add" and/or "git commit -a")
```

Git tells you which commit it is on, how many are left and which file has the conflict.

### 2. Resolve the markers

Open `config.js`:

```text
const TAX_RATE = 0.21;
<<<<<<< HEAD
const SHIPPING_COST = 700;
=======
const SHIPPING_COST = 600;
const FREE_SHIPPING_FROM = 10000;
>>>>>>> b4c6c0a (feat(shipping): add free shipping from 10000)
```

The markers are the ones you know from [Branches, merging and conflicts](/en/courses/git/conflictos), but look at what is on each side:

- Between `<<<<<<< HEAD` and `=======` is the **`origin/main`** version (with your commits already replayed). During a rebase, `HEAD` is the new base, not your branch.
- Between `=======` and `>>>>>>>` is **your commit**, identified by its hash and message (`b4c6c0a (feat(shipping): ...)`).

Decide the result and delete the markers. Here you keep Beto's new cost and your free shipping:

```js
const TAX_RATE = 0.21;
const SHIPPING_COST = 700;
const FREE_SHIPPING_FROM = 10000;
```

### The "ours" and "theirs" swap

In a merge you stand on your branch and bring in the other one: "ours" is your branch and "theirs" is the one you bring in. In a rebase it is the other way round, because Git stands on the new base and brings in your commits:

| During... | `HEAD` / "ours" | "theirs" |
| :--- | :--- | :--- |
| `git merge origin/main` | Your branch | `origin/main` |
| `git rebase origin/main` | `origin/main` (the new base) | Your commit being replayed |

This matters when you want to keep one whole side of a conflicted file. During a rebase:

```bash
# Keep YOUR version of the file (the one from your commit)
git restore --theirs config.js

# Keep the origin/main version
git restore --ours config.js
```

After either of them, you still have to mark the file as resolved with `git add`.

### 3. Mark the file as resolved

```bash
git add config.js
```

### 4. Continue the rebase, without committing

During a rebase you do **not** run `git commit`. The commit being replayed already has its message; you just tell Git to go on:

```bash
git rebase --continue
```

Git may open your editor with the commit message so you can confirm it: save and close. Then it carries on with the remaining commits:

```text
[detached HEAD 5d1dad6] feat(shipping): add free shipping from 10000
 1 file changed, 1 insertion(+)
Successfully rebased and updated refs/heads/feature/cart.
```

The `detached HEAD` in the message is normal: during the rebase Git builds the new commits without a branch and, when it finishes, moves `feature/cart` to them. If another commit had a conflict, you would repeat steps 1 to 4.

Look at the result:

```bash
git log --oneline --graph --all
```

```text
* 5d1dad6 feat(shipping): add free shipping from 10000
* 2c8e0f3 feat(cart): compute the total
* d5e72ab fix(shipping): update the shipping cost
| * b4c6c0a feat(shipping): add free shipping from 10000
| * a45c681 feat(cart): compute the total
|/
* 1264b56 chore: add initial configuration
```

Your two commits now sit on top of `d5e72ab` and have new hashes (`2c8e0f3` and `5d1dad6`). The branch on the right is your old commits, still on `origin/feature/cart` because you have not pushed anything yet.

### If something goes wrong: git rebase --abort

If you got confused or would rather not go on, cancel the rebase at any moment before it finishes:

```bash
git rebase --abort
```

It prints nothing, but your branch goes back exactly to its state before the rebase, with its original commits and hashes.

## The golden rule of rebase

> **Never rebase a branch other people build on**: `main`, `develop` or any shared branch.

### Why

A rebase replaces commits with new commits. If someone else already has the old commits and works on top of them, their history and the remote's no longer match: they would have to redo their work on top of the new commits, and it is easy for someone to push the old commits again as duplicates, or for work to get lost.

### Your own already-pushed branch: git push --force-with-lease

Rebasing **your own** feature branch, even if you already pushed it, is normal before a Pull Request: nobody else builds on it. But after the rebase, a normal `git push` is rejected:

```bash
git push
```

```text
To github.com:your-user/shop.git
 ! [rejected]        feature/cart -> feature/cart (non-fast-forward)
error: failed to push some refs to 'github.com:your-user/shop.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

It is the same rejection you saw in [Pulling and pushing changes](/en/courses/git/bajar-y-subir-cambios), but here you must **not** run `git pull`: that would bring your old commits back and mix them with the new ones. What you want is to replace the remote branch with yours:

```bash
git push --force-with-lease
```

```text
To github.com:your-user/shop.git
 + b4c6c0a...5d1dad6 feature/cart -> feature/cart (forced update)
```

The Pull Request updates itself with the new commits.

### Why never plain --force

`git push --force` replaces the remote branch without asking anything. If a teammate pushed a commit to your branch while you were rebasing, `--force` deletes it from the remote without telling you.

`--force-with-lease` only replaces the remote branch if it is still where you last saw it (in your `origin/feature/cart`). If someone pushed something you do not have, the push is rejected:

```text
To github.com:your-user/shop.git
 ! [rejected]        feature/cart -> feature/cart (stale info)
error: failed to push some refs to 'github.com:your-user/shop.git'
```

In that case, run `git fetch`, look at what that person pushed with `git log feature/cart..origin/feature/cart` and bring it in before pushing again. Careful: a `git fetch` updates what Git has "seen", so if you fetch and then force without looking, `--force-with-lease` no longer protects you.

## Tidying your commits with git rebase -i

Before asking for a review, your branch sometimes has commits that do not tell the story well: a message with typos, a "fix typo" commit that fixes the previous one. The **interactive rebase** lets you rewrite the latest commits of your branch:

```bash
git log --oneline
```

```text
760d9cc fix typo
594027d feat(profile): show the name
483a4e1 feat(profile): add profle page
cd8d4b5 docs: add README
```

```bash
# Edit the last 3 commits
git rebase -i HEAD~3
```

`HEAD~3` means "three commits before `HEAD`": the rebase rewrites the three commits that come after it. Git opens your editor with the **todo list**, oldest first:

```text
pick 483a4e1 # feat(profile): add profle page
pick 594027d # feat(profile): show the name
pick 760d9cc # fix typo

# Rebase cd8d4b5..760d9cc onto cd8d4b5 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
...
```

You change the word at the start of each line to say what to do with that commit:

| Command | What it does |
| :--- | :--- |
| `pick` | Keeps the commit as it is |
| `reword` | Keeps the change, but lets you edit the message |
| `squash` | Melds the commit into the previous one and lets you combine both messages |
| `fixup` | Melds the commit into the previous one and discards its message |
| `drop` | Removes the commit (and its change) |

You can also reorder the lines. To fix the first commit's message and fold "fix typo" into the second one, leave the list like this:

```text
reword 483a4e1 # feat(profile): add profle page
pick 594027d # feat(profile): show the name
fixup 760d9cc # fix typo
```

Save and close. Because of the `reword`, Git opens the editor with the first commit's message; you change it to `feat(profile): add the profile page`, save and close:

```text
Successfully rebased and updated refs/heads/feature/profile.
```

```bash
git log --oneline
```

```text
73cdcc7 feat(profile): show the name
ad3e35c feat(profile): add the profile page
cd8d4b5 docs: add README
```

Three commits became two, with clear messages. Like every rebase, `rebase -i` creates new commits: the golden rule applies. Use it on your own branch and, if you had already pushed it, update it with `git push --force-with-lease`. If something goes wrong halfway, `git rebase --abort` works here too.

## Professional best practices

### Atomic commits

An atomic commit contains **a single logical change**: complete, and nothing else.

- Bad: one commit that adds the login screen, fixes a cart bug and changes styles in 15 files, with the message "several fixes".
- Good: three commits, each with one purpose and a message that describes it.

Why it matters:

- A Pull Request with atomic commits can be reviewed commit by commit.
- If a change breaks something, you undo it with `git revert` (you saw it in [Undoing changes](/en/courses/git/deshacer-cambios)) without taking healthy work with it.
- When you look for the commit that introduced a bug, the culprit is small and easy to understand.

### Finding the commit that broke something with git bisect

Suppose the tax rate is wrong (`2.1` instead of `0.21`), you know it was right in the first commit and you do not know when it broke:

```text
dcfda88 feat(payments): add payments
6f95087 feat(coupons): add coupons
568db65 feat(discounts): add discounts
178dd0f feat(shipping): add shipping
9010656 feat(cart): add the cart
f415ab7 chore: add configuration
```

`git bisect` runs a binary search over the history: it takes you to a commit in the middle, you say whether it is good or bad, and it repeats until it finds the first bad one.

```bash
git bisect start
git bisect bad            # the current commit has the bug
git bisect good f415ab7   # this commit was fine
```

```text
Bisecting: 2 revisions left to test after this (roughly 1 step)
[178dd0fdcee4a372560a8a7e1fb354489c442520] feat(shipping): add shipping
```

Git left you on `178dd0f` (in detached HEAD, like when you inspected an old commit). You test the project: here `config.js` has `0.21`, so it is good:

```bash
git bisect good
```

```text
Bisecting: 0 revisions left to test after this (roughly 1 step)
[6f950875fa25e45612fe04748dc46d3be88bd92a] feat(coupons): add coupons
```

Here `2.1` already shows up:

```bash
git bisect bad
```

```text
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[568db65b90bf119754f1da8b446558a8d6435344] feat(discounts): add discounts
```

It is bad too:

```bash
git bisect bad
```

```text
568db65b90bf119754f1da8b446558a8d6435344 is the first bad commit
commit 568db65b90bf119754f1da8b446558a8d6435344
Author: Ana <ana@example.com>
Date:   Sun Nov 22 01:19:23 2026 -0300

    feat(discounts): add discounts

 config.js   | 2 +-
 discount.js | 1 +
 2 files changed, 2 insertions(+), 1 deletion(-)
 create mode 100644 discount.js
```

Always finish with `git bisect reset`, which takes you back to the branch you were on:

```bash
git bisect reset
```

Look at the culprit: a "discounts" commit that also touched `config.js`. A non-atomic commit hides the bug; if the tax rate change had had its own commit, its message would have given it away.

### Conventional Commits

**Conventional Commits** is a message standard that makes the history easy to read and lets tools generate versions and release notes automatically:

```text
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

- The **description** is short, in the imperative mood and with no final period: `add`, `fix`, `remove`.
- The **scope** names the part of the project affected: `feat(cart): ...`.
- The **body** explains the why, when needed.

Common types:

| Type | When to use it | Example |
| :--- | :--- | :--- |
| `feat` | A new feature | `feat(cart): add free shipping from 10000` |
| `fix` | A bug fix | `fix(cart): prevent negative quantities` |
| `docs` | Documentation only | `docs: explain how to install the project` |
| `style` | Formatting with no behavior change (spaces, commas, indentation) | `style: apply the linter format` |
| `refactor` | Restructures code without adding features or fixing bugs | `refactor(db): extract the query builder` |
| `perf` | A performance improvement | `perf(catalog): cache the product list` |
| `test` | Adds or fixes tests | `test(auth): test the token validation` |
| `build` | Build system or dependencies | `build: upgrade astro to version 6` |
| `ci` | Continuous integration configuration | `ci: run the tests on every Pull Request` |
| `chore` | Maintenance tasks that do not touch application code | `chore: ignore the logs folder` |

#### Breaking changes

If a change forces the people who use your code to change theirs, mark it with `!` after the type (or the scope) and explain it in a `BREAKING CHANGE:` footer:

```text
feat(api)!: remove the /v1/orders endpoint

BREAKING CHANGE: clients must use /v2/orders, which returns paginated orders.
```

To write a message with a body or a footer, you can run `git commit` without `-m` (Git opens the editor) or use several `-m`, one per paragraph:

```bash
git commit -m "feat(api)!: remove the /v1/orders endpoint" -m "BREAKING CHANGE: clients must use /v2/orders, which returns paginated orders."
```

### .gitignore

The `.gitignore` file, at the root of the project, tells Git which files it must not track. It is versioned like any other file, so the whole team ignores the same things.

```text
# Dependencies (reinstalled by the package manager)
node_modules/

# Build output
dist/

# Logs, except one we do want to version
*.log
!important.log

# Secrets and environment variables
.env
.env.local
*.pem
```

| Pattern | Meaning |
| :--- | :--- |
| `dist/` | The `dist` folder and everything in it, at any level |
| `*.log` | Any file ending in `.log` |
| `!important.log` | Exception: this file is tracked |
| `/.env` | Only the `.env` at the root, not the ones in subfolders |
| `# ...` | Comment |

#### Ignoring does not untrack

`.gitignore` only affects **untracked** files. If a file is already in a commit, adding it to `.gitignore` changes nothing: Git keeps seeing its changes. For example, with `.env` already committed:

```bash
echo ".env" >> .gitignore
git status --short
```

```text
 M .env
?? .gitignore
```

To make Git stop tracking it **without deleting it from your disk**, remove it from the index with `git rm --cached`:

```bash
git rm --cached .env
```

```text
rm '.env'
```

```bash
git status --short
```

```text
D  .env
?? .gitignore
```

The `D` in the first column means "deleted in staging": in the next commit, `.env` leaves the repository, but the file stays in your folder. Commit both changes together:

```bash
git add .gitignore
git commit -m "chore: stop tracking the .env file"
```

For a whole folder, add `-r`: `git rm -r --cached logs/`.

#### A global gitignore for your system and your editor

Files such as `.DS_Store` (macOS), `Thumbs.db` (Windows) or `.vscode/` and `.idea/` (editors) depend on **your** computer, not on the project. Instead of adding them to the `.gitignore` of every repository, put them in a global gitignore:

```bash
# Create the file with your personal patterns
printf ".DS_Store\nThumbs.db\n.vscode/\n.idea/\n" > ~/.gitignore_global

# Tell Git to use it in all your repositories
git config --global core.excludesFile ~/.gitignore_global
```

From then on, `git status` stops showing those files in all your projects.

### Secrets

**Never commit passwords, tokens, API keys or `.env` files to Git.** If a secret reaches a commit, deleting it in the next commit is not enough: it stays in the history and anyone with access to the repository can see it. And if you already pushed it, rewriting the history does not guarantee anything either, because other people or services may have copied it.

If it happens to you:

1. **Revoke or rotate the secret right away** (generate a new one in the service and disable the old one). This is the only thing that really protects you.
2. Stop tracking the file with `git rm --cached` and add it to `.gitignore`.
3. To share the configuration, version an example file with no real values, such as `.env.example`.

### Reviewing before you commit

Before every commit, review what you are about to include. You saw these commands in [Getting Started with Git](/en/courses/git/el-principio-con-git); here they come together as a habit.

#### git status --short

```bash
git status --short
```

```text
MM app.js
?? notes.txt
```

Each line has two columns: the first one is **staging** and the second one is the **working tree**.

| Code | Meaning |
| :--- | :--- |
| `M ` | Modified and staged |
| ` M` | Modified, not staged |
| `MM` | One part staged and another modified afterwards |
| `A ` | New file, staged |
| `D ` | Deleted in staging |
| `??` | Untracked |

#### git diff and git diff --staged

| Command | Compares |
| :--- | :--- |
| `git diff` | Working tree against **staging**: what you have not added yet |
| `git diff --staged` | Staging against the **last commit**: what goes into the next commit |
| `git diff HEAD` | Working tree against the last commit: everything you changed |

A common mistake is to believe that `git diff` compares against the last commit: if you already added everything with `git add`, `git diff` shows nothing, even though there are changes ready to commit. To see those, use `git diff --staged`.

#### git add -p: adding in parts

If you made two unrelated changes in one file, `git add -p` (for *patch*) shows you each block of changes (*hunk*) and asks whether to add it. That way you build atomic commits even if you worked on two things at once.

```bash
git add -p
```

```text
diff --git a/app.js b/app.js
index 25eec48..5102c85 100644
--- a/app.js
+++ b/app.js
@@ -1,5 +1,5 @@
 function greet() {
-  console.log('hello');
+  console.log('hello, world');
 }


(1/2) Stage this hunk [y,n,q,a,d,k,K,j,J,g,/,e,p,P,?]?
```

The most used answers:

- `y`: stage this hunk.
- `n`: do not stage it.
- `s`: split the hunk into smaller hunks, if possible.
- `q`: quit without asking about the remaining hunks.
- `?`: show the help.

If you answer `y` to the first hunk and `n` to the second, `git status --short` shows `MM app.js`: `git diff --staged` shows only the first change (what goes into the commit) and `git diff` only the second one (what stays out).

Do not run `git add .` blindly: first `git status --short`, then `git diff`, and add what belongs.

## Command summary

| Action | Command |
| :--- | :--- |
| Replay your branch on top of the latest from the remote | `git fetch` + `git rebase origin/main` |
| Continue after resolving a conflict | `git add <file>` + `git rebase --continue` |
| Cancel the rebase and go back to the previous state | `git rebase --abort` |
| Keep your version during a rebase | `git restore --theirs <file>` |
| Push your own branch after a rebase | `git push --force-with-lease` |
| Rewrite the last 3 commits | `git rebase -i HEAD~3` |
| Find the commit that introduced a bug | `git bisect start`, `bad`, `good <hash>`, `reset` |
| Stop tracking a file without deleting it | `git rm --cached <file>` |
| Use a global gitignore | `git config --global core.excludesFile ~/.gitignore_global` |
| See the short status | `git status --short` |
| See what is not staged | `git diff` |
| See what goes into the commit | `git diff --staged` |
| Stage changes in parts | `git add -p` |

## Practice exercises

Do the exercises in a practice folder. You do not need GitHub: in a local repository, `main` plays the role of `origin/main`.

### Exercise 1: rebase with a conflict

1. Create a repository with a file `price.txt` that says `PRICE = 100` and commit it on `main`.
2. Create the branch `feature/sale`, change the line to `PRICE = 80` and commit it.
3. Go back to `main`, change the line to `PRICE = 120` and commit it.
4. Go back to `feature/sale` and rebase it onto `main`. Resolve the conflict by keeping `PRICE = 96` and finish the rebase.
5. Check with `git log --oneline --graph --all` that the history is linear.

<details>
<summary>Show solution</summary>

```bash
git init rebase-practice
cd rebase-practice
echo "PRICE = 100" > price.txt
git add price.txt
git commit -m "feat: add the price"

git switch -c feature/sale
echo "PRICE = 80" > price.txt
git add price.txt
git commit -m "feat(sale): apply the discount"

git switch main
echo "PRICE = 120" > price.txt
git add price.txt
git commit -m "fix: update the price"

git switch feature/sale
git rebase main
```

The rebase stops with `CONFLICT (content): Merge conflict in price.txt`. The file looks like this:

```text
<<<<<<< HEAD
PRICE = 120
=======
PRICE = 80
>>>>>>> e3cc2ee (feat(sale): apply the discount)
```

On top is `main` (the new base) and below is your commit; the hash will be different on your computer. Keep only `PRICE = 96` and continue:

```bash
echo "PRICE = 96" > price.txt
git add price.txt
git rebase --continue
git log --oneline --graph --all
```

The graph is a single line: `feat(sale): apply the discount` now sits on top of `fix: update the price`. If you make a mistake in step 4, `git rebase --abort` takes you back to the previous state.

</details>

### Exercise 2: combining commits with rebase -i

1. On a new branch `feature/contact`, create three commits: one that creates `contact.html`, another that adds a form to it and a third one with the message `wip` that fixes a bug in the form.
2. With `git rebase -i`, fold the `wip` commit into the form commit without keeping its message, and change the first commit's message to `feat(contact): add the contact page`.
3. Check that two commits are left.

<details>
<summary>Show solution</summary>

```bash
git switch -c feature/contact
echo "<h1>Contact</h1>" > contact.html
git add contact.html
git commit -m "feat(contact): page"
echo "<form></form>" >> contact.html
git add contact.html
git commit -m "feat(contact): add the form"
echo "<!-- fix the form -->" >> contact.html
git add contact.html
git commit -m "wip"

git rebase -i HEAD~3
```

In the todo list, leave:

```text
reword <hash1> # feat(contact): page
pick <hash2> # feat(contact): add the form
fixup <hash3> # wip
```

Save and close. When Git opens the first commit's message, change it to `feat(contact): add the contact page`. Then:

```bash
git log --oneline
```

It shows two new commits for the branch: `feat(contact): add the form` and `feat(contact): add the contact page`. If you had used `squash` instead of `fixup`, Git would have let you combine both messages.

</details>

### Exercise 3: untracking a file

1. In a repository, create `.env` with `TOKEN=secret` and commit it (by mistake).
2. Add `.env` to `.gitignore` and check with `git status --short` that Git still sees its changes when you modify it.
3. Make Git stop tracking it without deleting it from your disk, and commit the change.
4. What else would you have to do if that token were real and the repository were on GitHub?

<details>
<summary>Show solution</summary>

```bash
echo "TOKEN=secret" > .env
git add .env
git commit -m "chore: add configuration"

echo ".env" >> .gitignore
echo "TOKEN=other" > .env
git status --short
```

```text
 M .env
?? .gitignore
```

`.env` still shows up as modified because it was already tracked. Remove it from the index:

```bash
git rm --cached .env
git add .gitignore
git commit -m "chore: stop tracking the .env file"
git status --short
ls -a
```

`git status --short` no longer shows `.env` and `ls -a` confirms the file is still in your folder.

If the token were real, it is still in the history (in the first commit): you would have to **revoke or rotate** it in the service that issued it. Untracking it only stops it from coming back in.

</details>

### Exercise 4: atomic commits with git add -p and Conventional Commits

1. In a file that is already committed, make two unrelated changes: fix a bug in one function and add a documentation comment somewhere else in the file, far from the first one.
2. Use `git add -p` to commit each change in its own commit, with a suitable Conventional Commits message.
3. Write the message you would use for a change that renames your program's `--color` option to `--theme`, so that people who used `--color` have to change their scripts.

<details>
<summary>Show solution</summary>

```bash
git add -p
```

Answer `y` to the fix hunk and `n` to the comment hunk. Review before committing:

```bash
git diff --staged   # only the fix
git commit -m "fix: correct the total calculation"

git add -p          # now only the comment hunk is left: answer y
git diff --staged   # only the comment
git commit -m "docs: document the shipping function"
```

If both changes show up in the same hunk, answer `s` to split it.

For the breaking change:

```text
feat!: rename the --color option to --theme

BREAKING CHANGE: the --color option no longer exists; use --theme.
```

The `!` and the `BREAKING CHANGE:` footer warn that people using the program have to change something.

</details>
