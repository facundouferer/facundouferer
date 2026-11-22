---
title: 'Branches, merging and conflicts'
course: 'git'
slug: 'conflictos'
description: 'Create branches to work in parallel, integrate them with git merge (fast-forward and merge commit) and resolve conflicts step by step, all in your local repository.'
order: 3
lang: 'en'
published: true
---

# Branches, merging and conflicts

A branch lets you try an idea without touching the stable version of the project. When the idea works, you integrate it with `git merge`. If both branches changed the same lines, Git asks you to decide: that is a conflict.

In this lesson you will learn:

1. What a branch is and what `HEAD` is.
2. How to create, list, switch and delete branches with `git branch` and `git switch`.
3. How to view history as a graph with `git log --oneline --graph --all`.
4. The difference between a fast-forward merge and a merge commit.
5. How to read conflict markers, resolve a conflict or cancel the merge.

Everything happens on your computer: no server is needed.

## What a branch is

A branch is a **movable pointer to a commit**. It is not a copy of the files: it is just a name (for example `main`) that points to the latest commit of a line of work. Every time you commit on that branch, the pointer moves forward to the new commit.

`HEAD` tells you where you are. It normally points to a branch (`HEAD -> main`), which is why your new commits move that branch forward.

In the [Undoing changes](/en/courses/git/deshacer-cambios) lesson you used `git switch --detach <hash>`: there `HEAD` pointed directly at a commit, with no branch. That is *detached HEAD*. With branches, `HEAD` points to a name again, one that moves with you.

## Setting up the practice repository

Every example in this lesson continues from the previous one in the same repository. Create it in an empty folder:

```bash
mkdir project
cd project
git init
```

Create `greeting.txt` with this content:

```text
Hello world
```

```bash
git add greeting.txt
git commit -m "Add initial greeting"
```

```text
[main (root-commit) 84e98ce] Add initial greeting
 1 file changed, 1 insertion(+)
 create mode 100644 greeting.txt
```

The hashes in your terminal will be different: every commit has its own.

## Listing, creating and switching branches

### Listing branches

```bash
git branch
```

```text
* main
```

The asterisk marks the current branch, the one `HEAD` points to.

### Creating a branch and switching to it

```bash
git switch -c farewell
```

```text
Switched to a new branch 'farewell'
```

`git switch -c <name>` creates the branch at the current commit and switches to it. Now `git branch` shows:

```text
* farewell
  main
```

If the branch already exists, you switch to it without `-c`:

```bash
git switch main
```

When you switch branches, Git replaces the files in your folder with those of the commit the new branch points to. Commit your changes before switching: if you have uncommitted changes that clash with the other branch, Git refuses to switch so you do not lose them.

## Viewing history as a graph

`git log --oneline` only shows the current branch. To see every branch and how they split and join:

```bash
git log --oneline --graph --all
```

- `--graph` draws the lines of each branch on the left.
- `--all` includes every branch, not just the current one.
- The parentheses show which commit each branch and `HEAD` point to.

You will use it after every step in this lesson.

## Fast-forward merge

Stay on the `farewell` branch (go back with `git switch farewell` if you switched to `main`). Create `farewell.txt`:

```text
See you later
```

```bash
git add farewell.txt
git commit -m "Add farewell"
git switch main
```

On `main` the file `farewell.txt` does not exist: that branch still points to the previous commit. The graph shows it:

```bash
git log --oneline --graph --all
```

```text
* 1c21b09 (farewell) Add farewell
* 84e98ce (HEAD -> main) Add initial greeting
```

`main` has not moved since you created `farewell`. To integrate, you stand on the branch that **receives** the changes and merge the other one:

```bash
git merge farewell
```

```text
Updating 84e98ce..1c21b09
Fast-forward
 farewell.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 farewell.txt
```

Since `main` had no commits of its own, Git does not need to combine anything: it just moves the `main` pointer forward to the commit of `farewell`. That is a **fast-forward**, and it creates no new commit.

```text
* 1c21b09 (HEAD -> main, farewell) Add farewell
* 84e98ce Add initial greeting
```

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-git-ff-l3-t">
<title id="d-git-ff-l3-t">Fast-forward merge: main moves forward to the commit of the farewell branch</title>
<defs>
  <marker id="ar-ff-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-ptr-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-700)"/>
  </marker>
</defs>

<!-- Before -->
<text x="40" y="40" font-size="13" font-weight="700" fill="var(--color-neutral-700)">Before git merge</text>
<path d="M 200 80 L 360 80" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="7 4"/>
<circle cx="200" cy="80" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="200" y="85" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="360" cy="80" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="360" y="85" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">B</text>
<path d="M 200 128 L 200 102" fill="none" stroke="var(--color-neutral-700)" stroke-width="1.5" marker-end="url(#ar-ptr-l3)"/>
<text x="200" y="145" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">HEAD -&gt; main</text>
<path d="M 360 128 L 360 102" fill="none" stroke="var(--color-neutral-700)" stroke-width="1.5" marker-end="url(#ar-ptr-l3)"/>
<text x="360" y="145" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">farewell</text>

<!-- After -->
<text x="40" y="190" font-size="13" font-weight="700" fill="var(--color-neutral-700)">After git merge farewell</text>
<path d="M 200 230 L 360 230" fill="none" stroke="var(--color-accent)" stroke-width="3"/>
<circle cx="200" cy="230" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="200" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="360" cy="230" r="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="360" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<path d="M 210 200 C 250 180, 310 180, 348 204" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ff-l3)"/>
<text x="280" y="176" font-size="11" text-anchor="middle" fill="var(--color-accent-700)">main moves forward</text>
<text x="390" y="226" font-size="13" font-weight="700" font-family="monospace" fill="var(--color-accent-700)">HEAD -&gt; main, farewell</text>
<text x="390" y="246" font-size="11" fill="var(--color-neutral-700)">No new commit: only the pointer moves</text>
</svg>
<figcaption>Fast-forward: A is “Add initial greeting” and B is “Add farewell”. Since <code>main</code> did not move, <code>git merge farewell</code> only moves the <code>main</code> pointer from A to B.</figcaption>
</figure>

## Merge with a merge commit

Now make both branches move forward, each in a different file. Create the `author` branch and add `author.txt`:

```bash
git switch -c author
```

```text
Author: Ana
```

```bash
git add author.txt
git commit -m "Add author"
git switch main
```

On `main`, change `farewell.txt` so it reads:

```text
See you later, see you soon
```

```bash
git add farewell.txt
git commit -m "Improve the farewell"
git log --oneline --graph --all
```

```text
* c236346 (author) Add author
| * e4fe6bd (HEAD -> main) Improve the farewell
|/
* 1c21b09 Add farewell
* 84e98ce Add initial greeting
```

The branches have diverged: each one has a commit the other does not. Moving a pointer is no longer enough. Merge:

```bash
git merge author
```

Git opens your editor with the message `Merge branch 'author'`. Accept it: save and close the editor. Git replies:

```text
Merge made by the 'ort' strategy.
 author.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 author.txt
```

Git compares both tips with their common ancestor (`1c21b09`), combines the changes and creates a **merge commit**: a commit with two parents. That is why it is called a three-way merge.

```text
*   a73905e (HEAD -> main) Merge branch 'author'
|\
| * c236346 (author) Add author
* | e4fe6bd Improve the farewell
|/
* 1c21b09 Add farewell
* 84e98ce Add initial greeting
```

<figure class="diagram">
<svg viewBox="0 0 720 230" role="img" aria-labelledby="d-git-merge-l3-t">
<title id="d-git-merge-l3-t">Three-way merge: main and author diverge from B and join in merge commit M</title>
<defs>
  <marker id="ar-main-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-branch-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Branch main line -->
<path d="M 90 70 L 600 70" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-main-l3)"/>
<text x="60" y="75" font-size="13" font-weight="700" font-family="monospace" text-anchor="end" fill="var(--color-accent-700)">main</text>

<!-- Branch author curve -->
<path d="M 180 70 C 220 70, 230 150, 270 150 L 450 150 C 490 150, 500 70, 520 72" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="7 4" marker-end="url(#ar-branch-l3)"/>
<text x="210" y="175" font-size="13" font-weight="700" font-family="monospace" fill="var(--color-accent-2-800)">author</text>

<!-- Commits on main -->
<circle cx="90" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="90" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="180" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<text x="180" y="40" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Common ancestor</text>

<circle cx="360" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="360" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="360" y="40" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Changes farewell.txt</text>

<!-- Commit on author -->
<circle cx="360" cy="150" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="360" y="155" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>
<text x="360" y="190" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Creates author.txt</text>

<!-- Merge commit M -->
<circle cx="540" cy="70" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="3.5"/>
<text x="540" y="76" font-size="13" font-weight="800" text-anchor="middle" fill="var(--color-accent-700)">M</text>
<text x="540" y="40" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Merge commit (two parents)</text>
</svg>
<figcaption>Merge commit: A “Add initial greeting”, B “Add farewell”, C “Improve the farewell” on <code>main</code> and D “Add author” on <code>author</code>. Both branches moved forward in different files, so <code>git merge author</code> creates M with no conflicts.</figcaption>
</figure>

## Deleting a merged branch

Once a branch is integrated, its name is no longer needed: the commits stay in `main`.

```bash
git branch -d farewell
git branch -d author
```

```text
Deleted branch farewell (was 1c21b09).
Deleted branch author (was c236346).
```

`git branch -d` refuses to delete a branch that has unmerged commits:

```text
error: the branch 'test' is not fully merged
```

Git suggests `git branch -D` to force it. Use it only if you really want to discard those commits.

## Conflicts

### When a conflict happens

Git only combines changes that do not overlap: different files, or different parts of the same file. There is a **conflict** when both branches changed the same lines differently since the common ancestor. Git does not guess which version is right: it stops the merge and asks you.

### Causing a conflict

Stay in the same repository, on `main`. Right now `greeting.txt` reads `Hello world`. Create a new branch and change that line:

```bash
git switch -c formal-greeting
```

Edit `greeting.txt` so it reads:

```text
Good morning, world
```

```bash
git add greeting.txt
git commit -m "Use a formal greeting"
git switch main
```

On `main`, `greeting.txt` reads `Hello world` again. Change the same line in a different way:

```text
Hello, whole world
```

```bash
git add greeting.txt
git commit -m "Expand the greeting"
git merge formal-greeting
```

```text
Auto-merging greeting.txt
CONFLICT (content): Merge conflict in greeting.txt
Automatic merge failed; fix conflicts and then commit the result.
```

The merge is halfway done. `git status` tells you which files are waiting for a decision:

```text
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   greeting.txt
```

### Reading the markers

Open `greeting.txt`:

```text
<<<<<<< HEAD
Hello, whole world
=======
Good morning, world
>>>>>>> formal-greeting
```

- `<<<<<<< HEAD` opens the version of your current branch (`main`).
- `=======` separates the two versions.
- `>>>>>>> formal-greeting` closes the version of the branch you are merging.

<figure class="diagram">
<svg viewBox="0 0 720 180" role="img" aria-labelledby="d-git-conflict-l3-t">
<title id="d-git-conflict-l3-t">Conflict markers in greeting.txt: the main version, the separator and the formal-greeting version</title>
<rect x="40" y="25" width="640" height="130" rx="16" fill="var(--color-surface)" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="64" y="58" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</text>
<text x="64" y="80" font-size="13" font-family="monospace" fill="var(--color-accent-700)">Hello, whole world</text>
<text x="64" y="102" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-neutral-700)">=======</text>
<text x="64" y="124" font-size="13" font-family="monospace" fill="var(--color-accent-2-800)">Good morning, world</text>
<text x="64" y="146" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">&gt;&gt;&gt;&gt;&gt;&gt;&gt; formal-greeting</text>
<text x="420" y="69" font-size="12" fill="var(--color-accent-700)">Your current branch (main)</text>
<text x="420" y="102" font-size="12" fill="var(--color-neutral-700)">Separator</text>
<text x="420" y="135" font-size="12" fill="var(--color-accent-2-800)">The branch you are merging</text>
</svg>
<figcaption>Both branches changed the same line of <code>greeting.txt</code> since the common ancestor, so Git writes both versions between markers and waits for your decision.</figcaption>
</figure>

### Cancelling the merge: `git merge --abort`

If you do not want to resolve it now, go back to the state before `git merge`:

```bash
git merge --abort
git status
```

```text
On branch main
nothing to commit, working tree clean
```

`greeting.txt` reads `Hello, whole world` again. To continue the example, try the merge again:

```bash
git merge formal-greeting
```

You get the same `CONFLICT (content)` as before.

### Resolving the conflict

1. Decide the final content. It can be one version, the other or a combination.
2. Delete the three marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Save the file.

In this example we combine both ideas. `greeting.txt` ends up like this:

```text
Good morning, whole world
```

Mark the file as resolved with `git add`:

```bash
git add greeting.txt
git status
```

```text
On branch main
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)
```

### Finishing the merge

```bash
git commit
```

Git opens the editor with the message `Merge branch 'formal-greeting'`. Accept it: save and close.

```text
[main 5f1ebe6] Merge branch 'formal-greeting'
```

At this point `git merge --continue` does the same as `git commit`: it also opens the editor with the default message. Use whichever you prefer.

```bash
git log --oneline --graph --all
git branch -d formal-greeting
```

```text
*   5f1ebe6 (HEAD -> main) Merge branch 'formal-greeting'
|\
| * c93e3d6 (formal-greeting) Use a formal greeting
* | 1007196 Expand the greeting
|/
*   a73905e Merge branch 'author'
...
```

## What Git can and cannot recover

- **Anything already in a commit can almost always be recovered.** Even if you delete a branch or get a merge wrong, the commits still exist for a while and `git reflog` shows their hashes (you saw it in [Undoing changes](/en/courses/git/deshacer-cambios)).
- **Anything you never committed cannot be recovered.** `git restore` and `git reset --hard` discard uncommitted changes, and Git keeps no copy of them.

So: commit before switching branches or merging.

## Tips

- Create one branch per idea or task, with a name that describes it.
- Make small commits: conflicts are shorter and easier to read.
- Merge often: the more two branches diverge, the more conflicts they pile up.
- Read the whole conflict before editing, and check the result with `git diff --staged` before committing.
- Common mistakes: committing with markers still in the file, or deleting the whole file instead of the conflicting lines.

## Summary

| I want to... | Command |
| --- | --- |
| See the branches | `git branch` |
| Create a branch and switch to it | `git switch -c <branch>` |
| Switch to an existing branch | `git switch <branch>` |
| See every branch as a graph | `git log --oneline --graph --all` |
| Integrate another branch into the current one | `git merge <branch>` |
| Mark a conflict as resolved | `git add <file>` |
| Finish the merge | `git commit` or `git merge --continue` |
| Cancel a merge with conflicts | `git merge --abort` |
| Delete an already merged branch | `git branch -d <branch>` |

## Practice exercises

### Exercise 1: a fast-forward merge

In a new repository with one commit on `main`, create the `contact` branch, add `contact.txt` in a commit and merge it into `main`. Check that Git replies `Fast-forward` and delete the branch.

<details>
<summary>Show solution</summary>

```bash
git switch -c contact
# Create contact.txt with any text
git add contact.txt
git commit -m "Add contact"
git switch main
git merge contact
git log --oneline --graph --all
git branch -d contact
```

`git merge` shows `Fast-forward` because `main` had no new commits: only the pointer moved.

</details>

### Exercise 2: a merge commit without conflicts

Create the `colors` branch and add `colors.txt` in a commit. Go back to `main` and, before merging, make a commit that changes another file. Merge `colors` and look at the graph.

<details>
<summary>Show solution</summary>

```bash
git switch -c colors
# Create colors.txt
git add colors.txt
git commit -m "Add colors"
git switch main
# Change greeting.txt
git add greeting.txt
git commit -m "Update the greeting"
git merge colors
# Accept the "Merge branch 'colors'" message in the editor
git log --oneline --graph --all
```

Git replies `Merge made by the 'ort' strategy.` and the graph shows a commit with two lines reaching it: the merge commit.

</details>

### Exercise 3: cancelling and resolving a conflict

Create the `title` branch and change the first line of `greeting.txt`. On `main`, change that same line in a different way. Merge, cancel with `git merge --abort`, merge again and this time resolve the conflict, finishing with `git merge --continue`.

<details>
<summary>Show solution</summary>

```bash
git switch -c title
# Change the first line of greeting.txt
git add greeting.txt
git commit -m "Change the greeting on title"
git switch main
# Change the same line with different text
git add greeting.txt
git commit -m "Change the greeting on main"
git merge title
# CONFLICT (content): Merge conflict in greeting.txt
git merge --abort
git status
# nothing to commit, working tree clean
git merge title
# Keep the final content and delete the markers
git add greeting.txt
git merge --continue
git branch -d title
```

</details>

### Exercise 4: an unmerged branch

Create the `draft` branch, make a commit on it, go back to `main` and try to delete it with `git branch -d`. What does Git reply and why? How would you delete it without losing that commit?

<details>
<summary>Show solution</summary>

Git replies `error: the branch 'draft' is not fully merged`, because the commit on `draft` is not in `main`: if you delete the branch, no name points to that commit. To keep it, merge first and then delete:

```bash
git merge draft
git branch -d draft
```

If you really want to discard the work, `git branch -D draft` deletes it anyway.

</details>
