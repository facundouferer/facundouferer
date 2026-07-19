---
title: 'Merging Branches and Conflicts'
course: 'git'
slug: 'conflictos'
order: 3
lang: 'en'
published: true
---

# 🌿 MERGING BRANCHES — EXPLAINED SLOWLY

## What is a Merge?

**Merge** means combining two branches into one.

Imagine you have:
- The `main` branch (the stable version)
- A `new-feature` branch (where you're experimenting)

When you merge, Git takes the changes from `new-feature` and **adds them** to `main`.

---

## How to Merge

```
git checkout main
git merge new-feature
```

1. First, switch to the branch you want to merge INTO (`main`)
2. Then, merge the other branch (`new-feature`)

---

# 💥 CONFLICTS — WHAT ARE THEY?

A **conflict** happens when Git CAN'T automatically merge changes.

## When does this happen?

When two people modified the **same line** of the **same file** in different ways.

---

## Example Conflict

Imagine you and a teammate both edit `index.html`:

**You:**
```html
<h1>Hello World</h1>
```

**Your teammate:**
```html
<h1>Hello GitHub</h1>
```

Git doesn't know which one to keep. **Conflict!**

---

# 🚨 HOW TO RESOLVE A CONFLICT

## Step 1: Identify the conflict

When you try to merge:
```
git merge new-feature
```

Git tells you:
> CONFLICT in index.html

---

## Step 2: Open the file

You'll see something like this:

```html
<<<<<<< HEAD
<h1>Hello World</h1>
=======
<h1>Hello GitHub</h1>
>>>>>>> new-feature
```

- `<<<<<<< HEAD` = your version (`main`)
- `=======` = separator
- `>>>>>>> new-feature` = the other version

---

## Step 3: Decide what to keep

You have 3 options:
1. Keep your version
2. Keep their version
3. Keep both (create a new version)

For example, keep both:

```html
<h1>Hello World - Hello GitHub</h1>
```

👉 **Remove** the `<<<<<<<`, `=======`, and `>>>>>>>` markers.

---

## Step 4: Mark as resolved

```
git add index.html
git commit -m "Resolve merge conflict"
```

---

# ✅ Tips to Avoid Conflicts

1. ✅ **Pull before you start working**
```
git pull
```

2. ✅ **Communicate with your team**
   - Who is working on what
   - Avoid editing the same files

3. ✅ **Make small, frequent commits**

4. ✅ **Use branches for each feature**

---

# 📌 Summary

- Merge = combine branches
- Conflict = Git can't decide
- Resolve = edit the file manually
- Always `git pull` before starting

---

# 🧪 Practice

1. Create two branches from `main`
2. Modify the same line in both
3. Try to merge → conflict!
4. Resolve it manually
5. Commit the resolution
