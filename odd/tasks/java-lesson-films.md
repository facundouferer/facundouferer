# Java lesson films (lessons 08, 09, 13, 14)

Objective: one two-minute film per lesson, in the style of `viaje-excepcion-java`.
Branch `feat/java-lesson-films`, delivery `ask-on-risk`, runner `node --test` plus `npx astro check`.
Forecast: about 1,900 authored lines per film (four work-unit commits, one per film).

## Specs

- S1. A film for `/cursos/java/08-herencia-polimorfismo-y-sobrecarga`, slug `viaje-llamada-polimorfica-java`.
- S2. A film for `/cursos/java/09-clases-abstractas-interfaces-y-modelado`, slug `viaje-contrato-interfaz-java`.
- S3. A film for `/cursos/java/13-java-collections-framework-y-genericos`, slug `viaje-clave-hashmap-java`.
- S4. A film for `/cursos/java/14-iteradores-ordenamiento-equals-hashcode`, slug `viaje-comparacion-ordenamiento-java`.
- S5. Every film follows `CLAUDE.md` §Lesson films: study the lesson first, one story, one persistent
  motion canvas (`viewBox="0 0 1280 720"`), six scenes, about eight motion steps, 90 to 120 seconds in
  both languages, the `--xj-*` palette, editor on the left and isometric system on the right, neutral
  Latin American Spanish plus English, registered as an extra animation next to the existing one.
- S6. Each film ships its script, component, Organic thumbnail and a test like
  `tests/animation-viaje-excepcion-java.test.mjs`; it is verified in the browser at every scene.

Assumption: the story of each film (the slug names it) was chosen by the parent from the lesson
titles; a writer may refine the title and description, not the slug.

## Tasks

- [x] T1 (S1, S5, S6) delegated writer, parallel. Commit: db90f9f. Own test passes; parent spot-checked one frame in the browser.
- [x] T2 (S2, S5, S6) delegated writer, parallel. Commit: b01eae6. Own test passes; parent spot-checked one frame in the browser.
- [x] T3 (S3, S5, S6) delegated writer, parallel. Commit: 6d3e138. Own test passes; parent spot-checked one frame in the browser.
- [x] T4 (S4, S5, S6) delegated writer, parallel. Commit: 88c4a6d. Own test passes; parent spot-checked one frame in the browser.
- [x] T5 (S1-S4) parent, inline: final titles in the catalog, AGENTS.md list, seam check (full suite once).

Route evidence: four independent units with disjoint edit surfaces, each about 1,900 lines, launched
together (Writer trigger a). The parent owns git and the shared files (`src/data/animations.ts`, both
`animaciones/[slug].astro` pages, `tests/animations-lessons.test.mjs`, `AGENTS.md`); it registered the
four slugs with placeholder components before launch so the dev server can render them.

## Log

- L1 (2026-11-09, user): "Ahora agrega animaciones a las lecciones:
  /cursos/java/08-herencia-polimorfismo-y-sobrecarga
  /cursos/java/09-clases-abstractas-interfaces-y-modelado
  /cursos/java/13-java-collections-framework-y-genericos
  /cursos/java/14-iteradores-ordenamiento-equals-hashcode"
- L2 (2026-11-09): lesson files are `src/content/courses/java/10-herencia-…`, `11-clases-abstractas-…`,
  `15-java-collections-…`, `16-iteradores-…` (frontmatter slug differs from file name).
- L3 (2026-11-09): the working tree still holds 14 stub animations of an earlier session (unstaged
  catalog entries and page imports, untracked stub components). They stay out of these commits.
- L4 (2026-11-09): all four writers reported S covered; parent seam check: 163/164 animation tests (the one failure is the stub catalog of L3, absent from the commits), astro check 0 errors, one browser frame per film, no console errors.
