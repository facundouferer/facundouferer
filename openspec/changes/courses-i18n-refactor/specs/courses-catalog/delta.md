# Delta for courses-catalog

> New capability. No prior `openspec/specs/courses-catalog/spec.md` exists. This delta establishes the spec.

## ADDED Requirements

### Requirement: Course Catalog Page

The system MUST expose a course catalog page reachable at `/cursos` (Spanish) and `/en/courses` (English) listing every published course for the active locale.

#### Scenario: Spanish catalog renders

- GIVEN a visitor navigates to `/cursos`
- WHEN the page renders
- THEN it SHALL list all courses with `published: true` and locale `es` (or `lang: 'both'`), sorted by `(technology, slug)` ascending
- AND each card SHALL display the course logo, `title`, `description`, `difficulty`, and a link to `/cursos/<slug>`

#### Scenario: English catalog renders

- GIVEN a visitor navigates to `/en/courses`
- WHEN the page renders
- THEN cards SHALL show English `title_en` / `description_en`
- AND links SHALL point to `/en/courses/<slug>`

#### Scenario: Unpublished courses hidden

- GIVEN a course with `published: false` exists
- WHEN any catalog page renders
- THEN that course SHALL NOT appear in either locale

#### Scenario: Locale mismatch

- GIVEN a course index file is Spanish-only (`lang: 'es'`, no English pair)
- WHEN the English catalog renders
- THEN that course SHALL NOT appear on `/en/courses`

### Requirement: Course Detail Page

The system MUST expose a course detail page at `/cursos/[course]` and `/en/courses/[course]` showing course metadata and an ordered list of published lessons for the active locale.

#### Scenario: Open course detail

- GIVEN a visitor opens `/cursos/java`
- WHEN the page renders
- THEN it SHALL display a header (title, description, difficulty, technology, logo)
- AND an ordered list of published lessons for locale `es` sorted by `order` ascending
- AND each lesson row SHALL link to `/cursos/java/<lesson-slug>`

#### Scenario: English detail

- GIVEN a visitor opens `/en/courses/java`
- WHEN the page renders
- THEN the header and lesson titles SHALL render in English
- AND links SHALL point to `/en/courses/java/<lesson-slug>`

#### Scenario: Unpublished lessons hidden

- GIVEN a lesson with `published: false` belongs to the course
- WHEN the detail page renders
- THEN that lesson SHALL NOT be listed

#### Scenario: Nonexistent course

- GIVEN a visitor requests `/cursos/does-not-exist`
- WHEN Astro resolves the route
- THEN it SHALL return the Astro 404 page

### Requirement: Lesson Detail Page

The system MUST expose a lesson page at `/cursos/[course]/[lesson]` and `/en/courses/[course]/[lesson]` rendering the lesson body for the active locale.

#### Scenario: Render lesson

- GIVEN a visitor opens `/cursos/java/01-introduccion`
- WHEN the page renders
- THEN it SHALL display a course breadcrumb, the lesson `title`, and the rendered Markdown body for locale `es`

#### Scenario: English lesson body

- GIVEN a visitor opens the English URL of the same lesson
- WHEN the page renders
- THEN the body SHALL render from the `.en.md` file

#### Scenario: Nonexistent or mismatched lesson

- GIVEN a visitor opens `/cursos/java/01-introduccion` but the lesson belongs to `javascript`
- THEN the route SHALL return the Astro 404 page
- AND a nonexistent lesson slug SHALL also return 404

### Requirement: Navigation Entry to Courses

The site header navigation MUST include a `Cursos` (es) / `Courses` (en) entry linking to `/cursos` and `/en/courses` respectively, positioned between Artículos/Articles and Sobre mí/About. (Behavior belongs to `site-navigation`; catalog page MUST be reachable from that nav entry.)

#### Scenario: Nav entry links to catalog

- GIVEN a visitor clicks the `Cursos` nav entry on a Spanish page
- THEN the browser SHALL navigate to `/cursos`
- AND clicking `Courses` on an English page SHALL navigate to `/en/courses`