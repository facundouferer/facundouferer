# Design: Courses i18n Refactor

## Context

The `courses-i18n-refactor` change (see `proposal.md`) promotes the orphaned Spanish-only `src/content/courses/` tree (4 courses, 58 lessons) to a first-class bilingual section under `/cursos/...` (es) + `/en/courses/...` (en), introduces real zod schemas + helpers + pages for `courses` and `lessons`, normalizes lesson filenames (kebab-case, fix `prinicpio` typo), moves course logos to `public/img/courses/<slug>/logo.svg`, consolidates UI strings into `src/i18n/es.json` + `en.json` on Astro-native `useTranslations(getLangFromUrl(Astro.url))`, and corrects the article locale-split model by removing duplicated `title_en`/`excerpt_en` from each per-locale file. The design below specifies HOW — file layout, schemas, helper signatures, routing, migration steps, and TDD-aligned test plan — without inventing scope beyond the 5 spec deltas.

## Architecture Decisions

- **Locale-own split-files model (articles + lessons).** Each `.es.md` owns only Spanish fields + Spanish body; each `.en.md` owns only English fields + English body; `slug` is shared. `title_en`/`excerpt_en`/`description_en` are dropped from split-file schemas. **Alternatives considered:** keep dual-field duplication (rejected — duplicates data, drifts between files, complicates helpers); single bilingual file with `_en` siblings (rejected for long-prose — files become unmanageably long, breaks the established articles convention). **Rationale:** consistency between articles and lessons; the per-locale file is already the canonical source for its locale's body, so duplicating the other locale's title inside it has no consumer.
- **Course index keeps bilingual frontmatter (asymmetric with lessons).** Course `index.md` is short metadata, mirrors the `projects` pattern: a single file with `title`/`title_en`/`description`/`description_en`. **Alternatives considered:** split `index.es.md`/`index.en.md` (rejected — course index has no body, splitting adds two files for ~5 lines of metadata each); drop `lang` entirely (rejected — `lang: 'both'` is the cleanest signal to helpers that this entry applies to both locales without special-casing). **Rationale:** matches `projects` precedent; `lang: 'both'` keeps `getCoursesForLocale` predicate uniform (`lang === locale || lang === 'both'`).
- **Articles migration is destructive but slug-stable.** Removing `title_en`/`excerpt_en` from all `.es.md` + `.en.md` files; public slugs and URLs (`/articulos/<slug>`, `/en/articles/<slug>`) are unchanged. The migration is a one-shot `scripts/migrate-articles-locale-own.mjs` node script that strips the two keys from each file's frontmatter via a minimal YAML-light parser (no new dep; pure read/regex/write). **Alternatives considered:** manual `sed` (rejected — 32 files × 2, error-prone); keep fields as optional (rejected — spec mandates removal). **Rationale:** deterministic, reviewable, re-runnable; tests that assert presence of `title_en`/`excerpt_en` are flipped to absence in the same slice (TDD red→green).
- **UI strings consolidate to hierarchical JSON.** `src/i18n/es.json` + `en.json` replace both `src/seo/meta.ts` (`SEO.es`/`SEO.en`) and `src/i18n/translations.ts`. `src/seo/meta.ts` is **deleted** (no re-export — full consolidation is cleaner and the spec explicitly forbids any production UI string remaining there). **Alternatives considered:** re-export from JSON for backward compat (rejected — doubles the surface, spec wants single source). **Rationale:** the spec's `rg "Proyectos|Articulos|Sobre mi" src/seo/meta.ts` scenario mandates zero matches; deleting the file is the simplest contract enforcement.
- **`src/i18n/translations.ts` + `paths.ts` deleted.** Mandated by `ui-i18n-runtime` delta ("removed OR reduced to no-op re-exports"). We delete outright. **Rationale:** grep confirms no production import outside `LanguageSwitch.astro`/`SiteHeader.astro` consumers of NAVIGATION (which is in `config/site.ts`, not `translations.ts`); `paths.ts` is unused by any page. Tests that read `src/i18n/translations.ts` (`issue-9-i18n-routing.test.mjs`) are updated to read the JSON files instead.
- **Locale derived from URL, not hardcoded props.** `getLangFromUrl(Astro.url)` is the single source of truth for label rendering. `BaseLayout.astro` keeps `locale` as an explicit prop (still required for `<html lang>`, hreflang, canonical paths) but derives it from URL when not passed. Pages stop passing `locale="es"`/`locale="en"` to children for label purposes — children call `useTranslations(getLangFromUrl(Astro.url))` themselves. **Alternatives considered:** keep prop threading (rejected — spec mandates URL-derived locale for label rendering). **Rationale:** spec scenario "Locale from URL" requires it; eliminates drift between prop and URL.
- **No new dependencies.** Pure Astro 6 + `node --test`. No Paraglide, no `@nanostores/i18n`. **Rationale:** spec + proposal Non-Goals.

## Component / Module Layout

### New files to create

**Content — courses (locale-split lessons, bilingual index):**

Pattern: each course keeps a single `index.md` (bilingual frontmatter, no body change needed beyond new required fields). Each lesson `NN-slug.md` becomes a pair `NN-slug.es.md` + `NN-slug.en.md` sharing the same stem. Examples (full enumeration deferred to tasks phase):

- `src/content/courses/git/01-El prinicpio con git.md` → `src/content/courses/git/01-el-principio-con-git.es.md` + `01-el-principio-con-git.en.md` (typo `prinicpio` → `principio`, spaces → kebab).
- `src/content/courses/java/01-conceptos-basicos.md` → `01-conceptos-basicos.es.md` + `01-conceptos-basicos.en.md`.
- `src/content/courses/c/01-introduccion-y-estructura.md` → `01-introduccion-y-estructura.es.md` + `.en.md`.

Each `index.md` is enriched with: `slug`, `title`, `title_en`, `description`, `description_en`, `technology`, `difficulty`, `image`, `published: true`, `featured: false`, `lang: 'both'`.

**Course logos moved:**

- `src/content/courses/<course>/logo.svg` → `public/img/courses/<course-slug>/logo.svg` for each of `c`, `git`, `java`, `javascript`.
- Referenced in frontmatter as `image: '/img/courses/<slug>/logo.svg'` and rendered via `withBase(image)` in components (matches projects pattern).

**Helpers — `src/utils/courses.ts`:** full signatures in the Helper APIs section.

**i18n dictionaries — `src/i18n/es.json` + `src/i18n/en.json`:** JSON shape (hierarchical, dot-path addressable by `t()`):

```json
{
  "nav": {
    "projects": "Proyectos",
    "articles": "Articulos",
    "courses": "Cursos",
    "about": "Sobre mi",
    "contact": "Contacto",
    "hire": "Contratame"
  },
  "home": {
    "title": "Facundo Uferer — Ingeniero Full Stack con IA",
    "description": "Ingeniero Full Stack Senior especializado en desarrollo asistido por IA. De la idea al deploy, mas rapido que cualquier equipo tradicional."
  },
  "seo": {
    "home": { "title": "...", "description": "..." },
    "articles": { "title": "...", "description": "..." },
    "projects": { "title": "...", "description": "..." },
    "courses": { "title": "...", "description": "..." }
  },
  "courses": {
    "catalogTitle": "Cursos",
    "catalogSubtitle": "...",
    "lessonsLabel": "Lecciones",
    "backToCourse": "Volver al curso",
    "backToCatalog": "Volver al catalogo"
  }
}
```

`en.json` mirrors the same key hierarchy with English values. Existing `nav.*` and `home.*` keys come from current `src/i18n/translations.ts`; `seo.*` keys come from `src/seo/meta.ts` `SEO.es`/`SEO.en` (full mapping table below); `courses.*` keys are new for the courses pages.

**Pages — Spanish:**

```
src/pages/cursos/
├── index.astro              ← catalog: lists published es courses
├── [course].astro           ← course detail + lessons list
└── [course]/
    └── [lesson].astro       ← lesson body
```

**Pages — English mirror:**

```
src/pages/en/courses/
├── index.astro
├── [course].astro
└── [course]/
    └── [lesson].astro
```

Chosen path structure: nested `[course]/[lesson]` (not flat `[course].[lesson].astro`) for cleaner URL semantics and per-folder separation. **Alternatives considered:** flat `[course].[lesson].astro` (rejected — couples params, no clearer); single dynamic `[course]/[lesson]` under `[course].astro` (rejected — Astro requires distinct file paths). **Rationale:** matches the natural URL hierarchy `/cursos/<course>/<lesson>`.

**Components:**

- `src/components/CourseCard.astro` — props `{ course: CourseMeta, locale }` where `CourseMeta` is a trimmed view of the entry's data (`slug`, `title`, `title_en`, `description`, `description_en`, `difficulty`, `technology`, `image`). Renders logo, locale-appropriate title/description, difficulty badge, link to `/cursos/<slug>` or `/en/courses/<slug>`. Reuses `ArticleCard.astro` styling pattern (`card`, `card-hover`, `withBase`).
- `src/components/LessonsList.astro` — props `{ lessons: Array<{ slug, title, description?, order }>, courseSlug, locale }`. Renders an ordered `<ol>` of lesson rows linking to `/cursos/<course>/<lesson>` (or `/en/courses/...`). Sorts client-side via `order` (helper already sorts; component receives pre-sorted list).
- `src/components/CourseBreadcrumb.astro` — props `{ courseSlug, courseTitle, lessonTitle?, locale }`. Renders `Cursos / <course> / <lesson>` with links. Reuses no existing component but follows the `withBase` link convention.

### Files to modify

- `src/content.config.ts` — add `courses` + `lessons` collections (zod below); modify `articles` schema: drop `title_en` and `excerpt_en` as required fields. Keep `generateArticleId` (still produces `${slug}__${lang}`).
- `src/utils/articles.ts` — signatures unchanged; internal `resolveArticleEntry`/`getArticlesForLocale` keep working because each per-locale file still has its own `title`/`excerpt`. **No public signature break.** Only callers that read `.title_en`/`.excerpt_en` from `entry.data` must switch to resolving the English sibling entry instead — affected: `src/pages/en/articles/[slug].astro` (reads `excerpt_en`, `title_en` for prev/next), `src/components/ArticleCard.astro` (reads `title_en`/`excerpt_en`). Both will switch to: resolve the English entry via `resolveArticleEntry(entries, slug, 'en')` and render its `.title`/`.excerpt`.
- `astro.config.mjs` — **no changes**. The native i18n config (`defaultLocale: 'es'`, `locales: ['es','en']`, `prefixDefaultLocale: false`) is already correct. Astro i18n runtime APIs (`getLangFromUrl`, `useTranslations`) are generated automatically from this config.
- `src/config/site.ts` — `NAVIGATION.es` becomes `[{Proyectos}, {Articulos}, {Cursos, href: '/cursos'}, {Sobre mi}]`; `NAVIGATION.en` becomes `[{Projects}, {Articles}, {Courses, href: '/en/courses'}, {About}]`. The `Cursos`/`Courses` entry sits between Articles and About. SiteHeader needs **no change** — it already iterates `NAVIGATION[locale]`.
- `src/seo/meta.ts` — **deleted** (see Files to delete). SEO strings migrate to `i18n/es.json`/`en.json` under `seo.*`. Any caller of `SEO.es.foo` switches to `const t = useTranslations(getLangFromUrl(Astro.url)); t('seo.foo')`. Migration table:

  | Current | New |
  |---------|-----|
  | `SEO.es.home.title` | `t('seo.home.title')` from `es.json` |
  | `SEO.es.home.description` | `t('seo.home.description')` |
  | `SEO.es.articles.title` | `t('seo.articles.title')` |
  | `SEO.es.articles.description` | `t('seo.articles.description')` |
  | `SEO.es.projects.title` | `t('seo.projects.title')` |
  | `SEO.es.projects.description` | `t('seo.projects.description')` |
  | `SEO.en.*` | same keys, `en.json` values |

- `src/layouts/BaseLayout.astro` — `locale` prop derivation: `const locale = Astro.props.locale ?? getLangFromUrl(Astro.url);` (keeps explicit-pass override for edge cases). `<html lang>`, hreflang, canonical logic unchanged. Already passes `esPath`/`enPath` to SiteHeader — unchanged.
- Pages that hardcode `locale="es"`/`locale="en"` for label rendering — switch to URL-derived locale. **Affected page files** (full list from grep):
  - `src/pages/index.astro`, `src/pages/en/index.astro`
  - `src/pages/proyectos.astro`, `src/pages/en/projects.astro`
  - `src/pages/articulos/index.astro`, `src/pages/en/articles/index.astro`
  - `src/pages/articulos/[slug].astro`, `src/pages/en/articles/[slug].astro`
  - `src/layouts/ArticleLayout.astro` (derives `esPath`/`enPath` from `href` — keep as-is; only the `locale` used for label rendering switches to URL-derived).
- Components reading `locale` for labels (`Hero`, `ValueProp`, `FeaturedProjects`, `FeaturedArticles`, `About`, `Certifications`, `Contact`, `Toolchain`, `Process`, `ArticleCard`, `ProjectCard`, `ArticlesCatalog`, `ProjectsCatalog`, `FeaturedArticles`) — each keeps `locale` prop (still useful for data-field conditionals like `article.title` vs `article.title_en`) but replaces UI-label `locale === 'es' ? '...'` expressions with `t('...')`. The spec's `ui-i18n-runtime` "No Inline Locale Conditional Labels" scenario mandates this. Data-field conditionals (rendering `title` vs `title_en` of an entry) are explicitly **permitted** by the spec and remain.
- `src/components/SiteHeader.astro` — **likely no change**. Nav is data-driven from `NAVIGATION[locale]`. The only inline conditionals (`hireHref`, `hireLabel`) could migrate to `t('nav.hire')` for consistency; recommended but not strictly required by spec. Decision: migrate `hireLabel` to `t('nav.hire')` for full consolidation; keep `hireHref` logic (URL, not a label).
- `src/components/LanguageSwitch.astro` — no change. It is a pure prop-client; spec does not require it to derive locale from URL (it receives `esPath`/`enPath` already).

### Files to delete

- `src/i18n/translations.ts` — mandated by `ui-i18n-runtime` delta ("removed OR reduced to no-op re-exports"). We delete.
- `src/i18n/paths.ts` — mandated by the same delta. Grep confirms no production import; safe to delete.
- `src/seo/meta.ts` — mandated by `ui-i18n-runtime` "Migration completeness" scenario (`rg "Proyectos|Articulos|Sobre mi" src/seo/meta.ts` must return no matches).

### Files to move/rename

- Course lessons: `NN-Slug With Spaces.md` → `NN-kebab-case-slug.es.md` + `.en.md` (pattern, not full enumeration). Examples above.
- Course logos: `src/content/courses/<course>/logo.svg` → `public/img/courses/<course-slug>/logo.svg`.

## Data Schemas

Add to `src/content.config.ts` (matching existing zod import style: `import { defineCollection, z } from 'astro:content'; import { glob } from 'astro/loaders';`):

```ts
const courses = defineCollection({
	loader: glob({ pattern: '**/index.md', base: './src/content/courses' }),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		title_en: z.string(),
		description: z.string(),
		description_en: z.string(),
		technology: z.string(),
		difficulty: z.string(),
		image: z.string().optional(),
		published: z.boolean().default(true),
		featured: z.boolean().default(false),
		lang: z.enum(['es', 'en', 'both']).default('both'),
	}),
});

const lessons = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
	schema: z.object({
		course: z.string(),
		slug: z.string(),
		title: z.string(),
		description: z.string().optional(),
		order: z.number().int().nonnegative(),
		lang: z.enum(['es', 'en']),
		published: z.boolean().default(true),
	}),
});
```

`lessons` glob `**/*.md` would normally also match `index.md`; we exclude `index.md` from the lessons set by filtering in `getLessonsForCourse` (entry id contains a path segment with the lesson stem, not `index`). A cleaner alternative is `loader: glob({ pattern: '**/*.+(es|en).md', base: './src/content/courses' })` which matches only the locale-split lesson pairs (since `index.md` has no `.es.md`/`.en.md` suffix). **Decision: use the `**/*.+(es|en).md` pattern** — sharper, prevents accidental `index.md` pickup, and aligns with the locale-split filename convention enforced by the spec. If any legacy `index.md` lacks the suffix it simply won't load — intended.

Migrated `articles` schema (drop `_en` siblings):

```ts
const articles = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/articles',
		generateId: generateArticleId,
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		date: z.coerce.date(),
		author: z.string().default('Facundo Uferer'),
		category: z.string(),
		tags: z.array(z.string()).min(1),
		excerpt: z.string(),
		readingTime: z.number().int().positive(),
		image: z.string().optional(),
		lang: z.enum(['es', 'en', 'both']).default('es'),
		published: z.boolean().default(true),
		featured: z.boolean().default(false),
		doi: z.string().optional(),
	}),
});
```

Export: `export const collections = { projects, articles, courses, lessons };`

## Helper APIs

`src/utils/courses.ts` — mirrors the style of `src/utils/articles.ts`:

```ts
import type { CollectionEntry } from 'astro:content';

type Locale = 'es' | 'en';
type CourseEntry = CollectionEntry<'courses'>;
type LessonEntry = CollectionEntry<'lessons'>;

export function getCoursesForLocale(
	entries: CourseEntry[],
	locale: Locale,
): CourseEntry[] {
	// Returns entries where published === true AND (lang === locale OR lang === 'both')
	// Sorted by (technology, slug) ascending per spec.
}

export function resolveCourseEntry(
	entries: CourseEntry[],
	slug: string,
	locale: Locale,
	fallbackLocale?: Locale,
): CourseEntry | undefined {
	// Finds by slug among published entries; prefers lang === locale, then 'both', then fallbackLocale.
	// Returns undefined for nonexistent slug (route renders 404 upstream — no throw).
}

export function getCourseSlugsForLocale(
	entries: CourseEntry[],
	locale: Locale,
): string[] {
	// Returns slug list from getCoursesForLocale(...).
}

export function getLessonsForCourse(
	lessons: LessonEntry[],
	courseSlug: string,
	locale: Locale,
): LessonEntry[] {
	// Returns lessons where course === courseSlug AND lang === locale AND published === true
	// Sorted by order ascending.
	// Returns [] if courseSlug doesn't match any lesson (no throw — referential integrity per spec).
}
```

`src/utils/articles.ts` helpers retain their current signatures (`getArticlesForLocale`, `resolveArticleEntry`, `getArticleSlugsForLocale`, `getArticlePreviewImage`). The `lang === 'both'` branch is retained per `articles-content-model` delta (unused after migration but kept for backward compat).

## Routing Layout

```
src/pages/
├── index.astro                          ← /            (es home, unchanged)
├── proyectos.astro                      ← /proyectos   (unchanged)
├── articulos/
│   ├── index.astro                      ← /articulos
│   └── [slug].astro                     ← /articulos/<slug>
├── cursos/                              ← NEW
│   ├── index.astro                      ← /cursos
│   ├── [course].astro                   ← /cursos/<course>
│   └── [course]/
│       └── [lesson].astro                ← /cursos/<course>/<lesson>
├── en/
│   ├── index.astro                      ← /en/
│   ├── projects.astro                   ← /en/projects
│   ├── articles/
│   │   ├── index.astro                  ← /en/articles
│   │   └── [slug].astro                 ← /en/articles/<slug>
│   └── courses/                         ← NEW
│       ├── index.astro                  ← /en/courses
│       ├── [course].astro                ← /en/courses/<course>
│       └── [course]/
│           └── [lesson].astro            ← /en/courses/<course>/<lesson>
```

| URL | Page file | Notes |
|-----|-----------|-------|
| `/cursos` | `src/pages/cursos/index.astro` | Lists published es courses sorted by `(technology, slug)` |
| `/cursos/<course>` | `src/pages/cursos/[course].astro` | Course detail + ordered es lessons; 404 for unknown slug |
| `/cursos/<course>/<lesson>` | `src/pages/cursos/[course]/[lesson].astro` | Lesson body; 404 if lesson's `course` ≠ URL `<course>` or slug unknown |
| `/en/courses` | `src/pages/en/courses/index.astro` | English catalog |
| `/en/courses/<course>` | `src/pages/en/courses/[course].astro` | English detail |
| `/en/courses/<course>/<lesson>` | `src/pages/en/courses/[course]/[lesson].astro` | English lesson |

`getStaticPaths` for `[course]`: emits one path per `getCoursesForLocale(courses, locale)` slug. For `[lesson]`: emits one path per `(courseSlug, lessonSlug)` from `getLessonsForCourse(lessons, courseSlug, locale)` — this naturally rejects cross-course lesson URLs because the lesson's `course` field must equal `courseSlug` to be emitted.

## i18n Runtime Migration

Step-by-step (Slice A — behavior-preserving):

1. **Extract current UI strings** from `src/seo/meta.ts` (`SEO.es`/`SEO.en`) and `src/i18n/translations.ts` (`nav`, `home`) into `src/i18n/es.json` + `src/i18n/en.json` using the JSON shape above. Add `nav.courses` + `seo.courses.*` + `courses.*` keys for the new pages (added in Slice C).
2. **Drop the `Astro i18n` runtime wiring check** — confirm `astro.config.mjs` already declares `i18n` with `defaultLocale: 'es'`, `locales: ['es','en']`. Astro auto-generates `getLangFromUrl`/`useTranslations` from this config; no extra import wiring needed. No changes to `astro.config.mjs`.
3. **Per page/component**: replace `const locale = 'es'` (for label rendering) with `import { getLangFromUrl, useTranslations } from 'astro:i18n'; const lang = getLangFromUrl(Astro.url); const t = useTranslations(lang);` Replace `SEO.es.foo` reads with `t('seo.foo')`. Replace inline `locale === 'es' ? '<label>' : '<label>'` UI-label conditionals with `t('<key>')` (data-field conditionals stay).
4. **`BaseLayout.astro`**: `const locale = Astro.props.locale ?? getLangFromUrl(Astro.url);` — keeps explicit override for edge cases.
5. **Behavior-preservation snapshot**: golden test fixture `tests/__snapshots__/i18n-migration/*.html` captures the rendered HTML of each existing page (home es/en, proyectos es/en, articulos index es/en, one article es/en) before the refactor. After refactor, `tests/i18n-runtime.test.mjs` parses each snapshot and asserts the visible text keys (title, description, nav labels, hero copy) are unchanged. Snapshot baseline locked in commit 1 of Slice A; assertions in commit 2.
6. **Delete** `src/i18n/translations.ts`, `src/i18n/paths.ts`, `src/seo/meta.ts` once no production import remains. Verify with `rg "from '@/i18n/(translations|paths)'" src/` and `rg "from '../seo/meta'|from '../../seo/meta'" src/` returning no matches (test fixtures excluded).
7. **`<html lang>` + hreflang integrity**: `BaseLayout.astro` already emits these from `SITE_LANGUAGES[locale]`; the snapshot test asserts `<html lang="es-AR">` (es pages) and `<html lang="en">` (en pages) plus hreflang link tags unchanged.

## Test Plan

Strict TDD — each slice commits failing (red) tests first, then implementation, then green.

| Test file | Spec requirement | Action |
|-----------|-------------------|--------|
| `tests/courses-schema.test.mjs` (new) | `courses-content-model` — Courses + Lessons collections schemas | Red→green: assert `content.config.ts` defines `courses` + `lessons` with required fields; assert zod rejects missing `title_en` (course) and non-int `order` (lesson); assert lesson `.es.md` file has no `title_en`/`description_en` |
| `tests/courses-filename-normalization.test.mjs` (new) | `courses-content-model` — Lesson Filename Normalization | Red→green: assert no filename under `src/content/courses/` contains spaces or `prinicpio`; assert each lesson has `.es.md` + `.en.md` sibling with shared slug; assert unique numeric prefix per course |
| `tests/courses-helpers.test.mjs` (new) | `courses-content-model` — Courses Helpers | Red→green: assert `getCoursesForLocale(entries, 'en')` returns only `lang==='en'||'both'` + published; assert `getLessonsForCourse(lessons, 'javascript', 'es')` returns 11 published es lessons sorted by `order` asc; assert referential integrity (unknown `course` → empty list, no throw) |
| `tests/courses-catalog.test.mjs` (new) | `courses-catalog` — Catalog Page | Red→green: assert `/cursos` + `/en/courses` pages exist and call `getCoursesForLocale`; assert `CourseCard.astro` renders logo/title/description/difficulty + link; assert unpublished courses hidden |
| `tests/courses-detail-routing.test.mjs` (new) | `courses-catalog` — Course Detail + Lesson Page | Red→green: assert `[course].astro` + `[course]/[lesson].astro` exist for es + en; assert `getStaticPaths` emits only `(course, lesson)` pairs where `lesson.course === course` (cross-course URL → 404); assert unknown course slug → 404 |
| `tests/courses-assets.test.mjs` (new) | `courses-content-model` — Course Logos | Red→green: assert `public/img/courses/<slug>/logo.svg` exists for all 4 courses; assert no `logo.svg` remains under `src/content/courses/`; assert course detail `<img src>` equals `/img/courses/<slug>/logo.svg` |
| `tests/i18n-runtime.test.mjs` (new) | `ui-i18n-runtime` — Dictionaries + useTranslations | Red→green: assert `src/i18n/es.json` + `en.json` exist with `nav`, `home`, `seo` keys; assert `nav.courses` resolves to `Cursos`/`Courses`; assert pages use `getLangFromUrl(Astro.url)` (grep for hardcoded `locale="es"` removed where it was for label rendering); golden snapshot assertion |
| `tests/i18n-deprecation.test.mjs` (new) | `ui-i18n-runtime` — Deprecate translations.ts/paths.ts | Red→green: assert `src/i18n/translations.ts` + `paths.ts` + `seo/meta.ts` do not exist; assert no production import (`rg` matches zero in `src/` excluding tests) |
| `tests/issue-10-content-schema.test.mjs` (modified) | `articles-content-model` | Update: drop assertion implying `title_en`/`excerpt_en` are in the schema (lines 5–12 only check collection names + `readingTime` + `lang` + `generateId` — none reference `_en`, so likely no change needed; verify). The article count assertion (line 17) stays at 32. |
| `tests/issue-14-articles-listing.test.mjs` (modified) | articles (touched indirectly) | No change — assertions about `ArticlesCatalog`/`ArticleCard`/`getArticlePreviewImage` remain valid. Verify `ArticleCard.astro` still matches `article.image` + `<img>` + `article-card-image` (it does after migration — `image` field unchanged). |
| `tests/issue-28-localized-article-routing.test.mjs` (modified) | `articles-content-model` — Helpers Updated | Update: the test greps `item.data.lang === 'both'` in `articles.ts` — that stays (branch retained). No change expected. Verify after migration. |
| `tests/issue-9-i18n-routing.test.mjs` (modified) | `ui-i18n-runtime` deprecation | Update: line 27–33 reads `src/i18n/translations.ts` and asserts `export const translations` + `es:` + `en:` + `home:`. Replaces with reading `src/i18n/es.json` + `en.json` and asserting `home` key present in both. Required routes list (lines 5–14) unchanged. |
| `tests/issue-16-seo.test.mjs` (review) | SEO meta | Sweep — verify it doesn't grep `SEO.es`/`SEO.en` directly; if it does, update to read JSON. Listed as a sweep target. |
| `tests/issue-17-article-language-fallback.test.mjs` (review) | articles fallback | Sweep — verify the `lang === 'both'` fallback assertion still holds. |
| `tests/issue-31-seo-aeo-geo.test.mjs` (review) | SEO | Sweep — verify no `SEO.es` direct read. |
| `tests/hero-visual-style.test.mjs`, `tests/language-switch-flags.test.mjs`, `tests/issue-25-testimonials.test.mjs` (review) | UI labels | Sweep — these touch components with label conditionals; verify they don't break when conditionals become `t()` calls. |
| `tests/site-nav-courses.test.mjs` (new) | `site-navigation` — NAVIGATION | Red→green: assert `NAVIGATION.es` has 4 entries in order `Proyectos, Articulos, Cursos, Sobre mi`; assert `NAVIGATION.en` has 4 entries `Projects, Articles, Courses, About`; assert `Cursos` href `/cursos`, `Courses` href `/en/courses`; assert `nav.courses` JSON key resolves correctly |

Tests requiring update across slices are committed in the same slice as the behavior change (strict TDD + no cross-PR behavior/test split per proposal).

## Migration Risks & Sequencing

Slice boundaries confirmed per proposal. Each slice ships with green `npm test` + `npm run astro -- check`.

**Slice A — i18n refactor (~250–350 lines)**
- Files touched: `src/i18n/es.json` (new), `src/i18n/en.json` (new), `src/layouts/BaseLayout.astro` (locale derivation), every page+component with hardcoded `locale=` for labels (full list above), `src/seo/meta.ts` (delete), `src/i18n/translations.ts` (delete), `src/i18n/paths.ts` (delete).
- Tests added/modified: `tests/i18n-runtime.test.mjs` (new), `tests/i18n-deprecation.test.mjs` (new), `tests/issue-9-i18n-routing.test.mjs` (modified), golden snapshot under `tests/__snapshots__/i18n-migration/`.
- Risk: missed UI string → wrong-locale render. Mitigation: golden snapshot locked before refactor; `astro check` green at every commit.
- Verification: `npm test` + `npm run astro -- check`. No content files touched.

**Slice B — courses content layer + articles schema migration (~900–1200 lines)**
- Files touched: `src/content.config.ts` (add `courses` + `lessons`, drop article `_en` fields), `src/utils/courses.ts` (new), `scripts/migrate-articles-locale-own.mjs` (new, one-shot), all 32 article `.es.md` + 32 `.en.md` files (strip `title_en`/`excerpt_en`), `src/content/courses/**` (rename lessons to kebab-case + `.es.md`/`.en.md` split + English translation of all 58 lessons + 4 indexes), `src/content/courses/<course>/logo.svg` → `public/img/courses/<course>/logo.svg` (move), `src/components/ArticleCard.astro` + `src/pages/en/articles/[slug].astro` (switch from `entry.data.title_en`/`excerpt_en` to resolving the English sibling entry).
- Tests added/modified: `tests/courses-schema.test.mjs`, `tests/courses-filename-normalization.test.mjs`, `tests/courses-helpers.test.mjs`, `tests/courses-assets.test.mjs` (new); `tests/issue-10-content-schema.test.mjs` (verify), `tests/issue-14-articles-listing.test.mjs` (verify), `tests/issue-28-localized-article-routing.test.mjs` (verify).
- Risk: article schema migration breaks tests until red→green completes in SAME slice; translation tone drift across 58 lessons. Mitigation: ordered TDD within slice (schema test first → migrate files → helper tests → translation committed last); Spanish bodies preserved verbatim, English glossary enforced.
- Verification: `npm test` + `npm run astro -- check`.

**Slice C — Spanish courses pages (~350–500 lines)**
- Files touched: `src/pages/cursos/index.astro`, `src/pages/cursos/[course].astro`, `src/pages/cursos/[course]/[lesson].astro` (new), `src/components/CourseCard.astro`, `src/components/LessonsList.astro`, `src/components/CourseBreadcrumb.astro` (new), `src/config/site.ts` (NAVIGATION es+en Courses entry), `src/i18n/es.json` + `en.json` (add `courses.*` keys).
- Tests added: `tests/courses-catalog.test.mjs`, `tests/courses-detail-routing.test.mjs` (es scenarios), `tests/site-nav-courses.test.mjs`.
- Risk: nav count change breaks nav-count tests. Mitigation: update nav-count test in same slice.
- Verification: `npm test` + `npm run astro -- check`.

**Slice D — English mirror + full test suite update (~250–400 lines)**
- Files touched: `src/pages/en/courses/**` (new mirror tree), `src/i18n/en.json` (finalize `courses.*` English values).
- Tests added/modified: extend `tests/courses-catalog.test.mjs` + `tests/courses-detail-routing.test.mjs` with en scenarios; sweep remaining `tests/issue-*.test.mjs` for nav-count or article-field assumptions.
- Risk: en-specific rendering drift. Mitigation: en tests mirror es assertions 1-1.
- Verification: full `npm test` + `npm run astro -- check`.

## Open Design Questions

None blocking. All design decisions above are settled and traceable to a spec delta:
- Locale-own split-files → `courses-content-model` delta (lessons) + `articles-content-model` delta (articles).
- Course index bilingual → `courses-content-model` delta (design decision note).
- Articles destructive migration → `articles-content-model` delta ("Schema Migration Step" scenario).
- `lang: 'both'` on course index → derived from helper predicate uniformity; consistent with existing article `lang: 'both'` branch.
- Delete `translations.ts`/`paths.ts`/`meta.ts` → `ui-i18n-runtime` delta explicit mandate.

## Constraints Applied

- No new dependencies (no Paraglide, no `@nanostores/i18n`, no YAML parser — the article migration script uses a minimal regex/light-YAML approach).
- Match existing zod import style in `src/content.config.ts` (`import { defineCollection, z } from 'astro:content';`, `glob` from `astro/loaders`).
- npm only per AGENTS.md (`pnpm-lock.yaml` is deprecated); no `pnpm` invocation.
- ESM only (consistent with `package.json` `"type": "module"`).
- Strict TypeScript (`astro/tsconfigs/strict`) — all new `.ts` helpers have explicit parameter and return types; no `any`.
- Tab indentation in `.astro` markup/style (matches existing files).
- Single quotes in script sections (matches existing files).
- All new test files use `node:test` + `node:assert/strict` (matches existing tests).