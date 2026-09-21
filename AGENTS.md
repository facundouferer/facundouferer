# AGENTS Guide for `facundouferer`

This file is the operating guide for coding agents working in this repository.
Follow it as the default unless a user request explicitly overrides it.

## 1) Project Snapshot

- Stack: Astro 6 + TypeScript (`"type": "module"`, strict TS config).
- Package manager: npm (`package-lock.json` is present).
- Node requirement: `>=22.12.0`.
- Source root: `src/`.
- Primary file types: `.astro`, `.ts` (if added), static assets.
- Design system: **Organic** (`Organic/`), documented in `DESIGN.md`, implemented
  in `src/styles/global.css`. All UI work derives from it — see §6.6.

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

### 6.6 CSS and UI rules — Organic Design System (MANDATORY)

**`DESIGN.md` is the design contract for this repository. Read it before writing
or modifying any component, page, layout, or style.**

All design decisions — color, typography, spacing, radius, elevation, component
markup, interaction states, iconography — MUST be derived from the **Organic**
design system in `Organic/`. Its runtime implementation for this Astro site is
`src/styles/global.css`, imported once from `src/layouts/BaseLayout.astro`.

Non-negotiable rules:

- Do not invent visual design. Consult `Organic/readme.md` and the matching
  reference page in `Organic/components/*.html` or `Organic/foundations/*.html`
  (plain HTML — view source and copy the markup) before building UI.
- Use only design-system tokens: `var(--color-*)`, `var(--font-*)`,
  `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`. Never hard-code a hex,
  a font family, or a px value a token already carries.
- Use the existing system classes (`.btn*`, `.tag*`, `.card*`, `.input`, `.nav*`,
  `.elev-*`, `.washed`, `.container`, `.section`, `.kicker`, `.section-title`,
  `.badge`) instead of parallel one-off classes.
- New shared classes go in `src/styles/global.css`, not into a component
  `<style>` block. New tokens go in the single `:root` block there. Never create
  a second `:root` token block.
- Accent-colored text at body size uses `--color-accent-700` (the base accent is
  ~3:1 against the ground — chrome and large text only).
- Keep themed interaction states: accent-ramp hover/pressed, the 2px
  `:focus-visible` accent ring, accent `::selection`, `0.45` disabled opacity.
- Wrap every content photograph in `.washed`.
- **All graphics come from Organic, not just components.** Icons are Lucide at
  `stroke-width: 2.75`; illustrations, diagrams, inline SVG, OG cards and slide
  visuals use the Organic palette, rounded geometry and the Caprasimo/Figtree
  pairing. Never introduce a second palette, display face or icon set. See
  `DESIGN.md` §6.
- Component-local `<style>` blocks are for layout unique to that component only —
  never to restyle a system class.
- Keep responsive behavior intentional; include mobile breakpoints where needed.

If a needed component is documented in `Organic/` but not yet in
`src/styles/global.css` (`.field`, `.radio`, `.seg`, `.table`, `.dialog`,
`.btn-block`), port it from `Organic/styles.css` rather than reimplementing it.

If the design system genuinely cannot express what the task requires, say so and
propose a token/class addition — do not silently diverge.

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
slug: 'article-slug'
date: 2026-04-21
author: 'Facundo Uferer'
category: 'AI Strategy'
tags:
  - AI
  - Strategy
excerpt: 'Spanish excerpt'
readingTime: 6
lang: 'es' # or 'en'
published: true
featured: false
---
```

Article authoring rules:

- Keep `slug` identical in both locale files.
- Keep `date`, `category`, `tags`, `readingTime`, `published`, and `featured` aligned across both locales unless the user explicitly requests otherwise.
- `title` and `excerpt` are locale-own fields — each file contains the value in its own language. The `.es.md` file has `title`/`excerpt` in Spanish; the `.en.md` file has them in English. Do NOT use bilingual fields (no `title_en`/`excerpt_en`).
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

#### Courses and Lessons (`src/content/courses/`)

- Course index files are **single files with bilingual frontmatter** (same pattern as projects):
  - `src/content/courses/<slug>/index.md`
- Lesson files are **locale-split** (same pattern as articles):
  - `src/content/courses/<slug>/<kebab-slug>.es.md`
  - `src/content/courses/<slug>/<kebab-slug>.en.md`
- The filename must include the locale suffix (`es` or `en`); the loader glob is `**/*.+(es|en).md`.
- Lessons use kebab-case filenames. Spaces in filenames are not allowed.
- Both locale files must share the same `slug` and `course` fields in frontmatter.
- `title` and `description` are locale-own fields — each file contains the value in its own language.
- `order` controls lesson sequencing within a course.
- The `lang` field must match the file suffix: `lang: es` for `.es.md`, `lang: en` for `.en.md`.

Required lesson frontmatter fields:

```md
---
course: 'git'
slug: '01-el-principio-con-git'
title: 'El principio con Git'
description: 'Primeros pasos con Git'
order: 1
lang: 'es'
published: true
---
```

Required course index frontmatter fields:

```md
---
slug: 'javascript'
title: 'JavaScript desde Cero'
title_en: 'JavaScript from Zero'
description: 'Aprendé JavaScript desde los fundamentos'
description_en: 'Learn JavaScript from the fundamentals'
technology: 'JavaScript'
difficulty: 'Principiante'
image: '/img/courses/javascript/logo.svg'
published: true
featured: true
---
```

- `title` / `description` are Spanish fields; `title_en` / `description_en` are English fields.
- Course images live under `public/img/courses/<slug>/logo.svg`.
- Keep lesson body copy factual and concise; prefer examples over theory.
- When adding a course, create the directory, `index.md`, and at minimum the `.es.md` lessons. English lessons may follow later.
- Update tests that hardcode course/lesson counts when adding or removing courses.

Courses pages are at `src/pages/cursos/` (Spanish) and `src/pages/en/courses/` (English) mirroring the articles catalog pattern: catalog at `index.astro`, course detail at `[course]/index.astro`, lesson page at `[course]/[lesson].astro`. Components: `CourseCard.astro`, `CourseBreadcrumb.astro`, `LessonsList.astro` in `src/components/`. Navigation entries live in `src/config/site.ts` `NAVIGATION` (between Articles and About). All UI strings use `t('courses.*')` keys from `es.json`/`en.json`.

Useful courses/lessons verification commands:

- `npm test -- tests/courses-schema.test.mjs`
- `npm test -- tests/courses-helpers.test.mjs`
- `npm test -- tests/courses-filename-normalization.test.mjs`
- `npm test -- tests/courses-catalog.test.mjs`
- `npm test -- tests/courses-detail-routing.test.mjs`
- `npm test -- tests/site-nav-courses.test.mjs`
- `npm run astro -- check`

#### Presentations (`src/data/presentations.ts`)

Interactive presentations are a flat catalog in `src/data/presentations.ts`, not a
content collection. Each `Presentation` record carries a `lesson: { course, slug }`
reference to the course/lesson it illustrates (`course` and `slug` match a lesson's
frontmatter, not a filename). A lesson may own zero, one, or several presentations
(e.g. `c/cadenas-de-caracteres-y-operaciones` owns four); every presentation belongs
to exactly one lesson.

Helpers exported from `src/data/presentations.ts`:

- `getPresentationsForLesson(course, slug)` — presentations for one lesson, in
  catalog order. Returns `[]` when the lesson has none.
- `getPresentationCountsForCourse(course)` — a `Record<lessonSlug, count>` map for
  one course. Lessons without presentations are absent from the map.
- `getLessonForPresentation(slug)` — the `{ course, slug }` lesson reference for a
  presentation slug, or `undefined` for an unknown slug.

Where this renders:

- `LessonsList.astro` shows a presentation-count badge per lesson (course detail
  sidebar/grid and the lesson-page sidebar), fed by `getPresentationCountsForCourse`.
- `LessonPresentations.astro` renders a "Presentations of this lesson" section on
  each lesson detail page (`src/pages/cursos/[course]/[lesson].astro` and its
  English counterpart), fed by `getPresentationsForLesson`.
- `PresentationLessonLink.astro` renders the reverse "Part of: Course › Lesson"
  link on each presentation detail page (`src/pages/presentaciones/[slug].astro`
  and `src/pages/[lang]/presentaciones/[slug].astro`), resolved from
  `getLessonForPresentation` plus the `courses`/`lessons` collections. The
  presentation catalog cards (`src/pages/presentaciones/index.astro` and
  `src/pages/[lang]/presentaciones/index.astro`) show the owning lesson title as a
  secondary line under the card title.

Verification: `node --test tests/presentations-lessons.test.mjs`.

#### Activities (`src/content/activities`)

Practice activities are a **content collection** (unlike presentations), locale-split
per activity, mirroring the lesson filename convention:

- `src/content/activities/<course>/<lesson-slug>/<activity-slug>.<lang>.md`
- `lesson-slug` must match a lesson's frontmatter `slug` (not the lesson filename).

The `activities` collection schema (`src/content.config.ts`) is
`z.discriminatedUnion('kind', [projectActivity, quizActivity])`, so `project` and
`quiz` activities each carry only their own fields:

- Shared base fields: `course`, `lesson`, `slug`, `title`, `description`, `order`,
  `lang` (`'es' | 'en'`), `published` (default `true`), `estimatedMinutes` (optional).
- `kind: 'project'` adds: `objectives: string[]`, `requirements: string[]`,
  `exampleOutput?: string`, `extensionChallenges?: string[]`, `deliveryTips?: string[]`.
  The markdown body is the project statement, rendered via `render(entry)`.
- `kind: 'quiz'` adds: `questions: QuizQuestion[]`, where `QuizQuestion` is itself a
  discriminated union on `kind` (`'single-choice' | 'true-false'`), so a new question
  kind (e.g. `multiple-select`) can be added later without touching existing
  questions. `single-choice` has `options: {id, text}[]` and `correctOptionId`;
  `true-false` has `correctAnswer: boolean`; both have `explanation`. Both also share
  an optional `code?: string` (a real multi-line snippet, YAML `|-` block scalar) and
  `codeLanguage` (defaults to `'java'`) — set `code` when a question is actually about
  a piece of code (renders as a real, syntax-highlighted code block below the
  question); keep short in-sentence mentions (`` `this` ``, `` `new` ``) as backticks
  in `prompt`/option `text`/`explanation` instead, never crammed `;`-joined
  statements in the prompt itself.

Helpers exported from `src/utils/activities.ts` (mirrors `presentations.ts` helper
style, but operates on `CollectionEntry<'activities'>[]` since this is a real
collection, not a static catalog):

- `getActivitiesForLesson(entries, course, lesson, locale)` — published activities
  for one lesson, sorted by `order`. Returns `[]` when none exist.
- `getActivityCountsForCourse(entries, course, locale)` — a `Record<lessonSlug,
  count>` map. Lessons without activities are absent from the map.
- `resolveActivityEntry(entries, course, lesson, slug, locale)` — one published
  activity by slug, or `undefined` (no throw).

Quiz grading is a **pure, framework-agnostic module**: `src/data/activities/grading.ts`
exports `isAnswerCorrect`, `gradeQuiz` (per-question `{questionId, answered,
correct}` results, `correctCount`/`totalCount`, and `scoreOutOfTen` normalized to 10
and rounded to one decimal), `formatScore` (Spanish decimal comma, e.g. `7,5 / 10`),
and `getCorrectAnswerLabel`. It has no Astro/DOM dependency, is unit-tested directly
(`tests/activities-grading.test.mjs`), and is imported both from the quiz detail
page's client `<script>` (for interactive grading) and from its Astro frontmatter
(to pre-render each question's correct-answer text server-side).

Where this renders:

- `LessonActivitiesAccess.astro` renders an "Actividades (N)" access next to the
  lesson title (`src/pages/cursos/[course]/[lesson].astro`), next to
  `LessonPresentationsMenu`. It renders nothing when the lesson has no activities.
- `LessonsList.astro` (course page `src/pages/cursos/[course]/index.astro` and the
  lesson sidebar in `src/pages/cursos/[course]/[lesson].astro`, plus their English
  counterparts under `src/pages/en/courses/`) renders an activity-count `.badge`
  next to the existing presentation-count badge, using the same Lucide
  `list-checks` icon as `LessonActivitiesAccess.astro` and the same
  `courses.activities.badge.one`/`.other` i18n keys for its accessible label. Fed
  by `getActivityCountsForCourse`; renders nothing when a lesson has no
  activities. English pages compute counts too (for parity with the
  `presentationCount` wiring and forward-compatibility) but always render no
  badge today, since activities are Spanish-only.
- `src/pages/cursos/[course]/[lesson]/actividades/index.astro` — the activity list
  for one lesson: lesson context, back link, and a card per activity (kind tag,
  title, description, estimated time). Only generated for lessons that have at
  least one published activity. Uses the same `.container.article-shell` width as
  article pages (`ArticleLayout.astro`) — see `src/styles/article-body.css`.
- `src/pages/cursos/[course]/[lesson]/actividades/[activity].astro` — the activity
  detail page, also at the same `.container.article-shell` article width (no
  page-specific max-width override). `project` kind renders the markdown statement plus objectives/
  requirements/example-output/extension-challenges/delivery-tips. `quiz` kind
  renders each question as an accessible `<fieldset>`/`<legend>` radio group
  (`.radio`, ported from `Organic/styles.css` — see §6.6), stacked vertically via
  `.quiz-options { display: grid; }` (a `.radio` is `inline-flex`, so its container
  must lay out its children as a block/grid stack, matching the `.stack` pattern in
  `Organic/components/forms.html`'s radiogroup reference). When a question has
  `code`, it renders below the prompt via Astro's `<Code>` (`astro:components`),
  wrapped in an `.article-body` div so it reuses the same Shiki `pre`/`code` styling
  as lesson/article content — not a one-off style. Prompt, option text, the correct-
  answer label, and the explanation are all passed through
  `src/utils/renderInlineCode.ts` (escapes HTML, then turns `` `x` `` into
  `<code>x</code>`) via `set:html`, so short inline code mentions render properly
  too. The learner answers, presses "Calificar", and a client script (importing
  `grading.ts`) marks each question correct/incorrect/unanswered via `data-result`
  attributes (all label text is pre-rendered server-side and toggled with CSS,
  never written by the script, per the i18n rule below) and shows the score via
  `formatScore`. "Reintentar" resets all state. English (`/en/courses/...`) routes
  are out of scope for the pilot; the schema's `lang` field keeps that path open.

Verification: `node --test tests/activities-grading.test.mjs
tests/activities-content-model.test.mjs tests/activities-routes.test.mjs
tests/activities-pilot-content.test.mjs`.

### 6.10 i18n Runtime (`src/i18n/`)

UI strings are centralized in `src/i18n/es.json` + `src/i18n/en.json` (Astro 6 native i18n config — `defaultLocale: 'es'`, `prefixDefaultLocale: false`). The deprecated `src/i18n/translations.ts`, `src/i18n/paths.ts`, and `src/seo/meta.ts` modules have been removed; do not reintroduce them.

Canonical runtime API:

```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<p>{t('nav.projects')}</p>
```

`getLangFromUrl(url: URL): 'es' | 'en'` derives the locale from the URL pathname (`/en/...` → `'en'`; everything else → `'es'`). `useTranslations(locale)(key: string): string` resolves a hierarchical dot-path key (`'nav.courses'`, `'seo.articles.title'`) against the matching JSON dictionary; missing keys throw with the locale + path context (fail loudly during build rather than render `undefined`).

i18n conventions:

- Every UI string MUST live in `src/i18n/es.json` + `src/i18n/en.json` as a hierarchical dot-path key. Do NOT inline `locale === 'es' ? '...' : '...'` ternaries in component templates for labels.
- URL/href conditionals (`locale === 'es' ? '/proyectos' : '/en/projects'`) are permitted: they are decoration paths, not labels.
- Data-field conditionals on collection entries are permitted for **bilingual single-file collections** (e.g. projects: `locale === 'es' ? project.title : project.title_en`). For **locale-split collections** (articles, lessons), the `title`/`excerpt` fields are already in the correct language — no conditional needed.
- Add a new UI string by adding the same key to both `es.json` and `en.json`; `t()` will throw at build time if either is missing.
- `BaseLayout.astro` derives `locale = Astro.props.locale ?? getLangFromUrl(Astro.url)` so pages may pass `locale` explicitly for edge cases but children/components rely on URL-derived locale.
- Pages call `useTranslations(getLangFromUrl(Astro.url))` to read SEO strings: `t('seo.home.title')`, `t('seo.articles.description')`, etc.
- `nav.courses` (`Cursos` / `Courses`) and `seo.courses.*` keys are seeded for upcoming slice work; do not remove them.

i18n verification commands:

- `npm test -- tests/i18n-runtime.test.mjs`
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
- UI work uses only Organic tokens and classes (`DESIGN.md` §7); no raw hex,
  font family, or hard-coded px where a token exists.
- AGENTS.md is updated if tooling/conventions changed.
- DESIGN.md is updated if a token or shared class was added or changed.

## 10) Spec Lifecycle (`specs/`)

- When implementing content that fulfills a spec from `specs/open/`, **move that spec file to `specs/closed/`** upon completion.
- This applies whenever an article, project, or any deliverable directly satisfies a spec's requirements.
- Verificar antes de mover que el deliverable realmente cumple lo especificado.
- No mover specs que no se hayan completado.

## 9) Quick Reference

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Astro CLI: `npm run astro -- <command>`
- Static/type checks: `npm run astro -- check`
- Single test: not available until a test runner is introduced
