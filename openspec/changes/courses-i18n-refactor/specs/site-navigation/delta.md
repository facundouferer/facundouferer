# Delta for site-navigation

> Modified capability. No prior `openspec/specs/site-navigation/spec.md` exists; this delta treats the CURRENT `NAVIGATION` in `src/config/site.ts` as the implicit prior and records the change. MODIFIED blocks replace that implicit prior when archived.

## MODIFIED Requirements

### Requirement: NAVIGATION Configuration

`NAVIGATION` in `src/config/site.ts` MUST list, for each locale, the primary sections in this order: Projects, Articles/Articulos, Courses/Cursos, About/Sobre mi. The Courses entry SHALL sit between Articles and About.

(Previously: the Spanish list was `[{Proyectos}, {Articulos}, {Sobre mi}]` and the English list was `[{Projects}, {Articles}, {About}]`. No Courses entry existed.)

#### Scenario: Spanish order

- GIVEN the Spanish `NAVIGATION.es` array
- THEN it SHALL equal `[{Proyectos}, {Articulos}, {Cursos}, {Sobre mi}]` in that order

#### Scenario: English order

- GIVEN the English `NAVIGATION.en` array
- THEN it SHALL equal `[{Projects}, {Articles}, {Courses}, {About}]` in that order

#### Scenario: Courses target URL

- GIVEN the Courses nav entry
- WHEN rendered on a Spanish page
- THEN `href` SHALL equal `/cursos`
- AND WHEN rendered on an English page SHALL equal `/en/courses`

## ADDED Requirements

### Requirement: Courses Nav Label Key

The i18n JSON dictionaries (`src/i18n/es.json`, `src/i18n/en.json`) MUST expose a `nav.courses` key resolving to `Cursos` (es) and `Courses` (en) respectively.

#### Scenario: t() returns localized label

- GIVEN `t('nav.courses')` is called
- WHEN the URL is `/`
- THEN it SHALL return `Cursos`
- AND WHEN the URL is `/en/`
- THEN it SHALL return `Courses`

### Requirement: Nav Tests Updated

Tests asserting nav entry counts (notably `tests/issue-28-localized-article-routing.test.mjs` and any nav-count test) SHALL be updated in the same slice that introduces the Courses entry. (Apply-phase liability — documented here, implemented in apply phase.)

#### Scenario: Nav count assertion

- GIVEN a nav test asserts the count of `NAVIGATION.es` entries
- WHEN the Courses entry is added
- THEN the test SHALL expect 4 entries (was 3)
- AND the suite SHALL pass