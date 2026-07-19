# Delta for courses-content-model

> New capability. No prior `openspec/specs/courses-content-model/spec.md` exists. This delta establishes the spec. Field naming and zod import style SHALL match the existing `articles`/`projects` collections in `src/content.config.ts`.

## ADDED Requirements

### Requirement: Courses Collection Schema

The `courses` collection MUST be registered in `src/content.config.ts` using `glob({ base: './src/content/courses', pattern: '**/index.md' })` with a zod schema: `slug`, `title`, `title_en`, `description`, `description_en`, `technology`, `difficulty`, `image` (optional), `published` (default `true`), `featured` (default `false`), `lang` (`z.enum(['es','en','both']).default('es')`).

> Design decision: the course index keeps bilingual frontmatter (mirrors `projects`) because it is short metadata; long-prose content lives in lessons, which are locale-split.

#### Scenario: Valid index

- GIVEN `src/content/courses/java/index.md` exists with all required fields
- WHEN `astro check` runs
- THEN schema validation SHALL pass

#### Scenario: Invalid index — missing title_en

- GIVEN an `index.md` omits `title_en`
- WHEN `astro check` runs
- THEN validation SHALL fail with a zod error naming `title_en`

### Requirement: Lessons Collection Schema

The `lessons` collection MUST be registered in `src/content.config.ts` using `glob({ base: './src/content/courses', pattern: '**/*.md' })` (excluding `index.md`) with a zod schema: `course` (string ref to a course slug), `slug`, `title`, `description` (optional), `order` (`z.number().int().nonnegative()`), `lang` (`z.enum(['es','en'])`), `published` (default `true`).

> Design decision (overrides an earlier field-list sketch that included `title_en`/`description_en`): lessons are locale-split — each `.es.md`/`.en.md` file carries only its own locale's `title`/`description`. `title_en`/`description_en` are NOT in the schema because the per-locale file owns its canonical fields. `readingTime` is OMITTED — lessons are short code snippets where reading time is not meaningful (articles keep `readingTime` because they are long-form prose).

#### Scenario: Valid lesson file

- GIVEN `src/content/courses/git/01-el-principio-con-git.es.md` exists with `course: 'git'`, `slug`, `title`, `order: 1`, `lang: 'es'`, `published: true`
- THEN validation SHALL pass

#### Scenario: Non-integer order rejected

- GIVEN a lesson file declares `order: 1.5`
- THEN validation SHALL fail

#### Scenario: Referential integrity

- GIVEN a lesson declares `course: 'nonexistent'`
- WHEN helpers resolve the course
- THEN `getLessonsForCourse` SHALL return an empty list for that slug (no build-time throw)
- AND the lesson SHALL be unreachable via routes (404)

### Requirement: Lesson Filename Normalization

Lesson filenames MUST be kebab-case, with a unique numeric prefix per course, and each Spanish/English pair MUST share the same filename stem (only the `.es.md`/`.en.md` suffix differs).

#### Scenario: Rename with typo and spaces

- GIVEN `src/content/courses/git/01-El prinicpio con git.md`
- WHEN normalization completes
- THEN the file SHALL be renamed to `01-el-principio-con-git.es.md`
- AND an English sibling `01-el-principio-con-git.en.md` SHALL exist with the same stem

#### Scenario: Unique numeric prefix

- GIVEN two lessons in the same course
- THEN their numeric prefixes MUST differ

### Requirement: Course Logos Live Under public/img

Course logos MUST reside at `public/img/courses/<course-slug>/logo.svg` and be referenced via the URL `/img/courses/<course-slug>/logo.svg`, matching the articles/projects asset convention.

#### Scenario: Logo addressable

- GIVEN a course detail page renders
- THEN the `<img>` `src` SHALL equal `/img/courses/<slug>/logo.svg`

#### Scenario: No logos under content

- WHEN the migration completes
- THEN no `logo.svg` file SHALL remain under `src/content/courses/`

### Requirement: Locale-split Lesson Files

Each lesson MUST exist as a `.es.md` + `.en.md` pair sharing the same `slug`. The `.es.md` file SHALL contain only Spanish fields and a Spanish body; the `.en.md` file SHALL contain only English fields and an English body.

#### Scenario: Spanish file purity

- GIVEN `git/01-el-principio-con-git.es.md`
- THEN its frontmatter SHALL NOT contain `title_en` or `description_en`
- AND its body SHALL be Spanish prose

#### Scenario: Shared slug

- GIVEN the `.es.md` and `.en.md` pair of a lesson
- THEN both files SHALL declare the same `slug` value

### Requirement: Courses Helpers in src/utils/courses.ts

The system MUST expose helpers analogous to `src/utils/articles.ts`: `getCoursesForLocale(entries, locale)`, `resolveCourseEntry(entries, locale, fallbackLocale)`, `getLessonsForCourse(lessons, courseSlug, locale)`, `getCourseSlugsForLocale(entries, locale)`.

#### Scenario: English-only courses

- GIVEN `getCoursesForLocale(entries, 'en')` is called
- THEN it SHALL return only entries whose `lang` is `'en'` or `'both'` AND `published: true`

#### Scenario: Lessons ordered

- GIVEN `getLessonsForCourse(lessons, 'javascript', 'es')` is called
- THEN it SHALL return 11 published Spanish lessons sorted by `order` ascending