---
title: 'Pulling and Pushing Changes'
course: 'git'
slug: 'bajar-y-subir-cambios'
order: 2
lang: 'en'
published: true
---

# 🔁 Key Idea Before Starting

Before diving into commands, understand this: **Git is distributed**.

That means each person has a **complete copy of the project** on their machine.

👉 You don't need a server to work with Git.  
👉 You can work offline.  
👉 You only connect when you want to share.

---

# 🌐 What Does "Remote" Mean?

**Remote** is the online version of your repository.

📦 It's like a shared folder on the internet where everyone can push and pull changes.

The most common platform is GitHub, but there are others:
- GitLab
- Bitbucket
- Your own server

---

# 🔗 Connecting Your Local Repo to a Remote

```
git remote add origin URL
```

- `origin` is the conventional name for the remote
- `URL` is the address of your repository on GitHub

Check your remotes:
```
git remote -v
```

---

# ☁️ Pushing Changes to GitHub

Once your code is ready:
```
git push origin main
```

- `push` = upload
- `origin` = the remote
- `main` = the branch

The first time, it's a bit more explicit:
```
git push -u origin main
```

- `-u` (or `--set-upstream`) links your local branch with the remote one.

After that, you only need:
```
git push
```

---

# 📥 Pulling Changes from GitHub

If someone else pushed changes:
```
git pull origin main
```

Or if it's already connected:
```
git pull
```

`pull` = download + merge

---

# 🔄 The Complete Flow

```
# You
git add .
git commit -m "message"
git push

# Your team
git pull
(make changes)
git add .
git commit -m "message"
git push

# You again
git pull
(you now have their changes)
```

---

# 🧪 Practice Exercise

1. Create a GitHub repository
2. Connect it locally
3. Create a file, commit, push
4. Verify it appears on GitHub
5. Modify from GitHub web interface
6. Pull the changes locally

---

# 📌 Summary

- `remote` = online repository
- `push` = upload your commits
- `pull` = download others' commits
- You always work locally first, then share
