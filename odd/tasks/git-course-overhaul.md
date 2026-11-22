# Git course overhaul: fixes, restructure, two new lessons, exercises and films

Objective: apply every proposal of the Git course review: fix the technical errors, restructure the course into six lessons (two new), add exercises to every lesson and one film per lesson.
Branch `feat/git-course-overhaul`, delivery `ask-on-risk`, runner `node --test` (`npm test`) plus `npx astro check`.
Forecast: ~5,000 authored lines of lesson content (12 files) + ~11,000 lines of films (6 films). Content first, films second (films must match the final lessons).

## Specs

- S1. Proposals accepted verbatim (user: "implementa todas tus propuestas"):
  > 1. Corregir los errores del punto 1 y unificar todo en `switch` y `restore`.
  > 2. Dejar L1 solo con el trabajo local y llevar remotos y ramas a sus propias lecciones.
  > 3. Agregar dos lecciones nuevas: **"Deshacer cambios"** y **"Flujo con ramas y Pull Requests"**, que incluya la autenticación.
  > 4. Agregar ejercicios a cada lección y, después, las animaciones en formato film.
- S2. Errors to fix (review point 1, verbatim summary of each item):
  - L4 (rebase) `git diff` "compara contra el último commit": wrong. `git diff` = working tree vs staging; `git diff --staged` = staging vs last commit; `git diff HEAD` = working tree vs last commit.
  - L2 (remotes) "Your local changes would be overwritten" happens when there are uncommitted changes in a **file** the pull will modify, not "en las mismas líneas".
  - L2 sample output `a1b2c3d..e4f5g6h` is not valid hex.
  - L3 conflict example reuses `git checkout -b login` when `login` already exists and assumes the file is back to "Hola mundo": the example must be continuous and runnable top to bottom.
  - L3 "Git NUNCA borra tu trabajo" is false: uncommitted work is lost with `reset --hard` or `restore`; committed work is almost always recoverable (reflog).
  - L1 `git checkout ID` as "modo lectura": it is detached HEAD; explain it (taught now in the undo lesson with `git switch --detach`).
- S3. Promised-but-missing content (review point 2) must be taught where promised: real `git fetch` usage (`origin/main`, "behind/ahead" in `git status`, `git log main..origin/main`); `git switch` and fast-forward vs merge commit with an example that produces each (diagram consistent with the example); `git restore --staged` taught in the lesson whose diagram shows it; `git revert` taught (undo lesson) and `git bisect` either taught or not mentioned.
- S4. Content gaps (review point 3) covered: branch + Pull Request workflow; undo lesson (`restore`, `commit --amend`, `reset` soft/mixed/hard, `revert`, `reflog`); `git stash`; GitHub authentication (HTTPS with personal access token or GitHub CLI, and SSH keys); rejected push (non-fast-forward) and `fatal: Need to specify how to reconcile divergent branches` with `pull.rebase` config; `git push --force-with-lease` after rebasing an already-pushed own branch (golden rule refined); `git rebase -i` (squash/fixup/reword); `.gitignore` does not untrack an already-tracked file (`git rm --cached`); `git log --oneline --graph`.
- S5. Structure (review point 4): no `git checkout` anywhere (use `switch`/`restore`); no duplicated topics (each topic has one home lesson, later lessons link back); consistent style across lessons: a single H1, `##`/`###` sections without emoji, no blank lines between list items, neutral Spanish with "tú" (no voseo) in `.es.md`, English in `.en.md`; consistent commit messages: plain short imperative messages ("Agrega saludo inicial" / "Add initial greeting") until the lesson that teaches Conventional Commits; from that lesson on, Conventional Commits in the lesson's language.
- S6. New course order (frontmatter `order`; slugs of the four existing lessons stay the same so their URLs and presentations keep working; files renamed to match the order):
  1. `el-principio-con-git` (`01-el-principio-con-git.*.md`) — local only.
  2. `deshacer-cambios` (`02-deshacer-cambios.*.md`) — new.
  3. `conflictos` (`03-conflictos.*.md`) — branches, merge, conflicts (local).
  4. `bajar-y-subir-cambios` (`04-bajar-y-subir-cambios.*.md`) — remotes and authentication.
  5. `ramas-y-pull-requests` (`05-ramas-y-pull-requests.*.md`) — new, team workflow.
  6. `rebase-y-buenas-practicas` (`06-rebase-y-buenas-practicas.*.md`).
  `index.md` roadmap: module "Trabajo local" / "Local work" (1, 2, 3), "Colaboración con remotos" / "Collaborating with remotes" (4, 5), "Historial profesional" / "Professional history" (6).
- S7. Per-lesson scope (curriculum sequencing, AGENTS.md: a lesson only uses its own and earlier topics):
  - L1: what Git is; repository, commit (hash, author, date, message, parent), history; install (Windows, macOS, Debian/Ubuntu and Fedora); `git config` (user.name, user.email, init.defaultBranch, `--global` vs `--local`, `git config --list`); `git init`; `git status`; the three zones; `git add <file>` / `git add .`; `git restore --staged`; `git commit -m` and how to write a good message; `git diff` and `git diff --staged`; `git log` and `git log --oneline`; Git vs GitHub as concepts only. No branches, no remotes, no GitHub commands.
  - L2: `git restore <file>` (destructive warning), `git restore --staged`, `git commit --amend` (only for commits not yet shared), `git revert`, `git reset --soft/--mixed/--hard`, `git show`, inspecting an old commit with `git switch --detach <hash>` and returning with `git switch main` (detached HEAD explained), `git restore --source=<hash> <file>`, `git reflog` to recover after `reset --hard`; a decision table. No branch creation, no remotes, no stash.
  - L3: branch as a movable pointer and HEAD; `git branch`, `git switch`, `git switch -c`, `git branch -d`; `git log --oneline --graph --all`; fast-forward merge and three-way merge commit, each with its own runnable example; a continuous conflict example; markers; resolution; `git add` + `git commit` (default message) or `git merge --continue`; `git merge --abort`; accurate statement about what Git can and cannot recover. No remotes, no pull/push/fetch, no rebase.
  - L4: local vs remote and `origin`; GitHub authentication (HTTPS + personal access token or `gh auth login`; SSH with `ssh-keygen -t ed25519`, adding the key, `ssh -T git@github.com`); `git remote add`, `git remote -v`; `git push -u origin main`; `git clone`; `git fetch`, `origin/main`, ahead/behind, `git log main..origin/main`; `git pull` = fetch + integrate; divergent-branches error and `git config --global pull.rebase false`; "local changes would be overwritten" (correct explanation) and `git stash` / `git stash list` / `git stash pop`; rejected push (non-fast-forward) and its fix; conflicts on pull reuse L3's procedure with a link (no re-explanation). The lesson works alone on `main` to learn synchronization and says the team workflow comes in L5. No rebase.
  - L5: why the team does not push to `main`; feature branch workflow (`git switch -c`, commits, `git push -u origin <branch>`); opening a Pull Request on GitHub (web, optionally `gh pr create`); review and comments; pushing more commits updates the PR; updating the branch with `git fetch` + `git merge origin/main`; resolving a conflict in a PR; GitHub merge options (merge commit, squash, rebase described, with a forward link to L6 for rebase); after merge: `git switch main`, `git pull`, `git branch -d`, `git push origin --delete <branch>`, `git fetch --prune`; branch protection as a concept. No `rebase` commands.
  - L6: rebase mental model; merge vs rebase; step by step with `git fetch` + `git rebase origin/main`; conflicts during rebase, `--continue`, `--abort`, "ours/theirs" inversion; golden rule refined (never rewrite shared branches; own already-pushed branch → `git push --force-with-lease`, never plain `--force`); `git rebase -i` (pick, reword, squash, fixup, drop); atomic commits (links `git revert` to L2); `git bisect` taught briefly with real steps or not mentioned; Conventional Commits (types incl. `style`, `perf`, `ci`, `build`, `!`/`BREAKING CHANGE`); `.gitignore`, `git rm --cached`, global gitignore for OS/editor files; secrets; inspection before commit (`git status --short`, `git diff`, `git diff --staged`, `git add -p`).
- S8. Every lesson (both locales) ends with an exercises section, heading `## Ejercicios prácticos` (es) / `## Practice exercises` (en), with at least three exercises, each with its solution in `<details><summary>Ver solución</summary>` (es) / `<details><summary>Show solution</summary>` (en), using only that lesson's and earlier topics. L4's and L5's exercises can be done alone (two local clones act as two teammates).
- S9. Diagrams: keep the existing inline SVG diagrams (fixed where they contradict the text); new lessons get at least one inline SVG diagram in the same style (`<figure class="diagram">`, Organic tokens only, `var(--color-*)`, no raw hex, unique marker ids).
- S10. One film per lesson following `CLAUDE.md` §Lesson films (one persistent motion canvas `data-scene="journey" data-motion`, `viewBox="0 0 1280 720"`, 6 chapters, ~8 motion steps, 90–120 s in both locales, `--xj-*` palette block, fixed editor on the left showing the terminal session as the "code" with the executing line highlighted and output typed below, isometric 2.5D system on the right, neutral Latin American Spanish + English captions, Organic thumbnail, dedicated test, added to `paletteExceptions`). Slugs: `tres-estados-git` (L1), `deshacer-cambios-git` (L2), `ramas-conflictos-git` (L3), `sincronizacion-remota-git` (L4), `pull-requests-git` (L5), `rebase-git` (L6). Each film is the lesson's only animation.
- S11. Existing presentations keep working (slugs unchanged). Updating their content is out of scope (follow-up).

## Tasks

- [ ] T1 (S5-S8) parent, inline: RED test `tests/courses-git-curriculum.test.mjs` (lessons, order, roadmap, exercises, no `checkout`, required commands, sequencing bans).
- [ ] T2 (S2, S5, S7 L1, S8, S9) delegated writer: L1 es+en.
- [ ] T3 (S2-S5, S7 L2, S8, S9) delegated writer: L2 es+en (new).
- [ ] T4 (S2-S5, S7 L3, S8, S9) delegated writer: L3 es+en.
- [ ] T5 (S2-S5, S7 L4, S8, S9) delegated writer: L4 es+en.
- [ ] T6 (S4, S5, S7 L5, S8, S9) delegated writer: L5 es+en (new).
- [ ] T7 (S2-S5, S7 L6, S8, S9) delegated writer: L6 es+en.
- [ ] T8 (S6) parent, inline: renames, `index.md` roadmap, GREEN, suite, astro check, content commits.
- [ ] T9-T14 (S10) delegated writers: one film each.
- [ ] T15 (S10, S11) parent, inline: catalog, both `[slug].astro` maps, `paletteExceptions`, AGENTS.md, suite, astro check, browser verification.

Route evidence: T2-T7 are six independent units with disjoint edit surfaces (two lesson files each, ~400-900 lines), launched together (Writer trigger a); the shared contract is S7. T9-T14 likewise (`src/data/animations/<slug>.ts`, `src/components/animaciones/<slug>.astro`, `public/img/animations/<slug>.svg`, `tests/animation-<slug>.test.mjs`). Parent owns git and shared files (`index.md`, the curriculum test, `src/data/animations.ts`, both `[slug].astro`, `tests/animations-lessons.test.mjs`, `AGENTS.md`).

## Log

- L1 (2026-11-22, user): "podrías analizar el curso de git para ver si si contenido puede mejorar?" -> review delivered (errors, missing content, gaps, structure, proposal) -> "implementa todas tus propuestas".
- L2 (2026-11-22): decisions: keep the four existing slugs (presentations and URLs depend on them), rename files to the new order, Spanish "tú", no emoji headings, in-lesson exercises with `<details>` solutions (Java pattern), films after content.
