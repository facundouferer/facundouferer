# AGENTS Guide for `facundouferer`

This file is the operating guide for coding agents working in this repository.
Follow it as the default unless a user request explicitly overrides it.

## 1) Project Snapshot

- Stack: Astro 6 + TypeScript (`"type": "module"`, strict TS config).
- Package manager: npm (`package-lock.json` is present).
- Node requirement: `>=22.12.0`.
- Source root: `src/`.
- Primary file types: `.astro`, `.ts` (if added), static assets.

## 2) Repository Rules Discovery

- Checked for Cursor rules in `.cursor/rules/`: not found.
- Checked for `.cursorrules`: not found.
- Checked for Copilot rules in `.github/copilot-instructions.md`: not found.
- Conclusion: this file is the current canonical agent guidance in-repo.

## 3) Install & Run Commands

Run all commands from repository root.

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Astro CLI help: `npm run astro -- --help`

## 4) Build / Lint / Test Command Matrix

### Build

- Full production build: `npm run build`

### Lint / Static checks

- No dedicated lint script exists in `package.json`.
- No ESLint/Prettier/Biome configuration was found.
- Use Astro checks directly when validating code quality:
  - `npm run astro -- check`
- If a lint tool is introduced later, add scripts in `package.json` and update this file.

### Tests

- Test runner: Node built-in test runner (`node --test`).
- Run all tests: `npm test`
- Validation baseline for every change: `npm test` + `npm run astro -- check`.

### Running a single test (important)

- File-level test execution: `node --test tests/path/to/file.test.mjs`
- Name-filtered execution: `node --test --test-name-pattern "name" tests/path/to/file.test.mjs`

## 5) Mandatory Agent Workflow

1. Read `package.json` scripts before running commands.
2. Prefer the smallest validating command first (`astro check`, targeted tests when available).
3. Do not invent scripts in instructions; either use existing commands or add scripts explicitly.
4. After changing behavior/UI, run at least one verification command.
5. When adding a new tool (lint/test), update this AGENTS.md immediately.
6. Enforce TDD for all agent work: write/update failing tests first, implement, then make tests pass.
7. Add error-reduction mechanisms in each task: input validation, safe defaults, and explicit failure handling where relevant.

## 6) Code Style Guidelines

### 6.1 Imports and modules

- Use ESM import/export style only.
- Keep imports at the top of frontmatter (`---`) in `.astro` files.
- Order imports by locality:
  1) framework/library imports,
  2) internal modules/components,
  3) static assets.
- Prefer explicit relative paths (current project uses relative imports).
- Do not leave unused imports.

### 6.2 Formatting

- Follow existing formatting in repository files:
  - semicolons in JS/TS statements,
  - single quotes for strings in script sections,
  - tabs used in `.astro` markup/style indentation.
- Preserve line-wrapping conventions already present in touched files.
- Keep files clean and minimal; avoid style-only churn.

### 6.3 TypeScript and types

- TS config extends `astro/tsconfigs/strict`; treat strictness as required.
- Prefer explicit types at module boundaries (function params/returns, public objects).
- Avoid `any`; use unions, generics, `unknown`, or narrowed custom types.
- Narrow nullable/unknown values before use.
- Model props data structures with `type`/`interface` when non-trivial.

### 6.4 Naming conventions

- Astro components/layouts: `PascalCase.astro` (e.g., `Welcome.astro`, `Layout.astro`).
- Route files in `src/pages`: file-system routing names; keep route intent clear.
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- CSS ids/classes: descriptive, stable names; avoid meaningless abbreviations.

### 6.5 Astro component conventions

- Put JS/TS logic inside frontmatter block at top.
- Keep markup declarative; avoid excessive inline logic in templates.
- Prefer component composition over duplicated markup.
- Keep `<style>` blocks scoped and close to component usage unless global is required.
- For assets, import and reference via `asset.src` pattern as used in existing code.

### 6.6 CSS and UI rules

- Prefer component-local styles.
- Reuse tokens/patterns when introduced (colors, spacing, typography variables).
- Keep responsive behavior intentional; include mobile breakpoints where needed.
- Avoid introducing one-off values repeatedly; refactor into custom properties.

### 6.7 Error handling and resilience

- Do not swallow errors silently.
- For server-side logic/endpoints (if added), return meaningful HTTP status codes.
- Include actionable context in thrown errors/logs.
- Fail fast on invalid inputs; validate before processing.
- Handle absent/nullable data explicitly.

### 6.8 Accessibility and semantics

- Use semantic HTML elements first.
- Ensure images have appropriate `alt` text (empty `alt` only for decorative images).
- Keep heading hierarchy meaningful.
- Ensure interactive elements are keyboard accessible.

### 6.9 Content collection conventions (`articles` and `projects`)

These rules are mandatory whenever an agent is asked to create or update portfolio content.
Do not improvise fields, filenames, or locale strategy. Follow the existing content model exactly.

#### Articles (`src/content/articles`)

- Articles are **locale-split files**, not a single shared file:
  - Spanish file: `src/content/articles/<slug>.es.md`
  - English file: `src/content/articles/<slug>.en.md`
- Both files must share the same public `slug`.
- The filename suffix controls the locale convention, and frontmatter must also match it:
  - `.es.md` → `lang: es`
  - `.en.md` → `lang: en`
- Unless the user explicitly requests a single-language publication, always create **both locales**.
- Do **not** add fallback copy like “This article is available in English only” unless the user explicitly asks for it.
- The Spanish route `/articulos/<slug>` must contain real Spanish body content.
- The English route `/en/articles/<slug>` must contain real English body content.
- Do not leave the Spanish article body in English or vice versa.

Required article frontmatter fields:

```md
---
title: 'Spanish title'
title_en: 'English title'
slug: 'article-slug'
date: 2026-04-21
author: 'Facundo Uferer'
category: 'AI Strategy'
tags:
  - AI
  - Strategy
excerpt: 'Spanish excerpt'
excerpt_en: 'English excerpt'
readingTime: 6
lang: 'es' # or 'en'
published: true
featured: false
---
```

Article authoring rules:

- Keep `slug` identical in both locale files.
- Keep `date`, `category`, `tags`, `readingTime`, `published`, and `featured` aligned across both locales unless the user explicitly requests otherwise.
- `title` and `excerpt` are Spanish fields; `title_en` and `excerpt_en` are English fields. Both must exist in both files.
- Start the article body with a Markdown image right after frontmatter.
- Use an article image under `/img/articles/*.png`.
- If there is no specific image, use the default placeholder:
  - Spanish: `![Imagen por defecto del articulo](/img/articles/imagenotfound.png)`
  - English: `![Default article image](/img/articles/imagenotfound.png)`
- Prefer the same image asset for both locale files, with localized alt text.
- Write in Markdown, not raw HTML, unless there is a strong reason.
- Use headings, lists, blockquotes, and links with valid Markdown syntax.
- When adding emphasis with `**bold**`, highlight only core ideas, contrasts, or conclusions. Do not overuse bold.
- Keep references as proper Markdown bullet lists:
  - good: `- [Source name](https://...)`
  - bad: broken links, half-written bullets, malformed list syntax
- Preserve the editorial tone of the repository: concise, idea-driven, technical, and readable.

Article verification checklist:

- Confirm both locale files exist.
- Confirm both files render real localized body copy.
- Confirm both files include a top image reference.
- Confirm the slug is shared and the locale suffix/frontmatter pairing is correct.
- Update tests that hardcode article counts or file lists when adding/removing articles.

Useful article verification commands:

- `npm test -- tests/issue-10-content-schema.test.mjs`
- `npm test -- tests/issue-14-articles-listing.test.mjs`
- `npm test -- tests/issue-15-article-layout.test.mjs`
- `npm test -- tests/issue-18-initial-articles-content.test.mjs`
- `npm test -- tests/issue-28-localized-article-routing.test.mjs`
- `npm run astro -- check`

#### Projects (`src/content/projects`)

- Projects are **single files with bilingual frontmatter**, not locale-split files.
- Create one file per project:
  - `src/content/projects/<slug>.md`
- The filename should match the slug in kebab-case whenever possible.
- Do not create separate `.es.md` / `.en.md` project files unless the schema changes first.

Required project frontmatter fields:

```md
---
slug: 'project-slug'
title: 'Titulo en español'
title_en: 'English title'
category: 'AI Engineering'
description: 'Descripcion corta en español'
description_en: 'Short English description'
challenge: 'Desafio principal en español'
challenge_en: 'Main challenge in English'
aiRole: 'Rol de la IA en español'
aiRole_en: 'AI role in English'
tags:
  - Astro
  - TypeScript
image: '/img/projects/project-image.png'
liveUrl: 'https://example.com/'
featured: false
published: true
archived: false
---
```

Project authoring rules:

- `title` / `description` / `challenge` / `aiRole` are Spanish fields.
- `title_en` / `description_en` / `challenge_en` / `aiRole_en` are English fields.
- All bilingual fields are required. Do not leave English empty.
- `liveUrl` must be a valid absolute URL.
- `image` must point to an existing project asset under `/img/projects/`.
- Add the corresponding image file in `public/img/projects/` if needed.
- Keep tags concise and real; do not stuff keywords just to make the card look busy.
- Use `featured: true` only when the user explicitly wants the project highlighted on the homepage or the project clearly belongs in the featured pair.
- Use `archived: true` only for projects that should remain visible but marked as archived.
- Body copy below frontmatter should be short and factual:
  - one concise summary paragraph is enough
  - add a verification note only if it adds real operational value (for example, redirect or status validation)
- Do not invent extra frontmatter keys without updating `src/content.config.ts` and any affected tests/components.

Project verification checklist:

- Confirm the file matches the schema in `src/content.config.ts`.
- Confirm the image asset exists.
- Confirm `liveUrl` is syntactically valid.
- Confirm bilingual fields are complete.
- Update tests that hardcode project counts or asset lists when adding/removing projects.

Useful project verification commands:

- `npm test -- tests/issue-10-content-schema.test.mjs`
- `npm test -- tests/issue-12-featured-projects.test.mjs`
- `npm test -- tests/issue-13-projects-catalog.test.mjs`
- `npm test -- tests/issue-19-project-assets.test.mjs`
- `npm test -- tests/issue-21-go-to-brazil-link.test.mjs`
- `npm run astro -- check`

## 7) Editing Guardrails for Agents

- Make focused changes; avoid unrelated refactors.
- Respect existing project structure unless task requires change.
- Do not add new dependencies without clear justification.
- If adding dependencies, document why and how to verify.
- Prefer incremental commits with clear intent (when user asks for commits).

## 8) Definition of Done (for agent tasks)

- Requested behavior/content is implemented.
- A relevant verification command has been run (or limitation explicitly stated).
- No obvious type/import/runtime issues remain in touched files.
- AGENTS.md is updated if tooling/conventions changed.

## 9) Quick Reference

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Astro CLI: `npm run astro -- <command>`
- Static/type checks: `npm run astro -- check`
- Single test: not available until a test runner is introduced
