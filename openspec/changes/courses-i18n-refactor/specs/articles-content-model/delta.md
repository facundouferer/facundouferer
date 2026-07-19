# Delta for articles-content-model

> Modified capability. No prior `openspec/specs/articles-content-model/spec.md` exists; this delta treats the CURRENT CODEBASE behavior (documented in `src/content.config.ts` and `AGENTS.md §6.9`) as the implicit prior and records the change. MODIFIED blocks replace that implicit prior when archived.

## MODIFIED Requirements

### Requirement: Article Locale-split Schema

Article files MUST be locale-split (`<slug>.es.md` + `<slug>.en.md`). Each file SHALL hold only its own locale's fields. The `.es.md` file carries `title` (Spanish), `excerpt` (Spanish), `lang: 'es'`, and a Spanish body. The `.en.md` file carries `title` (English), `excerpt` (English), `lang: 'en'`, and an English body. The duplicated `title_en`/`excerpt_en` fields SHALL be REMOVED from BOTH files. The zod schema in `src/content.config.ts` SHALL drop `title_en` and `excerpt_en` as required fields; `title` and `excerpt` remain required per-locale fields.

(Previously: every article file — both `.es.md` and `.en.md` — carried `title`, `title_en`, `excerpt`, and `excerpt_en`, duplicating English fields inside the Spanish file. `generateArticleId` produced IDs like `${slug}__${lang}`; that behavior is retained.)

> Design decision (schema-migration): the symmetric locale-own model is adopted — each file owns its canonical locale fields, so `_en` siblings are redundant and removed. This matches the new lessons locale-split design for consistency. The schema is the source of truth.

#### Scenario: Spanish file purity

- GIVEN `src/content/articles/codegraph.es.md`
- THEN its frontmatter SHALL NOT contain `title_en` or `excerpt_en`
- AND its body SHALL be Spanish prose only

#### Scenario: English file canonical

- GIVEN `src/content/articles/codegraph.en.md`
- THEN its frontmatter SHALL declare `title` (English), `excerpt` (English), `lang: 'en'`
- AND SHALL NOT contain `title_en` or `excerpt_en`

#### Scenario: Shared slug preserved

- GIVEN the `.es.md` and `.en.md` pair of an article
- THEN both files SHALL declare the same `slug`
- AND public URLs (`/articulos/<slug>` and `/en/articles/<slug>`) SHALL be unchanged

#### Scenario: Schema migration step

- GIVEN existing article files carry `title_en`/`excerpt_en`
- WHEN the migration step runs (per-file strip in the apply phase)
- THEN those keys SHALL be removed from every `.es.md` and `.en.md`
- AND `astro check` SHALL pass after the migration

## ADDED Requirements

### Requirement: Article Helpers Updated

`src/utils/articles.ts` helpers (`getArticlesForLocale`, `resolveArticleEntry`, `getArticleSlugsForLocale`, `getArticlePreviewImage`) SHALL continue to resolve all existing articles after the schema change. `generateArticleId` SHALL keep producing `${slug}__${lang}` IDs; the `lang === 'both'` branch is retained for backward compatibility but unused by articles after migration.

#### Scenario: Helpers still resolve

- GIVEN the schema migration completes
- WHEN `getArticlesForLocale(entries, 'en')` runs
- THEN it SHALL return only English entries with `published: true`
- AND `getArticleSlugsForLocale` SHALL return the same slug list as before the migration

### Requirement: Tests Updated for Corrected Schema

Tests asserting the presence of `title_en`/`excerpt_en` on article entries SHALL be updated (TDD red→green) to assert the corrected locale-own schema. Tests hardcoding article counts or field lists SHALL be regenerated against the migrated files.

#### Scenario: TDD cycle

- GIVEN the article schema requirement exists
- WHEN `npm test -- tests/issue-10-content-schema.test.mjs` runs
- THEN it SHALL assert the absence of `title_en`/`excerpt_en` in `.es.md` files
- AND the presence of canonical `title`/`excerpt` per locale
- AND the suite SHALL pass