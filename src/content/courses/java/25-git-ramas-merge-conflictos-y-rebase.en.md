---
course: 'java'
slug: '25-git-ramas-merge-conflictos-y-rebase'
title: 'Git: Branches, Merges, Conflicts, and Rebase'
description: 'Learn to collaborate with branches, integrate changes, resolve conflicts, use rebase deliberately, and recover references with reflog.'
order: 8
lang: 'en'
published: true
---

# Git: Branches, Merges, Conflicts, and Rebase

A branch lets you develop a change without immediately moving the main line. It is not a complete copy of the project: it is a lightweight reference to a sequence of commits.

Working with branches does not eliminate conflicts. It makes the point where two histories separated visible and lets you choose how to integrate them. `merge` and `rebase` perform that integration differently; neither is universally better.

---

## 1. Check state before changing history

Before creating, integrating, or rewriting a branch, validate the context:

```bash
git status
git branch --show-current
git remote get-url origin
git log --oneline --decorate -5
```

Recommended preconditions:

- you are in the expected repository and branch;
- local changes are committed or explicitly preserved;
- `origin` points to the correct repository;
- the current branch's tests pass before integrating someone else's work.

Do not use `git reset --hard` to “clean up” without inspection: it deletes uncommitted changes. If `git status` shows work unrelated to the operation, commit it as a coherent unit or stop and decide how to preserve it.

---

## 2. Create and publish a working branch

First update remote information without changing your branch:

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feature/calculator
```

`git switch -c` creates a branch from the current commit and switches to it. A name such as `feature/calculator` communicates intent; a team may agree on prefixes such as `fix/`, `docs/`, or an issue identifier.

After one or more small, verifiable commits, publish the branch and set upstream tracking:

```bash
git status
git push -u origin feature/calculator
```

Tracking lets later `git push` and `git pull` know the corresponding remote branch. Publishing does not integrate the branch into `main`; it usually enables review through a pull request.

---

## 3. Forms of merge integration

`merge` preserves existing commit identities and joins histories.

### Fast-forward

If `main` has not advanced since the branch was created, Git can move its reference forward without an extra commit:

```bash
git switch main
git merge --ff-only feature/calculator
```

Benefit: minimal history. Limitation: the feature's visual grouping may disappear. `--ff-only` fails safely when another strategy is required.

### Merge commit

When both branches advanced, or when the team wants an explicit boundary, a commit with two parents can record the integration:

```bash
git switch main
git merge --no-ff feature/calculator
```

Benefit: preserves branch context. Cost: adds integration nodes and may make history more branched.

### Squash merge

`git merge --squash feature/calculator` stages the combined result as a new change, but it does not create a commit or preserve a merge relationship. It can simplify many provisional commits at the cost of losing their individual identities on `main`.

Repository policy determines which form to use. Do not switch strategy merely to make the graph “look clean.”

---

## 4. Detect and resolve a merge conflict

A conflict occurs when Git cannot decide how to combine changes. It does not mean data was lost: Git stops and preserves the versions so a person can decide.

```bash
git switch main
git status
git merge --no-ff feature/calculator
```

When a conflict exists, `git status` lists the files. They contain markers like these:

```text
    <<<<<<< HEAD
current branch version
    =======
feature/calculator version
    >>>>>>> feature/calculator
```

Safe process:

1. Open each file and understand the intent of both sides.
2. Write the correct result; do not automatically choose “ours” or “theirs.”
3. Remove every marker.
4. Run `git diff --check` and the relevant tests.
5. Stage only resolved files with `git add file`.
6. Check `git status` and complete with `git merge --continue` or `git commit`.
7. Run verification again after the commit.

If integration started on the wrong branch or you need to investigate first, return to the pre-merge state:

```bash
git merge --abort
git status
```

`git merge --abort` is preferable to editing references manually. It may fail when unrelated local changes were mixed into the operation, another reason to start with a clean tree.

---

## 5. What rebase does and what it costs

`rebase` takes commits from a branch and replays them on a different base. Replayed commits receive new identifiers because their parents changed. Final content may match a merge, but history does not.

It can be useful for updating a private branch before review:

```bash
git fetch origin
git switch feature/calculator
git status
git rebase origin/main
```

Potential benefits:

- linear history that is easy to scan;
- every branch commit follows the current base;
- conflicts are resolved commit by commit.

Costs:

- rewrites identifiers;
- may require resolving a similar conflict more than once;
- complicates collaboration when others built work on the old commits.

**Do not rebase shared history** on `main` or on a branch consumed by other people unless everyone explicitly coordinates it. For public history, merge usually preserves existing references more safely.

---

## 6. Resolve conflicts during rebase

When rebase stops:

```bash
git status
```

Git identifies the commit being applied and the conflicted files. Resolve their content and continue:

```bash
# Edit and remove <<<<<<<, =======, and >>>>>>>
git diff --check
git add path/to/file
git rebase --continue
```

Repeat status, resolution, tests, and `--continue` for each conflicted commit. Do not use `git rebase --skip` without inspection: it discards the current commit's patch and can remove behavior.

To abandon the entire operation and restore the branch as it was before rebase:

```bash
git rebase --abort
git status
```

After a successful rebase, run the applicable suite and inspect the new history:

```bash
git log --oneline --decorate --graph origin/main..HEAD
git status
```

---

## 7. Update a rewritten branch with relative safety

If the branch was private, had already been published, and was deliberately rewritten, the remote still holds the old identifiers. A normal update will be rejected.

`git push --force` replaces the remote reference without checking whether somebody else published new work. **Never use it as a quick fix.**

`--force-with-lease` adds a condition: it updates only if the remote reference matches the last value you observed. It still rewrites history, but reduces the risk of overwriting unknown changes:

```bash
git fetch origin
git log --oneline --left-right origin/feature/calculator...HEAD
git push --force-with-lease origin feature/calculator
```

Even with a lease, notify the team and confirm that the branch allows rewriting. If it is shared history, stop and use merge or coordinate a recovery plan.

---

## 8. Recover commits with reflog

The *reflog* records recent movements of local references. It helps after a mistaken rebase, reset, or branch change:

```bash
git reflog --date=local
git show FOUND_HASH
```

Inspect the commit first. Then create a rescue reference without moving or deleting the current branch:

```bash
git switch -c recovery/before-rebase FOUND_HASH
git status
```

Work from that branch to compare or recover commits under review. Reflog is local, expires, and does not replace a remote or backup. Do not run aggressive maintenance while recovering data.

---

## 9. Team collaboration practices

- Synchronize references with `git fetch origin` before choosing an integration.
- Keep commits small, coherent, and verifiable; do not mix unrelated refactors.
- Run tests before and after merge or rebase.
- Use pull requests to review intent, not only to detect textual conflicts.
- Agree whether working branches may be rewritten and who can integrate `main`.
- Delete a branch only after confirming that its commits are integrated and recoverable.
- Communicate before force-with-lease; a safer command does not replace coordination.

---

## 10. Guided exercise

1. From a clean `main`, create `feature/greeting` with `git switch -c`.
2. Create two small commits and publish them with upstream tracking.
3. Simulate a separate change on `main` and compare a merge commit with rebase on separate practice branches.
4. Produce a controlled conflict, resolve it, run tests, and complete the operation.
5. Repeat and use `--abort` to prove you can return to the initial state.
6. Locate the movements with `git reflog` and create a `recovery/` branch from an earlier commit.

The goal is not to always prefer rebase or merge, but to explain the historical cost, collaboration risk, and recovery path of each choice.
