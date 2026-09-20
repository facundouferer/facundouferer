# Link presentations to course lessons

Model the relationship course → lesson → presentations so each interactive
presentation belongs to one lesson, lessons may own several presentations, and
learners can see from the lesson list which lessons include presentations.

## Problem

Presentations live in `src/data/presentations.ts` as a flat catalog with only a
topic tag. Nothing ties them to the course or lesson they illustrate, so a
learner reading a lesson never discovers its presentation and the catalog does
not point back to the course.

## Why

Presentations are teaching material for specific lessons. Surfacing them inside
the lesson and marking lessons that have them turns two disconnected catalogs
into one learning path.

## Decision (user, 2026-09-19)

A lesson may own zero or more presentations; a presentation belongs to exactly
one lesson. The original "one and only one" requirement was relaxed because
three C lessons naturally own several presentations (if-else: 2, strings: 4,
sorting: 3) and 51 lessons have none.

## Scope

- Add a `lesson: { course, slug }` reference to every presentation record and a
  helper that returns the presentations of a lesson.
- Validate the mapping with tests: every reference resolves to an existing
  bilingual lesson, every presentation is mapped exactly once.
- Show a presentation badge/count on lesson cards and the sidebar list.
- Render a "Presentations of this lesson" section on the lesson detail page.
- Show the owning course/lesson link on presentation cards and detail pages.
- Document the model in `AGENTS.md`.
- Keep `/presentaciones` and `/en/presentaciones` catalog routes and navigation.

## Constraints

- Design tokens and system classes from `Organic/` only (`DESIGN.md`).
- TDD enabled by `AGENTS.md`; runner `node --test`.
- Repository documentation and code in English; UI copy through `src/i18n`.
- Conventional Commits, one work unit per task, no attribution trailers.
- Unrelated `.atl/*` modifications stay out of scope.

## Mapping (presentation slug → course/lesson slug)

| Presentation | Lesson |
|---|---|
| variables_y_constantes | c/variables-y-constantes |
| tipos_de_datos_en_javascript | c/tipos-de-datos |
| if-paso-a-paso, if-else-paso-a-paso | c/sentencia-if-else |
| switch-paso-a-paso | c/sentencia-switch-y-bloques-de-codigo |
| while-paso-a-paso | c/sentencia-while |
| for-paso-a-paso | c/sentencia-for |
| do-while-paso-a-paso | c/sentencia-do-while |
| for-anidado-tabla-multiplicar | c/programacion-esquematica-y-sentencias-anidadas |
| arreglos-en-c | c/arreglos-unidimensionales-y-multidimensionales |
| operaciones-con-arreglos | c/operaciones-con-arreglos |
| string-paso-a-paso, string-numeros-paso-a-paso, strchr-paso-a-paso, contar-palabras-cadenas-c | c/cadenas-de-caracteres-y-operaciones |
| bubble-sort, selection-sort, insertion-sort | c/ordenacion-de-arreglos |
| arboles-binarios | c/arboles-binarios |
| modularidad_en_c | c/modularizacion-subprogramas-y-funciones |
| paso_por_valor_y_referencia | c/variables-parametros-y-pasaje |
| funciones_y_procedimientos_java | java/05-metodos-y-funciones |

## Delivery

- Strategy: `single-pr` (forecast ≈ 600–900 authored lines, 3 work units).

## Tasks

- [x] **LP-01 — Data model and validated mapping**
  - Route: delegated; writer trigger (data file, helper module, tests).
  - Add `lesson` to `Presentation`, map all 22 records, add
    `getPresentationsForLesson(course, slug)` and `getLessonForPresentation`.
  - Acceptance: tests prove every reference resolves to an `es` and `en` lesson
    file, every presentation has exactly one lesson, helpers return grouped
    results in catalog order.

- [x] **LP-02 — Lesson list badge and lesson detail section**
  - Route: delegated; writer trigger (component, 4 pages, i18n, tests).
  - `LessonsList` receives `presentationCount` per lesson and renders a badge
    (Lucide icon + count) in both variants; lesson detail pages render a
    presentations section with cards linking to the localized presentation route.
  - Acceptance: es/en course detail and lesson pages compile; tests assert
    badge and section markup; Organic tokens only.

- [x] **LP-03 — Presentation back-links and documentation**
  - Route: delegated; writer trigger (4 presentation pages, catalog card, docs).
  - Presentation cards and detail pages show "Part of: Course › Lesson" linking
    to the localized lesson; `AGENTS.md` documents the model.
  - Acceptance: tests assert the back-link; `astro check` and `build` pass.

## Verification

```bash
node --test tests/presentations-lessons.test.mjs
node --test tests/courses-detail-routing.test.mjs tests/courses-catalog.test.mjs
npm test
npm run astro -- check
npm run build
```

## Progress evidence

| Task | Commit | Focused check | RDD outcome |
|---|---|---|---|
| LP-01 | `e7da256` | `node --test tests/presentations-lessons.test.mjs` — 12 passed | disabled/unmanaged |
| LP-02 | `4829a18` | `node --test tests/courses-detail-routing.test.mjs tests/courses-catalog.test.mjs tests/presentations-lessons.test.mjs` — 40 passed, 2 pre-existing CourseBreadcrumb failures; build 275 pages | disabled/unmanaged |
| LP-03 | `b59273a` | `node --test tests/presentations-lessons.test.mjs` — 19 passed; build 275 pages | disabled/unmanaged |

- [x] **LP-04 — Fullscreen presentations without slide headers** (added 2026-09-20 on user request)
  - Route: delegated; writer trigger (22 components + 2 pages + global token).
  - Remove per-presentation header; shell full width; screen min-height
    `100dvh - --site-header-height`; simulator caps lifted.
  - Evidence: `42d0804`; `node --test tests/presentations-layout.test.mjs` — 7 passed; build 275 pages.

## Feature completion evidence (2026-09-20)

- `node --test tests/presentations-lessons.test.mjs` — 19 passed.
- `npm test` — 168 tests, 163 passed, 5 failed; the 5 failures (CourseBreadcrumb x2, article language strategy, testimonials x2) pre-exist on `main` and are unrelated.
- `npm run astro -- check` — 0 errors.
- `npm run build` — 275 pages; the C strings lesson renders its presentations section and lesson badges.

## Next step

All 3 tasks are complete. Open the pull request from `feat/lessons-presentations` to `main` (user decision).
