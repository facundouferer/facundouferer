# Delta for ui-i18n-runtime

> New capability. No prior `openspec/specs/ui-i18n-runtime/spec.md` exists. This delta establishes the spec.

## ADDED Requirements

### Requirement: UI String Dictionaries

All UI strings (nav labels, home title/description, section titles currently in `src/seo/meta.ts` `SEO.es`/`SEO.en`, and the keys in `src/i18n/translations.ts`) MUST live in `src/i18n/es.json` and `src/i18n/en.json` as hierarchical keyed JSON. No production UI string SHALL remain in `src/seo/meta.ts` or `src/i18n/translations.ts`.

#### Scenario: Migration completeness

- GIVEN the refactor completes
- WHEN `rg "Proyectos|Articulos|Sobre mi" src/seo/meta.ts` runs
- THEN it SHALL return no matches
- AND a test asserting key presence in `es.json`/`en.json` SHALL pass

### Requirement: Astro-native useTranslations Adoption

Pages and components MUST obtain UI strings via `useTranslations(getLangFromUrl(Astro.url))` returning a `t()` function. Hardcoded `locale="es"`/`locale="en"` page props used purely for label rendering SHALL be replaced by URL-derived locale.

#### Scenario: Locale from URL

- GIVEN any page previously declared `const locale = 'es'` for label rendering
- WHEN refactored
- THEN the locale SHALL be derived from `getLangFromUrl(Astro.url)`

#### Scenario: t() returns localized label

- GIVEN `t('nav.projects')` is called
- WHEN the URL is `/`
- THEN it SHALL return `Proyectos`
- AND WHEN the URL is `/en/`
- THEN it SHALL return `Projects`

### Requirement: Deprecate translations.ts and paths.ts

`src/i18n/translations.ts` and `src/i18n/paths.ts` MUST be removed OR reduced to no-op re-exports. No production code under `src/` SHALL import from either module.

#### Scenario: No production imports

- WHEN `rg "from '@/i18n/(translations|paths)'" src/` runs
- THEN it SHALL return no matches (test fixtures excluded)

### Requirement: No Inline Locale Conditional Labels

Component templates MUST NOT contain `locale === 'es' ? '<label>' : '<label>'` expressions for UI labels. Data-field conditionals (e.g. rendering `title` vs `title_en` of a content entry) are permitted; UI labels SHALL use `t()`.

#### Scenario: Grep for inline conditionals

- WHEN `rg 'locale === "es" \?' src/components/ src/layouts/` runs
- THEN no match SHALL target a UI label string (only data-field conditionals permitted)

### Requirement: Behavior-preservation Snapshot

Existing pages MUST render identical visible UI string output as before the refactor. A golden snapshot test SHALL parse rendered HTML of every existing page and assert the visible text keys are unchanged from the locked baseline.

#### Scenario: Snapshot green

- GIVEN the refactor merges
- WHEN `npm test` runs the snapshot suite
- THEN it SHALL pass without updating snapshots

### Requirement: `<html lang>` and hreflang Integrity

Every page SHALL continue to emit the correct `<html lang>` and hreflang link tags as defined by `SITE_LANGUAGES`. No regression vs current SEO meta output is permitted.

#### Scenario: Locale meta unchanged

- GIVEN any existing page
- WHEN the refactor completes
- THEN `<html lang>` and hreflang SHALL equal the pre-refactor values for that URL