# Tasks: Courses i18n Refactor

> Change: `courses-i18n-refactor`. Slice plan confirmed at design phase: A (i18n refactor) → B (courses content layer + article schema migration) → C (Spanish courses pages + nav) → D (English mirror). Strict TDD per slice; `npm test` + `npm run astro -- check` green at every slice boundary.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1800–2500 (A ~300–500, B ~1200–1500, C ~200–300, D ~100–200) |
| Lines per slice | A ~400, B ~1500, C ~250, D ~150 |
| 400-line budget risk | High (slice B alone exceeds 400 by ~3× due to 58 lessons × 2 locales) |
| Chained PRs recommended | Yes |
| Suggested split | PR A → PR B → PR C → PR D (one per slice, linear stack) |
| Delivery strategy | ask-always |
| Chain strategy | pending — orchestrator must confirm with user (stacked-to-main vs feature-branch-chain vs size-exception) |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| A | i18n runtime refactor (behavior-preserving): JSON dictionaries + `useTranslations` adoption; deprecate `translations.ts`/`paths.ts`/`meta.ts`; golden snapshot baseline locked before any UI string moves | PR A (base: main) | `npm test -- tests/i18n-runtime.test.mjs && npm test -- tests/i18n-deprecation.test.mjs && npm run astro -- check` | `npm run build` then diff rendered `/<html lang>` against `tests/__snapshots__/i18n-baseline.json` | revert Slice A merge commit — restores `translations.ts`/`paths.ts`/`seo/meta.ts` and `locale=` prop threading; no content files touched |
| B | courses + lessons collections; `src/utils/courses.ts`; lesson filename normalization; `.es.md`/`.en.md` split + EN translation of all 58 lessons + 4 indexes; article locale-own migration (strip `title_en`/`excerpt_en`); logos → `public/img/courses/<slug>/` | PR B (base: PR A) | `npm test -- tests/courses-schema.test.mjs && npm test -- tests/courses-filename-normalization.test.mjs && npm test -- tests/courses-helpers.test.mjs && npm test -- tests/courses-assets.test.mjs && npm test -- tests/issue-10-content-schema.test.mjs && npm run astro -- check` | `npm run build` — collections load with no schema errors (no pages yet) | revert PR B — restores `src/content.config.ts`, `src/utils/courses.ts` removed, raw `.md` files restored from git (`git mv` history preserved), logos moved back, article `_en` fields restored |
| C | Spanish courses routes (`/cursos`, `/cursos/[course]`, `/cursos/[course]/[lesson]`); `CourseCard`/`LessonsList`/`CourseBreadcrumb` components; `NAVIGATION.es` `Cursos` entry + `nav.courses` JSON key | PR C (base: PR B) | `npm test -- tests/courses-catalog.test.mjs && npm test -- tests/courses-detail-routing.test.mjs && npm test -- tests/site-nav-courses.test.mjs && npm run astro -- check` | `npm run dev` then open `/cursos`, `/cursos/java`, `/cursos/java/01-introduccion` | revert PR C — removes pages + components + nav entry; courses content remains unused but present (orphan state restored) |
| D | English mirror tree `src/pages/en/courses/**`; `NAVIGATION.en` `Courses` entry; full `npm test` + `npm run astro -- check` + `npm run build` green | PR D (base: PR C) | `npm test && npm run astro -- check && npm run build` | `npm run preview` then open `/en/courses`, `/en/courses/java`, `/en/courses/java/01-introduccion` | revert PR D — removes EN mirror; Spanish coverage from PR C stays intact |

## Slice A — i18n Runtime Refactor (behavior-preserving)

> Implements `ui-i18n-runtime` delta (all requirements). No content files touched. Golden snapshot baseline MUST be locked from current pre-migration render BEFORE any UI string is moved — step order inside A is critical.

- [x] T A-1: Audit UI strings — extract current strings from `src/seo/meta.ts` (`SEO.es`/`SEO.en`) and `src/i18n/translations.ts` (`nav`, `home`) into a flat inventory; document inline list of `(current location, new JSON key, es value, en value)`. Add `nav.courses` + `seo.courses.*` + `courses.*` keys as planned-but-unfilled rows.
  - Files: none (audit doc inline in task / commit message)
  - Tests: none
  - Depends on: —
  - Verifies: manual (audit reviewed)
- [x] T A-2: Capture golden snapshot baseline from CURRENT pre-migration render — run `npm run build` against pristine HEAD, extract `<title>` + `<h1>` + nav labels + `<html lang>` + hreflang from `/`, `/en/`, `/proyectos`, `/en/projects`, `/articulos`, `/en/articles`, one article es/en, and write to `tests/__snapshots__/i18n-baseline.json`.
  - Files: `tests/__snapshots__/i18n-baseline.json` (new)
  - Tests: `tests/__snapshots__/i18n-baseline.json` itself (baseline)
  - Depends on: T A-1
  - Verifies: manual (file exists + non-empty); baseline MUST be locked before T A-3
- [x] T A-3: Write `tests/i18n-runtime.test.mjs` (RED) — asserts dictionaries `src/i18n/es.json` + `en.json` exist with `nav`, `home`, `seo` keys; asserts `getLangFromUrl(new URL('/'))` → `'es'`, `getLangFromUrl(new URL('/en/articles/foo'))` → `'en'`; asserts `useTranslations('es')('nav.projects')` → `'Proyectos'`, `useTranslations('en')('nav.courses')` → `'Courses'`, `useTranslations('es')('nav.courses')` → `'Cursos'`; asserts golden snapshot in `tests/__snapshots__/i18n-baseline.json` matches post-migration render output. Implements: `ui-i18n-runtime` reqs `UI String Dictionaries`, `Astro-native useTranslations Adoption`, `Behavior-preservation Snapshot`, `<html lang>`/hreflang `Integrity`.
  - Files: `tests/i18n-runtime.test.mjs` (new)
  - Tests: `tests/i18n-runtime.test.mjs`
  - Depends on: T A-2
  - Verifies: `npm test -- tests/i18n-runtime.test.mjs` (RED expected)
- [x] T A-4: Write `tests/i18n-deprecation.test.mjs` (RED) — asserts `src/i18n/translations.ts`, `src/i18n/paths.ts`, `src/seo/meta.ts` do NOT exist; asserts `rg "from '@/i18n/(translations|paths)'" src/` and `rg "from '\\.\\./seo/meta'|from '../../seo/meta'" src/` return zero matches (test fixtures excluded); asserts `rg "Proyectos|Articulos|Sobre mi" src/seo/meta.ts` is a no-match (file absent). Implements: `ui-i18n-runtime` reqs `Deprecate translations.ts and paths.ts`, `Migration completeness`.
  - Files: `tests/i18n-deprecation.test.mjs` (new)
  - Tests: `tests/i18n-deprecation.test.mjs`
  - Depends on: T A-1
  - Verifies: `npm test -- tests/i18n-deprecation.test.mjs` (RED expected)
- [x] T A-5: Write `src/i18n/es.json` + `src/i18n/en.json` (GREEN for A-3 dictionaries) using the audited inventory from T A-1 — hierarchical keys `nav.*`, `home.*`, `seo.*`, `courses.*` (courses values seeded but consumed only in slices C/D).
  - Files: `src/i18n/es.json` (new), `src/i18n/en.json` (new)
  - Tests: `tests/i18n-runtime.test.mjs` (dictionaries portion goes GREEN)
  - Depends on: T A-1, T A-3
  - Verifies: `npm test -- tests/i18n-runtime.test.mjs` (partial GREEN — dictionaries pass, snapshot still RED until A-6)
- [x] T A-6: Update `src/layouts/BaseLayout.astro` to derive `locale` via `getLangFromUrl(Astro.url)` when not explicitly passed; update every page under `src/pages/` that hardcoded `locale="es"`/`locale="en"` for label rendering (`index.astro`, `en/index.astro`, `proyectos.astro`, `en/projects.astro`, `articulos/index.astro`, `en/articles/index.astro`, `articulos/[slug].astro`, `en/articles/[slug].astro`, `ArticleLayout.astro`); replace `SEO.es.X`/`SEO.en.X` reads with `useTranslations(lang)('seo.X')`; replace inline `locale === 'es' ? '<label>' : '<label>'` UI-label conditionals in components (`Hero`, `ValueProp`, `FeaturedProjects`, `FeaturedArticles`, `About`, `Certifications`, `Contact`, `Toolchain`, `Process`, `ArticleCard`, `ProjectCard`, `ArticlesCatalog`, `ProjectsCatalog`, `SiteHeader` `hireLabel`) with `t('<key>')`; preserve `esPath`/`enPath` props on `LanguageSwitch` and data-field conditionals (`title` vs `title_en`) per spec. Implements: `ui-i18n-runtime` reqs `Astro-native useTranslations Adoption`, `No Inline Locale Conditional Labels`.
  - Files: `src/layouts/BaseLayout.astro`, `src/layouts/ArticleLayout.astro`, `src/pages/index.astro`, `src/pages/en/index.astro`, `src/pages/proyectos.astro`, `src/pages/en/projects.astro`, `src/pages/articulos/index.astro`, `src/pages/en/articles/index.astro`, `src/pages/articulos/[slug].astro`, `src/pages/en/articles/[slug].astro`, `src/components/Hero.astro`, `src/components/ValueProp.astro`, `src/components/FeaturedProjects.astro`, `src/components/FeaturedArticles.astro`, `src/components/About.astro`, `src/components/Certifications.astro`, `src/components/Contact.astro`, `src/components/Toolchain.astro`, `src/components/Process.astro`, `src/components/ArticleCard.astro`, `src/components/ProjectCard.astro`, `src/components/ArticlesCatalog.astro`, `src/components/ProjectsCatalog.astro`, `src/components/SiteHeader.astro`
  - Tests: `tests/i18n-runtime.test.mjs` (snapshot portion goes GREEN)
  - Depends on: T A-5
  - Verifies: `npm test -- tests/i18n-runtime.test.mjs` (GREEN), `npm run astro -- check`
- [x] T A-7: Delete `src/i18n/translations.ts`, `src/i18n/paths.ts`, `src/seo/meta.ts` (GREEN for A-4); confirm zero production imports via `rg "from '@/i18n/(translations|paths)'" src/` and `rg "seo/meta" src/` (test fixtures excluded).
  - Files: `src/i18n/translations.ts` (delete), `src/i18n/paths.ts` (delete), `src/seo/meta.ts` (delete)
  - Tests: `tests/i18n-deprecation.test.mjs` (GREEN)
  - Depends on: T A-6
  - Verifies: `npm test -- tests/i18n-deprecation.test.mjs` (GREEN), `rg` returns no matches
- [x] T A-8: Update `tests/issue-9-i18n-routing.test.mjs` (RED→GREEN) — replace lines 27–33 that read `src/i18n/translations.ts` (`export const translations`, `es:`, `en:`, `home:`) with assertions reading `src/i18n/es.json` + `en.json` and asserting `home` key present in both; required routes list (lines 5–14) unchanged. Same task pair: write RED assertion first, then it goes GREEN because A-5 already wrote the JSON files.
  - Files: `tests/issue-9-i18n-routing.test.mjs` (modified)
  - Tests: `tests/issue-9-i18n-routing.test.mjs`
  - Depends on: T A-5
  - Verifies: `npm test -- tests/issue-9-i18n-routing.test.mjs` (GREEN after A-5)
- [x] T A-9: Sweep `tests/issue-16-seo.test.mjs`, `tests/issue-31-seo-aeo-geo.test.mjs`, `tests/hero-visual-style.test.mjs`, `tests/language-switch-flags.test.mjs`, `tests/issue-25-testimonials.test.mjs`, `tests/issue-17-article-language-fallback.test.mjs` — if any grep `SEO.es`/`SEO.en` directly or assert UI labels via hardcoded strings, update to read JSON or remove the brittle assertion. Mark as review list per design.md.
  - Files: `tests/issue-16-seo.test.mjs`, `tests/issue-31-seo-aeo-geo.test.mjs`, `tests/hero-visual-style.test.mjs`, `tests/language-switch-flags.test.mjs`, `tests/issue-25-testimonials.test.mjs`, `tests/issue-17-article-language-fallback.test.mjs` (modified only if they break)
  - Tests: each swept file
  - Depends on: T A-6, T A-7
  - Verifies: `npm test` (full), `npm run astro -- check`
- [x] T A-10: Run full suite + check — confirm no regressions and snapshot baseline matches pre-migration HTML.
  - Files: none
  - Tests: —
  - Depends on: T A-8, T A-9
  - Verifies: `npm test`, `npm run astro -- check`
- [x] T A-11: Update `AGENTS.md` to reflect new i18n usage — deprecate `translations.ts`/`paths.ts` references, document `useTranslations(getLangFromUrl(Astro.url))` as the canonical UI string surface, document `src/i18n/es.json`/`en.json` JSON structure (hierarchical keys `nav`/`home`/`seo`/`courses`) as the canonical UI string source, and the rule that no production UI string may live in `src/seo/` or inline component conditionals. Note: AGENTS.md §6.9 articles rules also need update but that is tracked in B-10.
  - Files: `AGENTS.md`
  - Tests: —
  - Depends on: T A-10
  - Verifies: manual (doc review)

## Slice B — Courses Content Layer + Article Schema Migration + Logos

> Implements `courses-content-model` delta (all requirements) + `articles-content-model` delta (modified schema + helpers updated + tests updated). No pages yet. Largest slice; translation bulk is the bulk of the diff.

- [ ] T B-1: Write `tests/courses-schema.test.mjs` (RED) — asserts `src/content.config.ts` exports `collections.courses` + `collections.lessons`; asserts valid course `index.md` fixture passes zod; asserts invalid fixtures fail (missing `title_en`, missing `description`, bad `lang` enum); asserts valid lesson fixture passes; asserts `order: 1.5` rejected as non-integer; asserts lesson `.es.md` fixture has no `title_en`/`description_en`. Implements: `courses-content-model` reqs `Courses Collection Schema`, `Lessons Collection Schema`, `Locale-split Lesson Files`.
  - Files: `tests/courses-schema.test.mjs` (new), `tests/fixtures/courses/` (new valid + invalid fixtures)
  - Tests: `tests/courses-schema.test.mjs`
  - Depends on: T A-10 (slice A landed for clean base)
  - Verifies: `npm test -- tests/courses-schema.test.mjs` (RED expected)
- [ ] T B-2: Add `courses` + `lessons` collections to `src/content.config.ts` (GREEN for B-1) — zod schemas exactly per design.md; `courses` glob `**/index.md`; `lessons` glob `**/*.+(es|en).md` (sharp pattern that excludes `index.md`); export `collections = { projects, articles, courses, lessons }`. Implements: `courses-content-model` reqs `Courses Collection Schema`, `Lessons Collection Schema`.
  - Files: `src/content.config.ts` (modified)
  - Tests: `tests/courses-schema.test.mjs` (GREEN)
  - Depends on: T B-1
  - Verifies: `npm test -- tests/courses-schema.test.mjs` (GREEN), `npm run astro -- check`
- [ ] T B-3: Write `tests/courses-helpers.test.mjs` (RED) — asserts `getCoursesForLocale(entries, 'en')` returns only entries with `lang === 'en' || 'both'` AND `published: true`, sorted by `(technology, slug)` asc; asserts ` getCoursesForLocale(entries, 'es')` includes `lang === 'both'`; asserts `resolveCourseEntry` prefers matching locale then `both` then fallback, returns `undefined` for nonexistent slug (no throw); asserts `getLessonsForCourse(lessons, 'javascript', 'es')` returns 11 published es lessons sorted by `order` asc; asserts `getLessonsForCourse` with unknown `course` returns `[]` (referential integrity, no throw); asserts `getCourseSlugsForLocale` returns slug list from `getCoursesForLocale`. Implements: `courses-content-model` req `Courses Helpers in src/utils/courses.ts`.
  - Files: `tests/courses-helpers.test.mjs` (new), `tests/fixtures/courses/` (fixture entries if not yet real content)
  - Tests: `tests/courses-helpers.test.mjs`
  - Depends on: T B-2
  - Verifies: `npm test -- tests/courses-helpers.test.mjs` (RED expected)
- [ ] T B-4: Write `src/utils/courses.ts` (GREEN for B-3) — implement `getCoursesForLocale`, `resolveCourseEntry`, `getCourseSlugsForLocale`, `getLessonsForCourse` with exact signatures from design.md; explicit `Locale`/`CourseEntry`/`LessonEntry` types; no `any`; tab indentation matching `articles.ts`.
  - Files: `src/utils/courses.ts` (new)
  - Tests: `tests/courses-helpers.test.mjs` (GREEN)
  - Depends on: T B-3
  - Verifies: `npm test -- tests/courses-helpers.test.mjs` (GREEN), `npm run astro -- check`
- [ ] T B-5: Normalize lesson filenames — kebab-case across all 4 courses including fix `git/01-El prinicpio con git.md` → `git/01-el-principio-con-git.md`; ensure unique numeric prefix per course; use `git mv` to preserve history. Mechanical; no test beyond schema validation that lessons still load with the `.es.md`/`.en.md` suffix convention (validation deferred to B-6 completion). Implements: `courses-content-model` req `Lesson Filename Normalization`.
  - Files: `src/content/courses/**/*.md` (renamed)
  - Tests: none standalone (covered after B-6 + B-7 by `tests/courses-filename-normalization.test.mjs`)
  - Depends on: T B-4
  - Verifies: manual (`ls src/content/courses/**` confirms kebab + no spaces + no `prinicpio`)
- [ ] T B-6: Write `tests/courses-filename-normalization.test.mjs` (RED) — asserts no filename under `src/content/courses/` contains spaces or `prinicpio`; asserts each lesson has `.es.md` + `.en.md` sibling with shared stem; asserts unique numeric prefix per course; asserts `index.md` exists exactly once per course folder for all 4 courses. Implements: `courses-content-model` req `Lesson Filename Normalization`. Order: this RED test is written AFTER the mechanical B-5 rename but BEFORE the B-7 locale-split, so the `.es.md`/`.en.md` sibling assertion is initially RED and goes GREEN at B-7.
  - Files: `tests/courses-filename-normalization.test.mjs` (new)
  - Tests: `tests/courses-filename-normalization.test.mjs`
  - Depends on: T B-5
  - Verifies: `npm test -- tests/courses-filename-normalization.test.mjs` (RED on sibling assertion until B-7)
- [ ] T B-7: Locale-split each lesson — for all 58 lessons: move existing Spanish content to `NN-slug.es.md`, write English translation in `NN-slug.en.md` with matched `slug`/`course`/`order` + English `title`/`description`; same for the 4 course `index.md` files BUT keep `index.md` single bilingual frontmatter (NOT split — intentional asymmetry per design.md: indexes are short metadata mirroring projects). Sub-task estimate: 58 lessons × 2 locales + 4 indexes translated. Note scale here — this is the bulk of the slice B diff. Implements: `courses-content-model` reqs `Locale-split Lesson Files`, `Lessons Collection Schema` (data rows).
  - Files: `src/content/courses/c/**/*.md`, `src/content/courses/git/**/*.md`, `src/content/courses/java/**/*.md`, `src/content/courses/javascript/**/*.md` (split + translated)
  - Tests: `tests/courses-filename-normalization.test.mjs` (sibling assertion GREEN), `tests/courses-schema.test.mjs` (real content validates)
  - Depends on: T B-6
  - Verifies: `npm test -- tests/courses-filename-normalization.test.mjs`, `npm test -- tests/courses-schema.test.mjs`
- [ ] T B-8: enrich course `index.md` frontmatter for all 4 courses — add `slug`, `title`, `title_en`, `description`, `description_en`, `technology`, `difficulty`, `image: '/img/courses/<slug>/logo.svg'`, `published: true`, `featured: false`, `lang: 'both'`. Populate bilingual fields with real translated values (Spanish + English). Implements: `courses-content-model` req `Courses Collection Schema` (real rows).
  - Files: `src/content/courses/c/index.md`, `src/content/courses/git/index.md`, `src/content/courses/java/index.md`, `src/content/courses/javascript/index.md`
  - Tests: `tests/courses-schema.test.mjs`, `tests/courses-helpers.test.mjs`
  - Depends on: T B-7
  - Verifies: `npm test -- tests/courses-schema.test.mjs`, `npm test -- tests/courses-helpers.test.mjs`
- [ ] T B-9: Write `tests/courses-assets.test.mjs` (RED) — asserts `public/img/courses/<slug>/logo.svg` exists for all 4 courses (`c`, `git`, `java`, `javascript`); asserts no `logo.svg` remains under `src/content/courses/`; asserts each course `index.md` `image` field equals `/img/courses/<slug>/logo.svg`. Implements: `courses-content-model` req `Course Logos Live Under public/img`.
  - Files: `tests/courses-assets.test.mjs` (new)
  - Tests: `tests/courses-assets.test.mjs`
  - Depends on: T B-8
  - Verifies: `npm test -- tests/courses-assets.test.mjs` (RED expected)
- [ ] T B-10: Move course logos (GREEN for B-9) — `git mv src/content/courses/<course>/logo.svg public/img/courses/<course-slug>/logo.svg` for all 4 courses; create the `public/img/courses/<slug>/` folders. No other changes yet; `image` field consumption in pages belongs to slice C.
  - Files: `public/img/courses/c/logo.svg` (new path), `public/img/courses/git/logo.svg` (new path), `public/img/courses/java/logo.svg` (new path), `public/img/courses/javascript/logo.svg` (new path); `src/content/courses/<course>/logo.svg` (deleted from old location)
  - Tests: `tests/courses-assets.test.mjs` (GREEN)
  - Depends on: T B-9
  - Verifies: `npm test -- tests/courses-assets.test.mjs` (GREEN)
- [ ] T B-11: Update `tests/issue-10-content-schema.test.mjs` (RED) for the articles migration — drop assertions that `title_en`/`excerpt_en` live in the Spanish file (or are present at all); add assertions that Spanish files lack those fields and English files carry canonical `title`/`excerpt` (no `_en` suffix). Per design.md review of issue-10, the existing assertions check collection names + `readingTime` + `lang` + `generateId` only; this task may end up adding assertions rather than flipping — TDD discipline: write the new assertions so they go RED against current schema where they would fail, then B-12 makes them GREEN.
  - Files: `tests/issue-10-content-schema.test.mjs` (modified)
  - Tests: `tests/issue-10-content-schema.test.mjs`
  - Depends on: T B-10
  - Verifies: `npm test -- tests/issue-10-content-schema.test.mjs` (RED on new assertions)
- [ ] T B-12: Migrate article schema in `src/content.config.ts` (GREEN for B-11 schema portion) — drop `title_en` and `excerpt_en` as required fields from the `articles` zod schema per design.md migrated schema; keep `generateArticleId` and the `lang === 'both'` branch.
  - Files: `src/content.config.ts` (modified)
  - Tests: `tests/issue-10-content-schema.test.mjs` (schema portion GREEN)
  - Depends on: T B-11
  - Verifies: `npm test -- tests/issue-10-content-schema.test.mjs` (schema assertions GREEN)
- [ ] T B-13: Write `scripts/migrate-articles-locale-own.mjs` (one-shot, pure regex/YAML-light, no new dep) — strips `title_en` and `excerpt_en` keys from frontmatter of every `src/content/articles/*.es.md` + `.en.md` file; deterministic + re-runnable; logs any file that fails the regex (unusual quoting) for manual edit.
  - Files: `scripts/migrate-articles-locale-own.mjs` (new)
  - Tests: —
  - Depends on: T B-12
  - Verifies: `node scripts/migrate-articles-locale-own.mjs` (run + manual diff review)
- [ ] T B-14: Run the migration script (GREEN for B-11 file-level assertions) — strip `title_en`/`excerpt_en` from all 32 `.es.md` + 32 `.en.md` article files; for `.en.md` files keep `title`/`excerpt` as the canonical English fields (already correct, just drop the `_en` siblings); flag any file the regex can't parse for manual edit.
  - Files: `src/content/articles/*.es.md`, `src/content/articles/*.en.md` (all 64 files touched for frontmatter strip)
  - Tests: `tests/issue-10-content-schema.test.mjs` (file-level assertions GREEN)
  - Depends on: T B-13
  - Verifies: `npm test -- tests/issue-10-content-schema.test.mjs` (GREEN)
- [ ] T B-15: Update consumers of removed `_en` article fields — `src/components/ArticleCard.astro` and `src/pages/en/articles/[slug].astro` previously read `entry.data.title_en`/`excerpt_en` directly; switch them to resolve the English sibling entry via `resolveArticleEntry(entries, slug, 'en')` and read its `.title`/`.excerpt`. This is the runtime counterpart of B-12/B-14 and keeps `tests/issue-14-articles-listing.test.mjs` + `tests/issue-28-localized-article-routing.test.mjs` green.
  - Files: `src/components/ArticleCard.astro`, `src/pages/en/articles/[slug].astro`
  - Tests: `tests/issue-14-articles-listing.test.mjs`, `tests/issue-28-localized-article-routing.test.mjs`
  - Depends on: T B-14
  - Verifies: `npm test -- tests/issue-14-articles-listing.test.mjs && npm test -- tests/issue-28-localized-article-routing.test.mjs`
- [ ] T B-16: Run full suite + check after content layer changes — collections just exist (no pages yet); all schema + helpers + normalization + assets + article migration tests green.
  - Files: none
  - Tests: —
  - Depends on: T B-15
  - Verifies: `npm test`, `npm run astro -- check`
- [ ] T B-17: Update `AGENTS.md` §6.9 articles rules — document that `.es.md` and `.en.md` each carry only their own locale's `title`/`excerpt` (no `title_en`/`excerpt_en`); update the example frontmatter block; add a new §6.10 (or extend §6.9) documenting the `courses` + `lessons` collection conventions: bilingual `index.md` (single file with `title`/`title_en`/`description`/`description_en`/`technology`/`difficulty`/`image`/`lang: 'both'`), locale-split lessons (`NN-slug.es.md` + `NN-slug.en.md` with `course`/`slug`/`title`/`order`/`lang` only), asset convention `public/img/courses/<slug>/logo.svg`, and the `src/utils/courses.ts` helper contract. Per AGENTS.md §10 the spec is closed when this lands.
  - Files: `AGENTS.md`
  - Tests: —
  - Depends on: T B-16
  - Verifies: manual (doc review); `npm test` (no doc test should break)

## Slice C — Spanish Courses Pages + Nav

> Implements `courses-catalog` delta reqs `Course Catalog Page`, `Course Detail Page`, `Lesson Detail Page` (Spanish scenarios) + `site-navigation` delta (modified `NAVIGATION` Spanish + `Courses Nav Label Key` `nav.courses`). Spanish-only first to validate UX before mirror.

- [x] T C-1: Write `tests/courses-catalog.test.mjs` (RED, Spanish scenarios).
  - Files: `tests/courses-catalog.test.mjs` (new)
  - Tests: `tests/courses-catalog.test.mjs`
  - Depends on: T B-16
  - Verifies: `npm test -- tests/courses-catalog.test.mjs` (GREEN)
- [x] T C-2: Create `src/components/CourseCard.astro` (GREEN scaffolding).
  - Files: `src/components/CourseCard.astro` (new)
  - Tests: `tests/courses-catalog.test.mjs`
  - Depends on: T C-1
  - Verifies: `npm test -- tests/courses-catalog.test.mjs` (GREEN)
- [x] T C-3: Create `src/pages/cursos/index.astro` (GREEN for C-1).
  - Files: `src/pages/cursos/index.astro` (new)
  - Tests: `tests/courses-catalog.test.mjs`
  - Depends on: T C-2
  - Verifies: `npm test -- tests/courses-catalog.test.mjs` (GREEN), `npm run astro -- check`
- [x] T C-4: Write `tests/courses-detail-routing.test.mjs` (RED, Spanish scenarios).
  - Files: `tests/courses-detail-routing.test.mjs` (new)
  - Tests: `tests/courses-detail-routing.test.mjs`
  - Depends on: T C-3
  - Verifies: `npm test -- tests/courses-detail-routing.test.mjs` (GREEN)
- [x] T C-5: Create `src/components/LessonsList.astro` + `src/components/CourseBreadcrumb.astro` (GREEN scaffolding).
  - Files: `src/components/LessonsList.astro` (new), `src/components/CourseBreadcrumb.astro` (new)
  - Tests: `tests/courses-detail-routing.test.mjs`
  - Depends on: T C-4
  - Verifies: `npm test -- tests/courses-detail-routing.test.mjs` (GREEN)
- [x] T C-6: Create `src/pages/cursos/[course]/index.astro` + `src/pages/cursos/[course]/[lesson].astro` (GREEN for C-4). URL layout: nested `[course]/` directory with `index.astro` (not flat `[course].astro`), enabling clean `/cursos/<course>` + `/cursos/<course>/<lesson>` hierarchy.
  - Files: `src/pages/cursos/[course]/index.astro` (new), `src/pages/cursos/[course]/[lesson].astro` (new)
  - Tests: `tests/courses-detail-routing.test.mjs`
  - Depends on: T C-5
  - Verifies: `npm test -- tests/courses-detail-routing.test.mjs` (GREEN), `npm run astro -- check`
- [x] T C-7: Write `tests/site-nav-courses.test.mjs` (RED) — Spanish + English nav assertions.
  - Files: `tests/site-nav-courses.test.mjs` (new)
  - Tests: `tests/site-nav-courses.test.mjs`
  - Depends on: T C-6
  - Verifies: `npm test -- tests/site-nav-courses.test.mjs` (GREEN)
- [x] T C-8: Add `Cursos` entry to `NAVIGATION.es` and `Courses` to `NAVIGATION.en` in `src/config/site.ts` (GREEN for C-7).
  - Files: `src/config/site.ts` (modified)
  - Tests: `tests/site-nav-courses.test.mjs` (GREEN)
  - Depends on: T C-7
  - Verifies: `npm test -- tests/site-nav-courses.test.mjs` (GREEN)
- [x] T C-9: Sweep for nav-count tests — none found with hardcoded 3-entry assertion on `NAVIGATION.es`/`NAVIGATION.en`. No existing tests reference `.length` or `toHaveLength(3)`.
  - Files: none
  - Tests: —
  - Depends on: T C-8
  - Verifies: `npm test`
- [x] T C-10: Run full suite + check + build — Spanish courses fully browsable at `/cursos`, `/cursos/<course>`, `/cursos/<course>/<lesson>`.
  - Files: none
  - Tests: —
  - Depends on: T C-9
  - Verifies: `npm test`, `npm run astro -- check`, `npm run build`

## Slice D — English Mirror + Nav

> Implements `courses-catalog` delta English scenarios + `site-navigation` English scenario. Mirrors slice C 1-1. Merged with slice C in apply phase.

- [x] T D-1: English catalog tests included in `tests/courses-catalog.test.mjs` (asserts `/en/courses` exists with `getCoursesForLocale(_, 'en')`).
  - Files: `tests/courses-catalog.test.mjs`
  - Tests: `tests/courses-catalog.test.mjs`
  - Depends on: T C-10
  - Verifies: `npm test -- tests/courses-catalog.test.mjs` (GREEN)
- [x] T D-2: Create `src/pages/en/courses/index.astro` mirror.
  - Files: `src/pages/en/courses/index.astro` (new)
  - Tests: `tests/courses-catalog.test.mjs`
  - Depends on: T D-1
  - Verifies: `npm test -- tests/courses-catalog.test.mjs` (GREEN), `npm run astro -- check`
- [x] T D-3: English detail/lesson tests included in `tests/courses-detail-routing.test.mjs`.
  - Files: `tests/courses-detail-routing.test.mjs`
  - Tests: `tests/courses-detail-routing.test.mjs`
  - Depends on: T D-2
  - Verifies: `npm test -- tests/courses-detail-routing.test.mjs` (GREEN)
- [x] T D-4: Create `src/pages/en/courses/[course]/index.astro` + `src/pages/en/courses/[course]/[lesson].astro` mirrors.
  - Files: `src/pages/en/courses/[course]/index.astro` (new), `src/pages/en/courses/[course]/[lesson].astro` (new)
  - Tests: `tests/courses-detail-routing.test.mjs`
  - Depends on: T D-3
  - Verifies: `npm test -- tests/courses-detail-routing.test.mjs` (GREEN), `npm run astro -- check`
- [x] T D-5: English nav assertions included in `tests/site-nav-courses.test.mjs`.
  - Files: `tests/site-nav-courses.test.mjs`
  - Tests: `tests/site-nav-courses.test.mjs`
  - Depends on: T D-4
  - Verifies: `npm test -- tests/site-nav-courses.test.mjs` (GREEN)
- [x] T D-6: `NAVIGATION.en` Courses entry added in same C-8 change. No separate D-6 needed.
  - Files: `src/config/site.ts`
  - Tests: `tests/site-nav-courses.test.mjs` (GREEN)
  - Depends on: T D-5
  - Verifies: `npm test -- tests/site-nav-courses.test.mjs` (GREEN)
- [x] T D-7: Swept `tests/issue-*.test.mjs` — no nav-count tests found asserting 3-entry count for English.
  - Files: none
  - Tests: —
  - Depends on: T D-6
  - Verifies: `npm test`
- [ ] T D-9: Archive spec `courses-i18n-refactor` — move `openspec/changes/courses-i18n-refactor/` to `openspec/changes/archive/courses-i18n-refactor/` (or per project convention `specs/closed/`) once D-8 is green and all 5 spec deltas' success criteria are met. Verify against `proposal.md` Success Criteria checklist before moving.
  - Files: `openspec/changes/courses-i18n-refactor/` (moved)
  - Tests: —
  - Depends on: T D-8
  - Verifies: manual (success-criteria checklist review)

## Apply Order

Linear A → B → C → D, one slice per PR, each PR rebased on the previous before review.

Rationale and explicit dependencies:

- **A → B**: A and B are mostly independent (B's schemas + helpers do not import A's JSON or `useTranslations`). BUT slice C needs both A's `useTranslations`/`getLangFromUrl` runtime AND B's helpers + collections. Running B before A would leave A's refactor and B's content layer landing in arbitrary order with no consumer — harmless but produces no sliceable PR boundary. We sequence A first because (a) A is pure behavior-preserving refactor with the smallest blast radius — fastest to review and merge; (b) B's task C/D consumers depend on A's runtime; landing A first means C can trust `t('courses.X')` exists. Honest caveat: A and B COULD parallelize if the team accepts two open PRs at once; the linear order is recommended, not load-bearing on correctness.
- **B → C**: Hard dependency. C pages import `getCollection('courses')` + `getCollection('lessons')` (defined in B-2), `src/utils/courses.ts` helpers (B-4), and the courses content rows (B-7/B-8). Without B, C pages have no collection to query and no helpers to call.
- **C → D**: Hard dependency. D reuses the exact components created in C (`CourseCard`, `LessonsList`, `CourseBreadcrumb`) with `locale: 'en'`; the English pages are 1-1 mirrors. The `en.json` `nav.courses`/`courses.*` keys were seeded in A-5 but only consumed by D-2/D-4/D-6.
- **AGENTS.md updates**: A-11 (i18n usage) lands in slice A; B-17 (article locale-own + courses conventions) lands in slice B; both are documentation-only and must land in their respective slice so docs never describe a state that no longer exists.

## TDD Risk Notes

- **A-2 snapshot baseline is the load-bearing step of slice A.** The baseline JSON MUST be captured from pristine pre-migration HEAD before any UI string moves. If A-3 (red test) runs against a baseline captured AFTER partial migration, the snapshot assertion is meaningless. Order A-1 (audit) → A-2 (lock baseline) → A-3 (red test) is critical and irreversible once executed.
- **B-5/B-6/B-7 ordering is sensitive.** B-5 does the mechanical rename (Spanish-only files), B-6 writes the red test asserting `.es.md`/`.en.md` siblings exist (RED because B-5 only renamed, did not split), B-7 does the locale-split + translation (GREEN). If B-7 runs before B-6, the red assertion is retrofitted and breaks TDD discipline.
- **B-11/B-12/B-13/B-14 article migration is a one-shot destructive change.** The script B-13 must be re-runnable and idempotent so a partial failure can be re-run; any file the regex can't parse MUST be flagged for manual edit (do NOT silently skip). Spanish bodies are never deleted by the script (only `_en` keys stripped); rollback via `git checkout` on the affected files restores them.
- **C-6 URL layout decision** (nested `[course]/index.astro` + `[course]/[lesson].astro` vs design's `[course].astro` + `[course]/[lesson].astro`) should be settled at apply kickoff — both produce identical URLs, but the file layout affects how `getStaticPaths` collides. Flag for apply-phase confirmation.
- **D-5/D-6 nav-count test cooperation with C-9**. The same nav-count test (likely `tests/issue-28-localized-article-routing.test.mjs`) is touched in C-9 (Spanish 4-entry assertion) and D-5/D-7 (English 4-entry assertion). Strict no-split-across-PRs rule means each slice updates only the locale it ships. If a single test asserts BOTH locales simultaneously, the test file may need a wider edit in D-7 — flagged as the only cross-slice test touchpoint.

Decision needed before apply: Yes