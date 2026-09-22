# Course roadmap and Java lesson reordering

## Objective
Add an optional, mindmap-style roadmap (collapsible folders/subfolders) to course pages, shown at the start of `/cursos/<course>/` (and the English twin) only when the course defines one. The first roadmap is Java's, and it must match the actual lesson order, so the Java course is first reordered along a coherent learning path.

## Problem
The pedagogical audit found forward dependencies in the current Java order:
- `23-algoritmia-verificacion-y-complejidad` (order 2) uses loops, arrays and methods taught at orders 4-6.
- `13-tad-listas` / `14-tad-pilas-y-colas` use generics, `ArrayDeque`, `PriorityQueue` and `Comparator` before the JCF/generics (16) and iterators/Comparator (17) lessons.
- `12-excepciones` try-with-resources examples use `BufferedReader`/`FileReader` (files are taught at order 21).
- `22-testing-junit-y-spring-boot` has `## Fin del curso` but `27-depuracion` follows it.
- "lección N" cross-references use filename prefixes, not `order`.

## Scope and constraints
- Keep all slugs and routes stable; only `order`, prose and examples change.
- Bilingual parity (ES/EN) for every change.
- Organic design system for the roadmap UI (DESIGN.md, tokens only, shared classes in `src/styles/global.css`).
- TDD: required (AGENTS.md §5.6); runner `npm test` / `node --test <file>`; checks `npm run astro -- check`, `npm run build`.
- Delivery: feature branch `feat/course-roadmap`, work-unit commits; push/PR/merge are the user's decision. Strategy: ask-on-risk. Forecast ~600-900 authored lines.

## Target Java order
1 conceptos-basicos · 2 variables · 3 control-de-flujo · 4 arrays-y-strings · 5 metodos · 6 algoritmia · 7 pilares-poo · 8 clases-y-objetos · 9 constructores · 10 arrays-de-objetos · 11 herencia · 12 abstractas-interfaces · 13 excepciones · 14 jcf-genericos · 15 iteradores (if it has no dependency on TAD lessons; otherwise after pilas-colas) · 16 tad-listas · 17 tad-pilas-colas · 18 arboles-binarios · 19 arboles-n-arios · 20 grafos · 21 archivos · 22 concurrencia · 23 jdbc · 24 testing · 25 depuracion

## Tasks
- [x] T1 (delegated — writer trigger: 50+ lesson files + tests): Reorder Java lessons, fix forward-dependency prose, exceptions example, "Fin del curso" placement and "lección N" cross-references; update order tests first (RED), then GREEN. Check: `npm test`, `npm run astro -- check`.
- [ ] T2 (delegated — writer trigger: schema + component + 2 pages + i18n + CSS): Optional roadmap data model and collapsible tree component on course pages (ES/EN), hidden when absent. Check: targeted tests, `npm test`, astro check, build.
- [ ] T3 (delegated with T2 or after): Java roadmap data grouping lessons into modules in the exact lesson order. Check: test asserting roadmap order equals lesson order.

## Progress
- Branch `feat/course-roadmap` created from `main` (5d1e8ee).
- T1 done (commit `7dc3ac0`). TDD mode: functional (no project-wide TDD config found; ran baseline first, then RED, then GREEN per the task's own instruction).
  - **Baseline** (`npm test` before any change): 486 tests, 481 pass, 5 fail — `CourseBreadcrumb component exists`, `CourseBreadcrumb renders locale-aware breadcrumb with course and optional lesson`, `language strategy is documented for article publication flow`, `testimonials component provides three references`, `home pages include testimonials between about and contact`. All pre-existing and unrelated to this change (confirmed by name).
  - **RED**: before editing any lesson, ran `node --test tests/courses-java-program-coverage.test.mjs tests/java-lessons-no-collections-before-jcf.test.mjs` against the reordered frontmatter (`order` fields already flipped) with the *old* test file → 1 failure: `algorithm foundations lesson exists in Spanish and English at order 2` (`AssertionError: 6 !== 2`), 27 passing. This is the expected RED: the lesson content changed, the test hadn't yet.
  - Updated `tests/courses-java-program-coverage.test.mjs` (order assertion 2→6; added 4 new tests: full target filename sequence by order ES/EN, no `lección N`/`lesson N` numeric cross-refs anywhere in the course, `Fin del curso`/`End of the course` heading only in the last lesson, and 12-excepciones has no `FileReader`/`BufferedReader`), and `tests/java-lessons-no-collections-before-jcf.test.mjs` (comment/order references 16→14, 17→15; rationale for excluding TAD lessons updated from "known structural decision" to "now come after JCF/iterators, so no longer a forward dependency").
  - Also found and fixed a **pre-existing, unrelated test now broken by the numeric-cross-reference removal**: `tests/lesson-exceptions-hook.test.mjs` asserted literal `/lección 8/` / `/lesson 8/` in the exceptions lesson; updated it to assert the new title-based markdown link instead.
  - **GREEN**: `node --test tests/courses-java-program-coverage.test.mjs tests/java-lessons-no-collections-before-jcf.test.mjs` → 32/32 pass.
  - Final order applied — orders 1-5, 7-13, 18-25 were **unchanged** (already correct); only 9 lessons moved: `02-variables`(3→2), `03-control-de-flujo`(4→3), `04-arrays-y-strings`(5→4), `05-metodos`(6→5), `23-algoritmia`(2→6), `15-java-collections-framework-y-genericos`(16→14), `16-iteradores-ordenamiento-equals-hashcode`(17→15), `13-tad-listas`(14→16), `14-tad-pilas-y-colas`(15→17).
  - **Iteradores placement**: stayed at order 15, immediately after JCF (14) and before the TAD lessons (16, 17), per the target order — verified it has **no** dependency on TAD-listas/TAD-pilas-y-colas content (no `Nodo`, `TAD`, "lista enlazada", or "implementaste" references; it teaches `Comparable`/`Comparator`/`equals`/`hashCode` from scratch). The contingency to place it after `14-tad-pilas-y-colas` did not apply.
  - **JCF/iteradores/TAD dependency prose fixes**: JCF's intro ("Durante dos lecciones implementaste...") rewritten forward-looking ("En las próximas lecciones vas a implementar..."); JCF's "(el TAD)"/"principio del TAD" phrasing (which presupposed the TAD lessons, now taught later) rewritten as "vas a formalizar más adelante como TAD"; JCF's `ArrayDeque`/`PriorityQueue` backward reference to TAD-pilas-y-colas rewritten forward-looking. TAD-listas' and TAD-pilas-y-colas' own backward references to JCF/clases-abstractas were correct as *forward* dependencies (JCF/interfaces now precede them) and only needed number→title/link conversion, not rewriting.
  - **12-excepciones fix**: replaced the `BufferedReader`/`FileReader("datos.txt")` try/finally and try-with-resources examples with a custom `ConexionSimulada implements AutoCloseable` class (prints on open/close), keeping the try/finally-vs-try-with-resources teaching point intact without depending on the not-yet-taught files lesson (order 21). Also replaced a second, task-unlisted `Files.readString`/`IOException` checked-exception example (section 3) with a hypothetical `obtenerConfiguracion()` method declaring a custom checked exception, for the same reason.
  - **"Fin del curso" move**: removed from `22-testing-junit-y-spring-boot` (replaced with a normal "## Qué sigue"/"## What comes next" transition to the debugging lesson) and appended, adapted to recap the whole course including debugging/clean code/refactoring, to the end of `27-depuracion-codigo-limpio-y-refactorizacion` (which had no closing section before).
  - **"lección N"/"lesson N" cross-references**: converted every numeric reference across the Java course (25 lessons × 2 locales) to the referenced lesson's title, as a markdown link to `/cursos/java/<slug>` (ES) / `/en/courses/java/<slug>` (EN) in prose/figcaptions, or as plain text (no link) inside SVG `<text>` elements and Java code comments, following the existing internal-link convention already used in `08-constructores-y-encapsulamiento`/`23-algoritmia-verificacion-y-complejidad`. Several numbers were pre-existing off-by-one errors unrelated to this reorder (verified by content, not by assumed filename-number identity) — e.g. "lección 11" for `RuntimeException`/stack-trace content that is actually in `12-excepciones`, "lección 19" for `ExecutorService` that is actually in `20-programacion-concurrente`, "lección 10" for the `interface` keyword that is actually taught in `11-clases-abstractas`; these were pointed at their real target rather than propagated.
  - **Hardcoded lesson numbers elsewhere**: checked `src/data/presentations.ts` and `src/content/activities/java/**` — both reference lessons by `slug`, not by order/filename number, so nothing there was order-dependent and no changes were needed.
  - **Verification**:
    - `node --test tests/courses-java-program-coverage.test.mjs tests/java-lessons-no-collections-before-jcf.test.mjs`: 32 pass, 0 fail.
    - `npm test`: 490 tests, 485 pass, 5 fail — exactly the 5 pre-existing baseline failures (CourseBreadcrumb ×2, language-strategy, testimonials ×2); no new failures. (490 = 486 baseline + 4 new tests added.)
    - `npm run astro -- check`: 2 errors, both pre-existing (`grafos-algoritmos-java.astro` `className.baseVal`, lines 1386/1454); no new errors.
    - `git diff --check`: clean (no whitespace errors).
  - Commit: `7dc3ac0` — `refactor(java-course): reorder lessons along a coherent learning path` (41 files changed, 357 insertions, 205 deletions).

## Next step
T2.
