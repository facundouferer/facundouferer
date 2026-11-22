---
course: 'git'
slug: 'deshacer-cambios'
title: 'Undoing changes'
description: 'Learn to discard changes, fix the last commit, revert commits, move HEAD with reset, inspect old commits and recover work with reflog.'
order: 2
lang: 'en'
published: true
---

# Undoing changes

Making mistakes is part of the job. What matters is knowing **what** you want to undo and **where** that change lives: in the working tree, in the staging area or already in a commit. Each case has its own command.

In this lesson you will learn to:

- Discard the changes in a file with `git restore`.
- Remove a file from the staging area with `git restore --staged`.
- Fix the last commit with `git commit --amend`.
- View a commit with `git show` and undo it with `git revert`.
- Move `HEAD` back with `git reset --soft`, `--mixed` and `--hard`.
- Recover a "lost" commit with `git reflog`.
- Visit an old commit with `git switch --detach` and bring back a file from the past with `git restore --source`.

## The example project

The whole lesson is a single example you can run from start to finish. Start with a new repository in a separate folder, as in the previous lesson:

```bash
mkdir undo-practice
cd undo-practice
git init
echo "Hello world" > greeting.txt
git add greeting.txt
git commit -m "Add initial greeting"
```

```text
[main (root-commit) 261c13d] Add initial greeting
 1 file changed, 1 insertion(+)
 create mode 100644 greeting.txt
```

Your hashes will differ from the ones in this lesson, because they depend on the author and the date. Always use the ones your terminal shows you.

## Discarding changes in the working tree: `git restore`

Suppose you change `greeting.txt` by mistake:

```bash
echo "Text deleted by mistake" > greeting.txt
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   greeting.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

`git status` itself suggests the way out. `git restore <file>` puts the file back as it is in the last commit:

```bash
git restore greeting.txt
cat greeting.txt
```

```text
Hello world
```

> **Warning:** `git restore <file>` is destructive. Changes you never committed are lost for good: Git never recorded them, so there is no way to get them back. Use it only when you are sure.

`git restore` only affects files Git already tracks. A new file you never added is left alone.

## Removing a file from the staging area: `git restore --staged`

You saw this in the previous lesson. If you ran `git add` on something you did not want in the next commit:

```bash
echo "Text deleted by mistake" > greeting.txt
git add greeting.txt
git restore --staged greeting.txt
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   greeting.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

`--staged` deletes nothing: the change is still in your working tree. If you also want to discard it, combine both steps:

```bash
git restore greeting.txt
```

## Fixing the last commit: `git commit --amend`

### Changing the message

You make a commit with a typo in the message:

```bash
echo "Bye" > farewell.txt
git add farewell.txt
git commit -m "Add farewel"
```

```text
[main 77dde29] Add farewel
 1 file changed, 1 insertion(+)
 create mode 100644 farewell.txt
```

`--amend` replaces the last commit with a new one that has the fixed message:

```bash
git commit --amend -m "Add farewell"
```

```text
[main f3e279c] Add farewell
 Date: Tue Mar 10 10:17:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 farewell.txt
```

### Adding a forgotten file

You also forgot to include `signature.txt`. Add it to the staging area and amend without changing the message, using `--no-edit`:

```bash
echo "Ana" > signature.txt
git add signature.txt
git commit --amend --no-edit
git log --oneline
```

```text
[main 9a6ac3b] Add farewell
 Date: Tue Mar 10 10:17:00 2026 +0000
 2 files changed, 2 insertions(+)
 create mode 100644 farewell.txt
 create mode 100644 signature.txt
9a6ac3b Add farewell
261c13d Add initial greeting
```

Look at the hash: it went from `77dde29` to `f3e279c` and then to `9a6ac3b`. `--amend` does not edit the commit: it creates a new one and drops the previous one from the history.

> **Rule:** use `--amend` only on commits you have not shared with other people yet. If someone already has that commit, your history and theirs no longer match. You will see how work is shared in the [Pulling and pushing changes](/en/courses/git/bajar-y-subir-cambios) lesson.

## Viewing a commit: `git show`

Now make a change you will later want to undo:

```bash
echo "Hola mundo" > greeting.txt
git add greeting.txt
git commit -m "Change greeting to Spanish"
git log --oneline
```

```text
2f55221 Change greeting to Spanish
9a6ac3b Add farewell
261c13d Add initial greeting
```

`git show <hash>` shows the commit's data and exactly what changed:

```bash
git show 2f55221
```

```text
commit 2f55221f229527d3f820930bc89ea87291be701d
Author: Ana <ana@example.com>
Date:   Tue Mar 10 10:25:00 2026 +0000

    Change greeting to Spanish

diff --git a/greeting.txt b/greeting.txt
index 802992c..2d9b695 100644
--- a/greeting.txt
+++ b/greeting.txt
@@ -1 +1 @@
-Hello world
+Hola mundo
```

Lines starting with `-` were removed and lines starting with `+` were added.

## Undoing a commit without rewriting history: `git revert`

`git revert <hash>` creates a **new commit** that applies the opposite change. The original commit stays in the history:

```bash
git revert 2f55221
```

Git opens your editor with the message `Revert "Change greeting to Spanish"`. Save and close:

```text
[main 42a3fa7] Revert "Change greeting to Spanish"
 Date: Tue Mar 10 10:28:00 2026 +0000
 1 file changed, 1 insertion(+), 1 deletion(-)
```

```bash
cat greeting.txt
git log --oneline
```

```text
Hello world
42a3fa7 Revert "Change greeting to Spanish"
2f55221 Change greeting to Spanish
9a6ac3b Add farewell
261c13d Add initial greeting
```

Since `revert` only **adds** a commit, it is the safe way to undo commits you already shared with other people. You can revert any commit, not just the last one.

## Moving HEAD back: `git reset`

`HEAD` points to the commit you are on. `git reset` moves `HEAD` to another commit, and the commits left "ahead" of it drop out of the history. The option you pick decides what happens to the changes in those commits.

`HEAD~1` means "the parent of `HEAD`", that is, one commit back.

Create a commit to practice with:

```bash
echo "Buy bread" > tasks.txt
git add tasks.txt
git commit -m "Add task list"
```

<figure class="diagram">
<svg viewBox="0 0 740 360" role="img" aria-labelledby="d-git-reset-l2-t">
<title id="d-git-reset-l2-t">The three modes of git reset HEAD~1: where the changes of the undone commit end up</title>
<defs>
  <marker id="ar-reset-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<text x="215" y="34" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Repository (HEAD)</text>
<text x="425" y="34" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Staging area</text>
<text x="635" y="34" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Working tree</text>

<!-- soft -->
<text x="20" y="95" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">--soft</text>
<rect x="130" y="62" width="170" height="56" rx="14" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="95" font-size="12" text-anchor="middle" fill="var(--color-accent-800)">moves back 1 commit</text>
<rect x="340" y="62" width="170" height="56" rx="14" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="425" y="95" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">the changes stay here</text>
<rect x="550" y="62" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-neutral-300)" stroke-width="2"/>
<text x="635" y="95" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">unchanged</text>
<path d="M 300 90 L 336 90" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-reset-l2)"/>

<!-- mixed -->
<text x="20" y="185" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">--mixed</text>
<text x="20" y="203" font-size="11" fill="var(--color-neutral-600)">(default)</text>
<rect x="130" y="162" width="170" height="56" rx="14" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="195" font-size="12" text-anchor="middle" fill="var(--color-accent-800)">moves back 1 commit</text>
<rect x="340" y="162" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-neutral-300)" stroke-width="2"/>
<text x="425" y="195" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">same as HEAD</text>
<rect x="550" y="162" width="170" height="56" rx="14" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="635" y="195" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">the changes stay here</text>
<path d="M 215 218 C 215 240, 635 240, 635 222" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-reset-l2)"/>

<!-- hard -->
<text x="20" y="295" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">--hard</text>
<rect x="130" y="262" width="170" height="56" rx="14" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="295" font-size="12" text-anchor="middle" fill="var(--color-accent-800)">moves back 1 commit</text>
<rect x="340" y="262" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-neutral-300)" stroke-width="2"/>
<text x="425" y="295" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">same as HEAD</text>
<rect x="550" y="262" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-700)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="635" y="288" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">same as HEAD</text>
<text x="635" y="306" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">the changes are lost</text>

<text x="20" y="348" font-size="11" fill="var(--color-neutral-600)">The undone commit is still in git reflog and can be recovered in all three cases.</text>
</svg>
<figcaption>With <code>git reset HEAD~1</code>, HEAD moves back in all three modes. The difference is where the changes of the undone commit end up.</figcaption>
</figure>

| Mode | HEAD | Staging area | Working tree | Use it to |
| --- | --- | --- | --- | --- |
| `--soft` | Moves back | Keeps the commit's changes | Unchanged | Redo the commit (for example, combine several into one) |
| `--mixed` | Moves back | Becomes the same as HEAD | Keeps the commit's changes | Choose again what to add with `git add` |
| `--hard` | Moves back | Becomes the same as HEAD | Becomes the same as HEAD | Throw away the commit and every uncommitted change |

### `git reset --soft`

```bash
git reset --soft HEAD~1
git status
```

```text
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   tasks.txt
```

The commit is gone from the history, but its changes are in the staging area, ready for a new commit. Make it again to keep practicing:

```bash
git commit -m "Add task list"
```

### `git reset --mixed`

This is the default mode: `git reset HEAD~1` does the same.

```bash
git reset --mixed HEAD~1
git status
```

```text
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	tasks.txt

nothing added to commit but untracked files present (use "git add" to track)
```

The changes are only in the working tree. Since `tasks.txt` was new, Git shows it as an untracked file. Create the commit again:

```bash
git add tasks.txt
git commit -m "Add task list"
```

### `git reset --hard`

```bash
git reset --hard HEAD~1
ls
git log --oneline
```

```text
HEAD is now at 42a3fa7 Revert "Change greeting to Spanish"
farewell.txt
greeting.txt
signature.txt
42a3fa7 Revert "Change greeting to Spanish"
2f55221 Change greeting to Spanish
9a6ac3b Add farewell
261c13d Add initial greeting
```

`tasks.txt` no longer exists. `--hard` also throws away any uncommitted change in the files Git tracks, and those changes **cannot be recovered**.

> **Careful:** `reset` rewrites history just like `--amend`. Do not use it on commits you already shared with other people: use `git revert` for those.

## Recovering a commit with `git reflog`

The "Add task list" commit looks lost, but Git keeps a local record of every place `HEAD` has been:

```bash
git reflog
```

```text
42a3fa7 HEAD@{0}: reset: moving to HEAD~1
bdf42a1 HEAD@{1}: commit: Add task list
42a3fa7 HEAD@{2}: reset: moving to HEAD~1
952ade9 HEAD@{3}: commit: Add task list
42a3fa7 HEAD@{4}: reset: moving to HEAD~1
21b77ad HEAD@{5}: commit: Add task list
42a3fa7 HEAD@{6}: revert: Revert "Change greeting to Spanish"
2f55221 HEAD@{7}: commit: Change greeting to Spanish
9a6ac3b HEAD@{8}: commit (amend): Add farewell
f3e279c HEAD@{9}: commit (amend): Add farewell
77dde29 HEAD@{10}: commit: Add farewel
261c13d HEAD@{11}: commit (initial): Add initial greeting
```

Each line is a move, from newest to oldest. The commit you deleted with `--hard` is `bdf42a1`. Go back to it:

```bash
git reset --hard bdf42a1
ls
```

```text
HEAD is now at bdf42a1 Add task list
farewell.txt
greeting.txt
signature.txt
tasks.txt
```

Now you can say precisely what can and cannot be recovered:

- Anything that was in a commit can almost always be recovered with `git reflog`, even if you removed it from the history with `reset` or `--amend`. The reflog is local and Git cleans up old entries after a while (90 days by default).
- Anything that was never in a commit is lost with `git restore <file>` or `git reset --hard`. Commit often.

## Visiting an old commit: `git switch --detach`

Sometimes you want to see the project as it was in an earlier commit, without changing anything. `git switch --detach <hash>` moves `HEAD` to that commit:

```bash
git switch --detach 261c13d
ls
git status
```

```text
HEAD is now at 261c13d Add initial greeting
greeting.txt
HEAD detached at 261c13d
nothing to commit, working tree clean
```

Your working tree is now the one from the first commit: only `greeting.txt` exists. This is called **detached HEAD**: normally `HEAD` points to `main`, and `main` points to the latest commit. Now `HEAD` points straight at a commit, outside `main`.

You can look at files, build or run tests. Avoid committing here: those commits would not be on `main` and would be easy to lose track of. When you are done, go back:

```bash
git switch main
```

```text
Previous HEAD position was 261c13d Add initial greeting
Switched to branch 'main'
```

In the [Branches, merging and conflicts](/en/courses/git/conflictos) lesson you will see exactly what `main` is and how to work with other branches.

## Bringing back a file from the past: `git restore --source`

If you only need **one file** as it was in another commit, you do not have to move. First, extend the greeting:

```bash
echo "How are you?" >> greeting.txt
git add greeting.txt
git commit -m "Extend the greeting"
```

You decide you preferred the original greeting. `--source=<hash>` tells `restore` which commit to take the file from:

```bash
git restore --source=261c13d greeting.txt
cat greeting.txt
git status
```

```text
Hello world
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   greeting.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

The file changed only in your working tree. If you are happy with it, save it in a new commit:

```bash
git add greeting.txt
git commit -m "Restore the original greeting"
git log --oneline
```

```text
0ecf466 Restore the original greeting
4a1bc87 Extend the greeting
bdf42a1 Add task list
42a3fa7 Revert "Change greeting to Spanish"
2f55221 Change greeting to Spanish
9a6ac3b Add farewell
261c13d Add initial greeting
```

## Which command to use

| I want to undo... | Command | Does it rewrite history? |
| --- | --- | --- |
| Changes in a file I did not stage | `git restore <file>` | No, but the changes are lost |
| A file I staged by mistake | `git restore --staged <file>` | No |
| The message or a forgotten file in the last commit | `git commit --amend` | Yes |
| A commit I already shared | `git revert <hash>` | No |
| The last commit, keeping its changes staged | `git reset --soft HEAD~1` | Yes |
| The last commit, keeping its changes in the working tree | `git reset --mixed HEAD~1` | Yes |
| The last commit and all its changes | `git reset --hard HEAD~1` | Yes, and uncommitted changes are lost |
| A reset or an amend I should not have done | `git reflog`, then `git reset --hard <hash>` | Yes |
| Nothing: I just want to see an old commit | `git switch --detach <hash>`, then `git switch main` | No |
| One file, to make it like it was in another commit | `git restore --source=<hash> <file>` | No |

## Practice exercises

Use the `undo-practice` repository from this lesson or create a new one.

### Exercise 1: discard a change

Add the line `Test line` at the end of `farewell.txt`. Check what changed with `git diff`, then discard the change. Confirm that `git status` says there is nothing to commit.

<details>
<summary>Show solution</summary>

```bash
echo "Test line" >> farewell.txt
git diff
git restore farewell.txt
git status
```

`git status` should show `nothing to commit, working tree clean`. The change is gone for good because it was never in a commit.

</details>

### Exercise 2: fix the last commit

Create `contact.txt` with your email and commit it with the message `Add contat`. Then create `hours.txt`, which also belonged in that commit. End up with a single commit `Add contact` containing both files.

<details>
<summary>Show solution</summary>

```bash
echo "ana@example.com" > contact.txt
git add contact.txt
git commit -m "Add contat"
echo "Monday to Friday" > hours.txt
git add hours.txt
git commit --amend -m "Add contact"
git show --stat HEAD
```

`git show --stat HEAD` shows the `Add contact` commit with `contact.txt` and `hours.txt`. This is fine only because you have not shared that commit yet.

</details>

### Exercise 3: revert an old commit

Imagine you already shared the `Add farewell` commit with your team, and now `farewell.txt` and `signature.txt` must go. Undo it without rewriting history.

<details>
<summary>Show solution</summary>

```bash
git log --oneline
git revert <add-farewell-hash>
git log --oneline
ls
```

A new commit `Revert "Add farewell"` appears and both files are gone. The original commit stays in the history, so nobody loses anything.

</details>

### Exercise 4: rescue a deleted commit

Make any commit, delete it with `git reset --hard HEAD~1` and recover it.

<details>
<summary>Show solution</summary>

```bash
echo "Call Luis" >> tasks.txt
git add tasks.txt
git commit -m "Add pending task"
git reset --hard HEAD~1
git reflog
git reset --hard <add-pending-task-hash>
git log --oneline
```

In `git reflog` the commit shows up as `commit: Add pending task`. After going back with `git reset --hard <hash>`, `git log --oneline` shows it again at the tip of the history.

</details>

### Exercise 5: compare with the past

Without making any commit, look at what `greeting.txt` was like in the first commit. Then go back to `main`.

<details>
<summary>Show solution</summary>

```bash
git log --oneline
git switch --detach <first-commit-hash>
cat greeting.txt
git status
git switch main
```

`git status` shows `HEAD detached at <hash>` while you are on the old commit. `git switch main` takes you back to the latest commit. Another option, without moving, is `git show <hash>:greeting.txt`, which prints the file from that commit.

</details>
