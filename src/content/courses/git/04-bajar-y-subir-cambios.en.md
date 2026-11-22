---
title: 'Pulling and pushing changes'
course: 'git'
slug: 'bajar-y-subir-cambios'
description: 'Connect your repository to GitHub, authenticate with HTTPS or SSH, and synchronize your work with push, fetch, and pull while handling the most common errors.'
order: 4
lang: 'en'
published: true
---

# Pulling and pushing changes: remote repositories and GitHub

So far all your work has lived on your computer. In this lesson you connect your repository to a copy on GitHub, publish your commits, and bring in other people's commits without losing anything along the way.

In this lesson you will learn:

1. What a remote repository is and what `origin` and `origin/main` mean.
2. How to authenticate with GitHub using HTTPS or SSH.
3. How to publish your repository with `git push -u origin main` and copy an existing one with `git clone`.
4. How to see what changed on the remote with `git fetch` and bring it in with `git pull`.
5. How to get out of the most common errors: rejected push, divergent branches, and local changes that would be overwritten.

To focus on synchronization, you work directly on `main` throughout this lesson. In a real team you usually work on branches and propose changes through Pull Requests: that workflow comes in lesson 5, [Branches and Pull Requests](/en/courses/git/ramas-y-pull-requests).

## Local and remote

A **remote repository** is another copy of the same repository, stored somewhere else: usually a server such as GitHub. Your local copy and the remote one each have their own history, and Git does not synchronize them on its own: you decide when to send and when to bring in commits.

- `origin` is the short name (alias) Git uses by convention for the main remote. Instead of typing the full URL, you type `origin`.
- `main` is your local branch.
- `origin/main` is a **remote-tracking branch**: the snapshot your repository keeps of where `main` was on `origin` the last time you talked to it. It is only updated when you run `git fetch`, `git pull`, or `git push`.

<figure class="diagram">
<svg viewBox="0 0 720 270" role="img" aria-labelledby="d-git-sync-l4-en-t">
<title id="d-git-sync-l4-en-t">Synchronization between the local repository and the origin remote</title>
<defs>
  <marker id="ar-push-l4-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-fetch-l4-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-pull-l4-en" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<!-- Local repository -->
<rect x="20" y="25" width="280" height="220" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="160" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Local repository (your PC)</text>
<rect x="40" y="75" width="240" height="42" rx="10" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="55" y="101" font-size="12" font-family="monospace" fill="var(--color-text)">Working tree and staging</text>
<rect x="40" y="130" width="240" height="42" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="55" y="156" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">Local branch: main</text>
<rect x="40" y="185" width="240" height="42" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="55" y="211" font-size="12" font-family="monospace" fill="var(--color-neutral-700)">Tracking: origin/main</text>

<!-- Remote repository -->
<rect x="420" y="25" width="280" height="220" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="560" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Remote origin (GitHub)</text>
<rect x="440" y="100" width="240" height="85" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="560" y="135" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">main</text>
<text x="560" y="160" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Shared history</text>

<!-- Push: local main -> remote main -->
<path d="M 280 138 L 414 138" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-push-l4-en)"/>
<text x="360" y="129" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git push</text>

<!-- Pull: remote -> local main (fetch + merge) -->
<path d="M 420 164 L 286 164" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-pull-l4-en)"/>
<text x="360" y="181" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git pull</text>

<!-- Fetch: remote -> origin/main only -->
<path d="M 420 214 L 286 214" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ar-fetch-l4-en)"/>
<text x="360" y="206" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git fetch</text>
</svg>
<figcaption><code>git push</code> sends the commits of your <code>main</code> to the remote. <code>git fetch</code> only updates <code>origin/main</code>, without touching your files. <code>git pull</code> does a fetch and also integrates <code>origin/main</code> into your <code>main</code>.</figcaption>
</figure>

## Authenticating with GitHub

To push commits to GitHub, the server needs to know who you are. There are two ways to connect, and each one uses a different URL for the same repository:

- HTTPS: `https://github.com/ana/my-project.git`
- SSH: `git@github.com:ana/my-project.git`

### HTTPS with a personal access token

GitHub **does not accept your account password** for Git operations. When Git asks for a password, you must paste a **personal access token**:

1. On GitHub, go to Settings → Developer settings → Personal access tokens.
2. Generate a token with write access to the contents of your repositories and copy it (GitHub shows it only once).
3. The first time you run `git push`, type your username and paste the token as the password.

Your system's credential manager (the keychain on macOS, Git Credential Manager on Windows) stores the token so you do not have to repeat it.

### HTTPS with GitHub CLI

The simplest way with HTTPS is GitHub's official tool, `gh` (GitHub CLI). After installing it, run:

```bash
# Log in to GitHub and configure Git to use those credentials
gh auth login
```

The wizard asks which account to log in to, whether you prefer HTTPS or SSH, and opens the browser to authorize you. When it finishes, `gh` stores the credentials and Git uses them on every `push` and `pull`.

### SSH with a key

With SSH you identify yourself with a key pair: a private key, which never leaves your computer, and a public key, which you give to GitHub.

1. Generate the key:

```bash
# Create an ed25519 key pair with your email as a comment
ssh-keygen -t ed25519 -C "ana@example.com"
```

Press Enter to save it in the default location (`~/.ssh/id_ed25519`) and choose a passphrase to protect it.

2. Print the **public** key and copy all of it. It is a single line that starts with `ssh-ed25519` and ends with your email:

```bash
cat ~/.ssh/id_ed25519.pub
```

3. On GitHub, go to Settings → SSH and GPG keys → New SSH key, paste the key, and save it.
4. Test the connection:

```bash
ssh -T git@github.com
```

The first time, SSH asks you to confirm the server's fingerprint: compare it with the fingerprints GitHub publishes in its documentation and answer `yes`. If everything is fine, GitHub replies with a greeting like `Hi ana! You've successfully authenticated, but GitHub does not provide shell access.`

From now on, use the SSH URL (`git@github.com:user/repository.git`) for your repositories. The examples in this lesson use SSH.

## Connecting your repository to GitHub

Ana has a local repository with one commit:

```text
[main (root-commit) 66bc8a9] Add README
 1 file changed, 7 insertions(+)
 create mode 100644 README.md
```

### Creating the empty repository on GitHub

On GitHub, use the **+** button → New repository, give it a name (`my-project`), and create it **empty**: no README, no `.gitignore`, and no license. If GitHub creates a first commit, the remote will have work you do not have and your first push will be rejected.

### Registering the remote

```bash
# Register the remote under the alias origin
git remote add origin git@github.com:ana/my-project.git

# List the configured remotes
git remote -v
```

```text
origin	git@github.com:ana/my-project.git (fetch)
origin	git@github.com:ana/my-project.git (push)
```

### The first push

```bash
# Push main to origin and set up tracking
git push -u origin main
```

Git prints a few progress lines and ends with:

```text
To github.com:ana/my-project.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

- `origin` is the remote you push to.
- `main` is the branch you push.
- `-u` (`--set-upstream`) saves the link between your `main` and `origin/main`. That is why the last line says `main` now tracks `origin/main`.

Thanks to `-u`, from now on `git push` and `git pull` are enough, without repeating the remote or the branch. Also, `git status` compares your branch with `origin/main`:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

## Cloning a repository

Bob, Ana's teammate, wants his own copy. He needs neither `git init` nor `git remote add`: `git clone` downloads the whole repository with all its history.

```bash
# Copy the repository into the bob folder
git clone git@github.com:ana/my-project.git bob
```

```text
Cloning into 'bob'...
```

If you do not give a folder, Git uses the repository name (`my-project`). The clone already has the `origin` remote configured and its `main` already tracks `origin/main`, so Bob can use `git push` and `git pull` right away.

## Seeing what is new with `git fetch`

Bob adds a file and pushes it:

```text
[main dc45f56] Add task list
 1 file changed, 1 insertion(+)
 create mode 100644 tasks.txt
```

```text
To github.com:ana/my-project.git
   66bc8a9..dc45f56  main -> main
```

On Ana's computer, `git status` still says everything is up to date:

```text
On branch main
Your branch is up to date with 'origin/main'.
```

It is not a bug: `git status` compares with `origin/main`, and `origin/main` is the snapshot from the last time Ana talked to GitHub. To refresh that snapshot without touching her files, Ana uses `git fetch`:

```bash
# Download the new commits and update origin/main
git fetch
```

```text
From github.com:ana/my-project
   66bc8a9..dc45f56  main       -> origin/main
```

Now `git status` tells the truth:

```text
On branch main
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
```

To see exactly which commits arrived, use `git log main..origin/main`: it lists the commits that are in `origin/main` and not yet in `main`. With `--oneline` the result is shorter:

```bash
git log --oneline main..origin/main
```

```text
dc45f56 Add task list
```

`git fetch` never changes your branch or your files: it is the safe way to look before integrating.

## Bringing in and integrating with `git pull`

`git pull` does two things in a row:

1. `git fetch`: downloads the new commits and updates `origin/main`.
2. Integrates `origin/main` into your current branch with a merge, like the one you saw in lesson 3.

```bash
git pull
```

```text
Updating 66bc8a9..dc45f56
Fast-forward
 tasks.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 tasks.txt
```

Since Ana had no commits of her own, the merge is a **fast-forward**: Git just moves `main` forward to `origin/main`.

The opposite case is when you have commits the remote does not have. Ana adds a task and commits:

```text
[main 426e552] Add SSH task
 1 file changed, 1 insertion(+)
```

`git status` tells her she is ahead:

```text
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)
```

And `git push` publishes it:

```text
To github.com:ana/my-project.git
   dc45f56..426e552  main -> main
```

## When the push is rejected

Meanwhile, Bob changed the README title and committed without first bringing in Ana's work:

```text
[main 810de32] Change the README title
 1 file changed, 1 insertion(+), 1 deletion(-)
```

When he runs `git push`, GitHub rejects it:

```text
To github.com:ana/my-project.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:ana/my-project.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

A push can only **move the remote branch forward** (a fast-forward). GitHub's `main` has Ana's commit, which Bob does not have; if GitHub accepted the push, that commit would disappear from the branch. So it rejects it and nothing is lost.

If Bob had already run `git fetch`, the reason would say `(non-fast-forward)` instead of `(fetch first)`. It is the same situation with the same fix:

1. `git pull` to integrate the remote's work.
2. `git push` to publish the result.

Do not try to force the push to "win": you would delete your teammate's work on the remote.

## Divergent branches

Bob runs `git pull`, but Git stops:

```text
From github.com:ana/my-project
   dc45f56..426e552  main       -> origin/main
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```

The fetch did happen (the first line shows it), but the integration did not. `git status` explains why:

```text
On branch main
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.
  (use "git pull" if you want to integrate the remote branch with yours)
```

`main` and `origin/main` have **diverged**: each one has a commit the other does not, so a fast-forward is no longer enough. Git needs to know how you want to join them and does not choose for you. Configure it once for all your repositories:

```bash
# Integrate with a merge when branches diverge
git config --global pull.rebase false
```

- `pull.rebase false` joins both histories with a **merge commit**, exactly as in lesson 3. It is the option this course uses.
- `git pull --ff-only` (or `git config --global pull.ff only`) is the strict option: it only accepts fast-forwards and, if the branches diverge, it stops without changing anything so you can decide.
- The third option, rebase, is explained in lesson 6, [Rebase and best practices in Git](/en/courses/git/rebase-y-buenas-practicas).

With the configuration in place, Bob runs the pull again. Git opens the editor with the merge commit message already written (`Merge branch 'main' of github.com:ana/my-project`); save and close it, just like in lesson 3:

```text
Merge made by the 'ort' strategy.
 tasks.txt | 1 +
 1 file changed, 1 insertion(+)
```

```bash
git log --oneline --graph
```

```text
*   e9d7ba4 Merge branch 'main' of github.com:ana/my-project
|\  
| * 426e552 Add SSH task
* | 810de32 Change the README title
|/  
* dc45f56 Add task list
* 66bc8a9 Add README
```

Now Bob's `main` contains everything on the remote, so his push is a fast-forward and it is accepted:

```text
To github.com:ana/my-project.git
   426e552..e9d7ba4  main -> main
```

## Local changes the pull would overwrite

Ana is editing the README (she added a line at the end) and has not committed yet. She runs `git pull` to bring in Bob's merge:

```text
From github.com:ana/my-project
   426e552..e9d7ba4  main       -> origin/main
Updating 426e552..e9d7ba4
error: Your local changes to the following files would be overwritten by merge:
	README.md
Please commit your changes or stash them before you merge.
Aborting
```

The cause: Ana has uncommitted changes in a **file** the pull needs to modify (`README.md`, whose title Bob changed). It does not matter whether the lines are the same or not: it is enough for the file to be modified in your working tree. Uncommitted changes in other files do not block the pull.

Git aborts (`Aborting`) before touching anything, so Ana's work is still intact. She has two ways out:

- Commit her change and run `git pull` again, if the change is ready.
- Set it aside temporarily with `git stash`, if it is still half done.

### Setting changes aside with `git stash`

`git stash` saves your uncommitted changes (from the working tree and the staging area) on a separate stack and leaves the working tree clean, just like the last commit.

```bash
# Save the uncommitted changes and clean the working tree
git stash
```

```text
Saved working directory and index state WIP on main: 426e552 Add SSH task
```

```bash
# List what is saved on the stack
git stash list
```

```text
stash@{0}: WIP on main: 426e552 Add SSH task
```

With a clean working tree, the pull works:

```text
Updating 426e552..e9d7ba4
Fast-forward
 README.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Finally, Ana gets her change back:

```bash
# Apply the latest stash and remove it from the stack
git stash pop
```

```text
Auto-merging README.md
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (aa17aefa17a9863a625311953dd3459478295b94)
```

The README now has Bob's new title and the line Ana was writing. Keep in mind:

- If your change and the incoming one touch the same lines, `git stash pop` produces a conflict. You resolve it as in lesson 3, and Git keeps the entry on the stack (`The stash entry is kept in case you need it again.`) until you discard it.
- By default, `git stash` does not save new files Git does not track yet (*untracked*). To include them, use `git stash -u`.

## Conflicts when pulling

If you and someone else changed the same lines, the merge that `git pull` makes stops with a conflict:

```text
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

It is the same merge conflict you already know how to resolve: follow the procedure from [lesson 3](/en/courses/git/conflictos) (edit the file, `git add`, `git commit`, or cancel with `git merge --abort`). When you are done, publish the result with `git push`.

## The daily cycle

```bash
# 1. When you start: bring in what others pushed
git pull

# 2. Work and save your progress
git add README.md
git commit -m "Describe how to install the project"

# 3. Before publishing: integrate whatever arrived in the meantime
git pull

# 4. Publish your commits
git push
```

## Command summary

| Action | Command |
|---|---|
| Register the remote | `git remote add origin <url>` |
| List the remotes | `git remote -v` |
| First push with tracking | `git push -u origin main` |
| Copy a repository | `git clone <url>` |
| Download without integrating | `git fetch` |
| See which commits arrived | `git log main..origin/main` |
| Download and integrate | `git pull` |
| Integrate with a merge on divergence | `git config --global pull.rebase false` |
| Push commits | `git push` |
| Set changes aside | `git stash` |
| See what is set aside | `git stash list` |
| Get it back | `git stash pop` |

## Practice exercises

You do not need GitHub or another person to practice. A **bare repository** (`git init --bare`) is a repository without a working tree that only stores the history: it works as a remote, just like GitHub. Two clones in different folders play Ana and Bob. The remote URL is simply the path to the folder.

### Exercise 1: set up the lab

Create a `practice` folder with a bare repository `remote.git`. Next to it, create the `ana` repository with a five-line `README.md` (`Line 1` to `Line 5`), commit, connect it to the remote, and publish it with tracking. Then clone the remote into the `bob` folder and check that it has Ana's commit.

<details>
<summary>Show solution</summary>

```bash
mkdir practice
cd practice
git init --bare remote.git

mkdir ana
cd ana
git init
# Create README.md with the lines "Line 1" to "Line 5"
git add README.md
git commit -m "Add README"
git remote add origin ../remote.git
git remote -v
git push -u origin main

cd ..
git clone remote.git bob
cd bob
git log --oneline
```

`git remote -v` shows `../remote.git` for fetch and push, and Bob's `git log --oneline` shows the `Add README` commit.

</details>

### Exercise 2: look before integrating

From `bob`, create `tasks.txt`, commit it, and push it. From `ana`, check what `git status` says before and after `git fetch`, list the commits that arrived, and then integrate them.

<details>
<summary>Show solution</summary>

```bash
# In bob
git add tasks.txt
git commit -m "Add task list"
git push

# In ana
git status
git fetch
git status
git log --oneline main..origin/main
git pull
```

Before the fetch, `git status` says `Your branch is up to date with 'origin/main'.` because `origin/main` is out of date. Afterwards it says `Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.`, the log shows `Add task list`, and the pull is a `Fast-forward`.

</details>

### Exercise 3: rejected push and divergent branches

Ana creates `authors.txt` and Bob creates `LICENSE.txt`, each with their own commit. Ana pushes first. Then Bob tries to push. Make Bob integrate Ana's work with a merge and publish the result. Finally, update Ana.

<details>
<summary>Show solution</summary>

```bash
# In ana
git add authors.txt
git commit -m "Add authors"
git push

# In bob
git add LICENSE.txt
git commit -m "Add license"
git push
# ! [rejected]        main -> main (fetch first)

# Only if you have not configured it yet
git config --global pull.rebase false

git pull
# The editor opens with the merge commit message: save and close it
git log --oneline --graph
git push

# In ana
git pull
```

Bob's push is rejected because the remote has Ana's commit. The pull creates a merge commit (`Merge made by the 'ort' strategy.`) and the graph shows both lines joined. The second push is accepted, and Ana's pull is a fast-forward.

</details>

### Exercise 4: set changes aside with stash

Bob changes `Line 1` to `Line one` in the README, commits, and pushes. Ana, without committing, changes `Line 5` to `Line five` and runs `git pull`. Solve the situation without losing Ana's change and publish her change.

<details>
<summary>Show solution</summary>

```bash
# In ana, with README.md modified and not committed
git pull
# error: Your local changes to the following files would be overwritten by merge:
#	README.md

git stash
git stash list
git pull
git stash pop
git add README.md
git commit -m "Change line 5"
git push
```

The pull fails because Ana has uncommitted changes in `README.md`, a file the pull modifies. After `git stash pop`, the README has `Line one` and `Line five`: the changes are on different lines, so there is no conflict.

</details>

### Exercise 5: conflict when pulling

Bob pulls the latest changes and changes `Line 3` to `Line three (Bob)`; Ana changes it to `Line three (Ana)`. Both commit. Ana pushes first. Make Bob bring in the change, resolve the conflict keeping `Line three`, and publish the result.

<details>
<summary>Show solution</summary>

```bash
# In bob
git pull
# CONFLICT (content): Merge conflict in README.md

# Edit README.md: remove the markers and keep "Line three"
git add README.md
git commit
git push
```

The conflict is resolved just like in lesson 3. `git commit` without `-m` opens the editor with the merge message already written. After the push, the remote has the merge commit with the resolved line.

</details>
