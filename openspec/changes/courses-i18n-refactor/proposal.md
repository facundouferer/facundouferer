# Proposal: Courses i18n Refactor

## Intent

The `src/content/courses/` tree (4 courses, 58 lessons) is orphaned: no schema, no page, no nav entry, no consumer, and Spanish-only. This change promotes courses to a first-class bilingual section (es + en) and — while touching the i18n layer for it — unifies the project's i18n architecture onto Astro's native `useTranslations` so future bilingual sections stop reinventing locale plumbing.

## Goals

- Ship a fully bilingual Courses section (catalog → course → lesson) under `/cursos/...` (es) and `/en/courses/...` (en).
- Give courses + lessons real zod schemas, helpers, and routes.
- Translate all 4 course indexes and all 58 lessons to English.
- Normalize lesson filenames (kebab-case, fix typos like `01-El prinicpio con git.md`, coherent numeric ordering).
- Move course logos to `public/img/courses/<slug>/logo.svg` so they are URL-addressable like articles/projects assets.
- Consolidate UI strings into `src/i18n/es.json` + `src/i18n/en.json` and adopt `getLangFromUrl` + `useTranslations`.
- Unify collections i18n: locale-split files for long-prose (articles + courses), single bilingual file for data-card style (projects).
- Update tests and AGENTS.md content-collection rules to reflect the new model.

## Non-Goals

- Migrating `projects` to locale-split files (stays single bilingual frontmatter).
- Introducing Paraglide, `@nanostores/i18n`, or any new dependency.
- Adding new course content beyond translating existing Spanish lessons.
- Changing article public slugs or URLs.
- Authoring tooling, CMS, or search infra.
- Touching the `en/`-prefix routing convention (`prefixDefaultLocale: false` stays).

## Current State

- Native Astro i18n is declared (`defaultLocale: 'es'`, `locales: ['es','en']`) but `getLangFromUrl` / `useTranslations` are unused.
- Locale is hardcoded per page (`locale="es"` / `locale="en"`) and threaded down as props; `LanguageSwitch.astro` is a pure prop-client with no i18n store.
- `src/i18n/translations.ts` (46 lines, only `nav`+`home`) and `src/i18n/paths.ts` (32 lines) are vestigial. Real UI strings live in `src/seo/meta.ts` as `SEO.es` / `SEO.en`.
- Articles: locale-split `slug.es.md` + `slug.en.md` but each file ALSO carries `title_en`/`excerpt_en` (duplication with no benefit). Helpers in `src/utils/articles.ts` build IDs as `${slug}__${lang}`.
- Projects: single bilingual `.md` with inline `title`/`title_en`/`description`/`description_en`/etc. No helper layer.
- `src/content.config.ts` defines `articles` + `projects`; NO `courses` or `lessons` collection.
- Courses (`src/content/courses/{c,git,java,javascript}/`): `index.md` (frontmatter: `description`, `technology`, `difficulty`) + `logo.svg` + `NN-slug.md` lessons (frontmatter: only `title`). Lesson counts: c=32, git=3, java=12, javascript=11. Ordering is implicit via filename numeric prefix; filenames have spaces and typos. Logos are NOT under `public/img/` so not URL-addressable.
- Nav (`src/config/site.ts`) has no Courses entry. No `/cursos` or `/en/courses` route exists.

## Proposed Approach

1. **UI strings refactor**: consolidate `SEO.es/en` + leftover `translations.ts` into `src/i18n/es.json` + `src/i18n/en.json`. Adopt `useTranslations(getLangFromUrl(Astro.url))` across components/pages. Deprecate `translations.ts` and `paths.ts`. No Paraglide / no new deps (pure SSG, small string surface).
2. **Collections i18n unification**:
   - Long-prose (articles + courses): corrected locale-split files — `.es.md` holds only Spanish fields + Spanish body; `.en.md` holds only English fields + English body. Drop `title_en`/`excerpt_en` duplication from the Spanish file. `slug` stays shared.
   - Projects (data-card, short body): keep single bilingual frontmatter.
   - Refactor `src/utils/articles.ts` helpers accordingly.
3. **Content schema** in `src/content.config.ts`:
   - `courses`: `slug`, `title`, `title_en`, `description`, `description_en`, `technology`, `difficulty`, `image?`, `published`, `featured`, `lang: 'es'|'en'`.
   - `lessons`: `course` (ref), `slug`, `title`, `title_en`, `description?`, `description_en?`, `order` (int), `lang: 'es'|'en'`, `published`.
4. **Translate all 4 courses** — `index.md` + all 58 lessons. For each, create `.es.md` + `.en.md` pair; move existing Spanish content to `.es.md`.
5. **Normalize lesson filenames**: kebab-case, fix typos (e.g. `git/01-el-principio-con-git.md`), ensure numeric ordering is unique per course. Keep 1-1 `.es.md`/`.en.md` filename mapping.
6. **Move course logos** to `public/img/courses/<course-slug>/logo.svg` (addressable via `/img/...`), matching articles/projects convention; reference via `asset.src` or direct URL per existing project convention.
7. **Add pages**: `/cursos/index.astro` (catalog), `/cursos/[course].astro` (detail + lessons list), `/cursos/[course]/[lesson].astro` (lesson). Mirror entire tree under `src/pages/en/courses/` using `/en/courses/...` URLs.
8. **Nav entry**: add `Cursos` / `Courses` to NAVIGATION in `src/config/site.ts`, between Artículos and Sobre mí (and Articles / About for en).
9. **Helpers**: create `src/utils/courses.ts` analogous to `src/utils/articles.ts` — `getCoursesForLocale`, `resolveCourseEntry`, `getLessonsForCourse(locale)`, `getCourseSlugsForLocale`, `getLessonPreviewImage` (if applicable).
10. **Tests + AGENTS.md**: update `tests/` that hardcode article counts, file lists, or nav structure; apply strict TDD. Flag (do NOT self-edit) that AGENTS.md §6.9 (articles) and the projects section must be updated in the apply phase to reflect locale-split correction + new courses conventions.

## Capabilities

> Contract for sdd-spec. No existing `openspec/specs/` entries present.

### New Capabilities
- `courses-catalog`: bilingual listing, routing, and per-locale resolution of courses and lessons.
- `courses-content-model`: zod schemas for courses + lessons collections with bilingual fields and lesson ordering.
- `ui-i18n-runtime`: Astro-native `useTranslations` runtime with es/en JSON dictionaries, locale detected from URL.

### Modified Capabilities
- `articles-content-model`: drop `title_en`/`excerpt_en` duplication from Spanish-split file; refactor `src/utils/articles.ts` helpers for corrected locale-split.
- `site-navigation`: add Courses entry to `src/config/site.ts` NAVIGATION for both locales.

## Slice Plan

Chained PR forecast (each slice independently mergeable, tests green at every boundary):

| Slice | Scope | Est. lines | Notes |
|-------|-------|-----------|-------|
| A — i18n refactor | `es.json` + `en.json`, `useTranslations` adoption, deprecate `translations.ts`/`paths.ts`, no behavior change | ~250–350 | Pure refactor; all current tests must stay green. |
| B — courses content layer | `courses` + `lessons` schemas, `src/utils/courses.ts`, filename normalization, logos → `public/img/courses/`, `.es.md`/`.en.md` split + English translation of all indexes and lessons, article split correction | ~900–1200 | Largest slice (content translation bulk); no pages yet. |
| C — Spanish courses pages | `/cursos/index.astro`, `/cursos/[course].astro`, `/cursos/[course]/[lesson].astro`, nav entry, tests | ~350–500 | Spanish-only first to validate UX before mirror. |
| D — English mirror + tests | `src/pages/en/courses/...` mirror tree, EN nav wiring, full test suite update | ~250–400 | Completes bilingual coverage. |

**Total forecast: ~1750–2450 changed lines** across 4 chained PRs. Single PR would blow the 400-line review budget by ~4–6×.

## Review Workload Forecast

- **Estimated changed lines**: > 400 (forecast ~1750–2450 across chained slices).
- **Chained PRs recommended**: Yes.
- **Decision needed before apply**: Yes — confirm slicing, confirm removing `title_en`/`excerpt_en` duplication from Spanish article files is acceptable (it changes the schema of existing files and may require test updates), confirm `asset.src` vs direct `/img/...` URL usage for course logos (match articles vs projects current pattern), confirm whether existing Spanish-only lesson URLs already referenced externally (none observed — but confirm before filename normalization breaks anything).

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Translating 58 lessons is high-effort and error-prone (technical tone drift) | Med | Slice B isolates translation; review EN against ES lesson-by-lesson; glossary for technical terms enforced in apply phase. |
| Removing `title_en`/`excerpt_en` from Spanish article files changes existing IDs / breaks tests that assert field presence | Med | Update `generateArticleId` + tests in same slice; TDD red→green; keep public `slug` stable so URLs unaffected. |
| Filename normalization (`01-El prinicpio con git.md` → `01-el-principio-con-git.md`) breaks hypothetical external inbound links | Low | No external links observed; courses was orphaned (no routes). Document renamed slugs in apply-phase summary. |
| `useTranslations` migration touches every page/component; risk of missed string or wrong-locale render | Med | Slice A is behavior-preserving; snapshot current rendered UI strings as golden test before refactor; keep `astro check` green at every commit. |
| Logo path move (`src/content/.../logo.svg` → `public/img/courses/...`) affects nothing today (orphan) but ties asset convention for future | Low | Verify `public/img/courses/<slug>/logo.svg` exists for all 4 courses before any page renders. |
| Modifying existing tests (article counts, nav) breaks CI mid-slice | Med | Update tests in the same slice that changes the behavior; never split a behavior change and its test update across PRs. |

## Rollback Plan

- **Slice A**: revert `es.json`/`en.json` + `useTranslations` commits; restore `translations.ts`/`paths.ts` and `locale=` props threading from git. No content files touched.
- **Slice B**: revert schema + helpers + logo move; raw `.md` files under `src/content/courses/` are preserved (renames are reversible via git rename log; `.es.md`/`.en.md` split can be collapsed back to original `index.md` + `NN-slug.md`). Original Spanish bodies are never deleted until EN pairs are verified.
- **Slice C/D**: revert page additions and nav entry; orphan state of courses is implicitly restored. Courses content remains unused but present (same as today).
- **Global**: every slice is a single PR with green `npm test` + `astro check` at HEAD; `git revert <merge-commit>` per slice restores the previous state cleanly.

## Dependencies

- None external. No new npm packages. Pure Astro 6 + existing `node --test` runner.
- slicewise depends on the shared recommend-only rules in AGENTS.md (§6.9) being followed in the apply phase — flagged as out-of-proposal-scope but prerequisite for apply.

## Success Criteria

- [ ] `/cursos` renders the 4-course catalog in Spanish; `/en/courses` renders the same catalog in English.
- [ ] Each course has a detail page listing lessons in order; each lesson renders its body content in the active locale.
- [ ] All 58 lessons + 4 indexes exist as `.es.md` + `.en.md` pairs with matching slugs and coherent numeric ordering.
- [ ] No lesson filename contains spaces or the `prinicpio` typo; ordering is unique per course.
- [ ] `useTranslations(getLangFromUrl(Astro.url))` is the single i18n surface in `src/` for UI strings; `translations.ts` and `paths.ts` are removed or gutted.
- [ ] Spanish article files no longer carry `title_en`/`excerpt_en`; `src/utils/articles.ts` helpers still resolve all existing articles.
- [ ] `npm test` + `npm run astro -- check` pass at HEAD.
- [ ] Nav shows `Cursos` / `Courses` between Artículos/Articles and Sobre mí/About in their respective locales.
- [ ] Course logos resolve via `/img/courses/<slug>/logo.svg` in both locales.

## Open Questions

None blocking. The user-provided intent + verified facts cover all product decisions (locales, routes, schemas, translation scope, slicing direction). The only decisions flagged are apply-phase confirmations listed in the Review Workload Forecast, not proposal blockers.

## Assumptions

1. Strict TDD applies (`npm test` red→green per slice); no slice ships with failing tests.
2. Articles' public slugs and URLs remain unchanged — only the Spanish file's duplicated `_en` fields are removed.
3. Courses collection is named `courses`; lessons collection is named `lessons` (kebab, plural) for zod keys.
4. Course `slug` equals its folder name (`c`, `git`, `java`, `javascript`); the `c` slug is kept as-is (not renamed to `c-programming`) since no external link evidence exists either way.
5. Lesson `slug` is derived from the normalized kebab-case filename minus the numeric prefix; `order` is the integer numeric prefix.
6. `featured`/`published` defaults match AGENTS.md project convention (`featured: false`, `published: true`) unless the apply phase decides otherwise.
7. Course `image` is the `logo.svg` moved to `public/img/courses/<slug>/logo.svg`; used as both catalog card image and course-detail hero.
8. Removing `src/i18n/paths.ts` does not break any live route (it is barely referenced per verified facts); confirm via grep before deletion in apply phase.
9. No new content beyond translation: lesson bodies are translated 1-1, not expanded, split, or merged.
10. AGENTS.md §6.9 + projects authoring rules updates are owned by the apply phase, not this proposal.