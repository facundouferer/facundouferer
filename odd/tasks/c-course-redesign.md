# C course redesign: "C — De Cero a Profesional" 2.0

Objective: evolve `/cursos/c/` following `informe_redisenio_c_de_cero_a_profesional.md` (v1.0, Nov 2026): reorder the curriculum by conceptual dependencies, add the missing C fundamentals (compilation, pointers, storage duration, dynamic memory, standard library, quality tooling, C23), upgrade the presentations, add one film per lesson, and give every lesson a self-assessment quiz and a code project.
Branch `feat/c-course-redesign` (one branch, work-unit commits per stage), delivery `ask-on-risk`, runner `node --test` (`npm test`) plus `npx astro check`, plus a C compile check (`cc -std=c23 -Wall -Wextra -Wpedantic`, Apple clang 21 locally; see S9).
Status: authorized for all four stages (L7).

## Specs

- S1. User request (verbatim): "Vamos a mejorar el curso de /cursos/c/ para ello vas a analizar el docuemnto /Users/facundouferer/Downloads/informe_redisenio_c_de_cero_a_profesional.md y mejorar tanto las presentaciones, agregarás las animaciones y colocarás las actividades de autoevaluación y de código para desarrollar."
- S2. Scope decision (verbatim answer): "Plan completo documentado" — "Escribir primero el documento con las 4 etapas divididas en tareas, sin implementar nada. Después avanzamos etapa por etapa."
- S3. The report is the source of requirements. Key quotes that bind the plan:
  - "La recomendación no es descartar el material existente ni reconstruir el curso desde cero."
  - "Aclaración conceptual obligatoria: C pasa los argumentos por valor. Lo que suele llamarse «pasaje por referencia» se implementa pasando una dirección mediante un puntero, que también se pasa por valor."
  - "No enseñar estructuras dinámicas antes de los fundamentos de punteros y memoria."
  - "No presentar C como un lenguaje orientado a objetos."
  - "No confundir características de C23 con extensiones de GCC o Clang."
  - "No convertir el módulo avanzado en un requisito para todos."
  - "No agregar lecciones sin revisar redundancias."
  - "No evaluar solo la memorización de sintaxis."
  - Standards policy: "Estándar principal: ISO C23." with C17 differences explained when useful, compiler extensions labeled, examples tested on the declared compilers. Example command: `gcc -std=c23 -Wall -Wextra -Wpedantic -g programa.c -o programa`.
  - C23 is taught as boxes inside each topic: "**C básico**", "**C moderno**", "**Portabilidad**"; specialized features go to the advanced module.
- S4. Curriculum (target order; existing slugs keep their URLs; new lessons marked NEW). Deviation from the report, recorded as decision D1: the report puts "Punteros y modelo de memoria" (its module 4) before "Tipos derivados" (its module 5), but module 4 teaches pointers to arrays and `->` on structs, which need arrays and `struct` first. This plan teaches derived types first, then pointers, so no lesson uses a topic taught later (same rule as the Git curriculum test).
  1. **Introducción, compilación y fundamentos**: `introduccion-y-estructura`, `procesos-y-estados`, NEW `compilacion-y-enlazado` (preprocessor, compile, assemble, link, object vs executable, warnings, the C23 policy and the course command line), `variables-y-constantes` (literals, constants), `tipos-de-datos` (signed/unsigned, size guarantees, `sizeof`, `size_t`, implicit/explicit conversions, `bool` and its C23 status; replaces the JavaScript presentation, see S6), `entrada-y-salida` (checking `scanf` results, validation), `operadores` (short-circuit, evaluation order, defined/unspecified/undefined behavior).
  2. **Control de flujo**: `sentencia-if-else`, `operador-ternario`, `sentencia-switch-y-bloques-de-codigo` (blocks and scope), `sentencia-while`, `sentencia-for`, `sentencia-do-while` (`break`/`continue`), `programacion-esquematica-y-sentencias-anidadas` (stepwise refinement, choosing a control structure, common loop errors).
  3. **Funciones y programación modular**: `modularizacion-subprogramas-y-funciones` (declaration vs definition, prototypes, `.h`/`.c`, include guards, multi-file build and link, interface vs implementation), `variables-parametros-y-pasaje` (corrected: arguments are always passed by value; local/global, scope and duration; the pointer technique is only announced and taught in module 5), `recursividad` (call stack, depth limits).
  4. **Tipos derivados y datos estáticos**: `manejo-de-estructuras-secuenciales-de-datos` (partially merged into the next lesson to remove repetition), `arreglos-unidimensionales-y-multidimensionales` (bounds, index validation), `operaciones-con-arreglos`, `cadenas-de-caracteres-y-operaciones` (terminator, capacity, safe `<string.h>` use), `concepto-de-estructuras` (`struct` design, `union`, `enum`, `typedef`, size and padding at an introductory level), `busqueda-en-arreglos` (complexity), `ordenacion-de-arreglos` (time/space complexity, comparison).
  5. **Punteros y modelo de memoria** (priority module): NEW `punteros-y-direcciones` (objects and addresses, `&`, `*`, null pointers, validity, modifying a caller's variable through a pointer passed by value), NEW `punteros-arreglos-y-estructuras` (pointer arithmetic, array/pointer relation and differences, `->`, double pointers, `void *`, function pointers), NEW `duracion-y-ciclo-de-vida` (automatic, static and allocated storage duration, object lifetime, dangling pointers, pointer-related undefined behavior, stack and heap as explanatory models).
  6. **Memoria dinámica**: NEW `memoria-dinamica` (`malloc`, `calloc`, `realloc`, `free`, checking allocation failures, initialization and cleanup), NEW `propiedad-y-errores-de-memoria` (leaks, double free, use after free, ownership and transfer, designing functions that receive or return memory: who allocates, who uses, who frees).
  7. **Estructuras de datos dinámicas**: `estructuras-dinamicas-listas` (nodes, insert/search/delete, doubly linked as an extension), `estructuras-dinamicas-pilas`, `estructuras-dinamicas-colas`, `arboles-binarios` (BST, traversals, complexity, use cases and limits). All four rewritten so every node is allocated, checked and freed correctly.
  8. **Biblioteca estándar, E/S y persistencia**: NEW `biblioteca-estandar-y-errores` (library map, `<ctype.h>`, conversions with `strtol`/`strtod`, character I/O, return codes, `errno`), `archivos` (text and binary files, `fread`/`fwrite`, end of file, checking every read/write, closing and releasing resources).
  9. **Calidad, depuración y buenas prácticas**: NEW `depuracion-y-sanitizers` (reproduce, isolate, fix, verify; GDB/LLDB; AddressSanitizer; UndefinedBehaviorSanitizer; warnings as errors), NEW `pruebas-estilo-y-portabilidad` (unit and integration tests with `assert` and a tiny test runner, naming, documenting interfaces, portability, repository layout, measuring performance).
  10. **C moderno y C23** (advanced, optional path): NEW `c23-moderno` (evolution of the standards, `constexpr`, `typeof`/`typeof_unqual`, `nullptr`, `#embed`, `_BitInt`, enum and attribute changes; each item labeled standard vs extension vs optional), NEW `preprocesador-y-programacion-generica` (variadic macros, `_Generic`, `inline`, generic techniques), NEW `concurrencia-threads-y-atomics` (`<threads.h>` availability caveat, threads, atomics, synchronization).
  11. **Complementario: diseño de software en C** (advanced): `introduccion-a-poo-en-c`, `encapsulacion-y-abstraccion-en-c`, `objetos-metodos-y-diseno-basado-en-struct`, `polimorfismo-y-herencia-simulados-en-c`, reframed as design techniques (opaque types, operation tables, simulated polymorphism and its limits), never as "C is object oriented".
  Result: 32 existing + 12 NEW = 44 lessons. Modules 10 and 11 are marked as advanced in the roadmap descriptions.
- S5. Every lesson (es + en) has: objectives and prerequisites at the top; C23 policy respected (S3 boxes where relevant); a `## Ejercicios prácticos` / `## Practice exercises` section with at least three exercises and `<details><summary>Ver solución</summary>` solutions; only topics taught in earlier lessons (sequencing test, S10).
- S6. Presentations (S1 "mejorar tanto las presentaciones"):
  - The 8 priority presentations of report §7, one per target lesson: punteros y direcciones → `punteros-y-direcciones`; memoria dinámica → `memoria-dinamica`; stack y heap → `duracion-y-ciclo-de-vida`; punteros y arreglos → `punteros-arreglos-y-estructuras`; estructuras enlazadas → `estructuras-dinamicas-listas`; compilación y enlazado → `compilacion-y-enlazado`; ciclo de vida de objetos → `propiedad-y-errores-de-memoria` (dangling and use-after-free states); depuración → `depuracion-y-sanitizers`.
  - Replace `tipos_de_datos_en_javascript`, today linked to the C lesson `tipos-de-datos`, with a C presentation on types, `sizeof` and conversions (the JavaScript one stays in the catalog but is unlinked from the C lesson).
  - Review the 20 existing C presentations against the rewritten lessons (no contradictions, `pasaje por referencia` wording corrected in `paso_por_valor_y_referencia`).
  - Report §7 "Tres modos didácticos por presentación": **Aprender** (guided), **Practicar** (predict the next state), **Evaluar** (solve without hints). New presentations implement the three modes; existing ones get them in stage 3 (T-S3-PRES).
  - Organic design system and the presentation conventions in `AGENTS.md`; fullscreen works through the page wrapper already shipped.
- S7. Films (S1 "agregarás las animaciones"): one film per lesson in the `viaje-excepcion-java` style defined in `CLAUDE.md` (one persistent motion canvas, six scenes, ~8 steps, 90-120 s in both languages, `--xj-*` palette exception, editor left / isometric system right, test per film, catalog + both `[slug].astro` maps + thumbnail + `paletteExceptions`). Today the C course has no animations. `AnimationTag` widens to include `'C'`. Order of production follows the stages; within a stage, lessons in module order.
- S8. Activities (S1 "colocarás las actividades de autoevaluación y de código para desarrollar"), in `src/content/activities/c/<lesson-slug>/` (same convention as the Git activities), Spanish only (current collection convention):
  - `autoevaluacion-<slug>.es.md`: `kind: 'quiz'`, 10-12 questions mixing the report §9 types: conceptual, code reading and output prediction, error detection and correction; `codeLanguage: 'c'`; no voseo; only topics taught up to that lesson.
  - `<project-slug>.es.md`: `kind: 'project'`, objectives, requirements, `exampleOutput`, compile command with the course flags; projects compile and run against the example output (S9).
  - Integrating projects of report §8 placed as the project of the closing lesson of their module: calculadora de consola (end of module 3), sistema de calificaciones (module 4, after `ordenacion-de-arreglos`), agenda de contactos (module 8, `archivos`, needs strings + structs + files), lista de tareas (module 7, `estructuras-dinamicas-listas`), sistema de inventario as final project (module 9, `pruebas-estilo-y-portabilidad`), biblioteca de estructuras de datos (module 7, `arboles-binarios`), motor de búsqueda simple (module 8, `biblioteca-estandar-y-errores`), aplicación multihilo (module 10, advanced). Each integrating project carries the rubric of report §9 (25/20/15/15/10/10/5 %), with the memory criterion adapted before module 6.
- S9. "Los ejemplos fueron probados en el entorno declarado": every complete C program in lessons, solutions and project reference solutions compiles with `cc -std=c23 -Wall -Wextra -Wpedantic` without warnings (snippets marked as fragments or intentionally wrong code are exempt by an explicit marker). The course declares the environment: GCC 14+ or Clang 18+ with `-std=c23`, older compilers with `-std=c2x`/`-std=c17` and the differences noted.
- S10. Tests (repository policy, like `tests/courses-git-curriculum.test.mjs`): `tests/courses-c-curriculum.test.mjs` pins lesson order, slugs, roadmap, exercises with solutions, required topics per lesson, banned later topics (e.g. no `malloc` before `memoria-dinamica`, no `->` before `punteros-arreglos-y-estructuras`, no "pasaje por referencia" presented as a C mechanism); `tests/activities-c.test.mjs` pins one quiz + one project per lesson and their rules; one test per film; the compile check of S9 as a script plus a test that runs it when a C compiler is present and skips otherwise.
- S11. Done criteria: report §13 checklist, every item verified: standard declared; compilation and linking explained; types/conversions covered; pointers before dynamic structures; storage duration and lifetime; dynamic memory with errors; dynamic structures with correct memory management; `.h`/`.c` multi-file projects; standard library and files with error handling; debugging and tests; warnings and sanitizers; presentations cover pointers and memory; integrating projects with rubrics; examples tested in the declared environment; advanced content separated; verifiable learning outcomes.
- S12. Non-goals of this feature (report §11 platform items): playground, glossary page and per-lesson completion tracking are not built; they are listed as follow-ups.

## Tasks

Route column: "inline" or "delegated (parallel)" per the Writer trigger. Each lesson task covers es + en together. Forecast in authored lines: lesson rewrite ~600-900 per locale pair, new lesson ~1,200-1,800, quiz ~250, project ~120, presentation ~900-1,500, film ~1,800-2,000.

### Stage 1: consolidate the fundamentals (report Etapa 1, priority)

- [x] T1 (S4, S5, S10) inline: RED `tests/courses-c-curriculum.test.mjs` for the full target order (44 lessons, roadmap, exercises, sequencing bans); stage-1 lessons GREEN at stage end, later lessons tracked as pending in the test.
- [x] T2 (S9, S10) inline: compile-check script `scripts/check-c-examples.mjs` (extracts ```c blocks, honors the fragment marker, compiles with the course flags in a `mktemp -d` dir) + test that skips without a compiler.
- [x] T3 (S3, S4) inline: course policy: `index.md` roadmap reorder (modules 1-11, advanced labels), course description of the standard, `order` renumbering and file renames (slugs unchanged).
- [x] T4 (S4, S5) delegated (parallel): NEW `compilacion-y-enlazado`. Commit d80d2de.
- [x] T5 (S4, S5) delegated (parallel): expand `tipos-de-datos`, `variables-y-constantes`, `entrada-y-salida`, `operadores`.
- [x] T6 (S3, S4, S5) delegated (parallel): correct `variables-parametros-y-pasaje` and expand `modularizacion-subprogramas-y-funciones` (`.h`/`.c`, guards, multi-file), `recursividad` (call stack).
- [x] T7 (S4, S5) delegated (parallel): NEW `punteros-y-direcciones`, `punteros-arreglos-y-estructuras`.
- [x] T8 (S4, S5) delegated (parallel): NEW `duracion-y-ciclo-de-vida`, `memoria-dinamica`, `propiedad-y-errores-de-memoria`.
- [x] T9 (S8) delegated (parallel): quiz + project for every lesson of modules 1-3 and 5-6 (incl. calculadora de consola).
- [x] T10 (S6) delegated (parallel): presentations compilación y enlazado, punteros y direcciones, punteros y arreglos, stack y heap, memoria dinámica, ciclo de vida; C types presentation replacing the JavaScript link; fix `paso_por_valor_y_referencia` wording.
- [x] T11 (S7) delegated (parallel, one writer per film): films for the 8 lessons of stage 1 with new or rewritten mechanisms (`compilacion-y-enlazado`, `tipos-de-datos`, `variables-parametros-y-pasaje`, `punteros-y-direcciones`, `punteros-arreglos-y-estructuras`, `duracion-y-ciclo-de-vida`, `memoria-dinamica`, `propiedad-y-errores-de-memoria`).
- [ ] T12 (S9, S10, S11 partial) inline: registration (catalog, maps, `AnimationTag` `'C'`, `paletteExceptions`, AGENTS.md), compile check green, suite, astro check, browser verification, stage PR.

### Stage 2: reorganize the path (report Etapa 2)

- [x] T13 (S4, S5) delegated (parallel): module 4 lessons: merge `manejo-de-estructuras-secuenciales-de-datos` into arrays, expand arrays (bounds), strings (capacity, safety), `concepto-de-estructuras` (`union`, `enum`, `typedef`, padding), search and sort (complexity).
- [x] T13b (S4, S5) delegated: module 2 lessons 08-14 (blocks and scope, break/continue, sentinel, stepwise refinement). Done: commits 1b88629, 561aa38.
- [ ] T14 (S4, S5) delegated (parallel): module 7 rewrite: lists, stacks, queues, binary trees with correct allocation, checks and release.
- [x] T15 (S4, S5) delegated (parallel): module 8: NEW `biblioteca-estandar-y-errores`, expand `archivos` (binary, `fread`/`fwrite`, errors).
- [x] T16 (S4, S5) delegated: module 11 reframing of the four OOP lessons as design techniques.
- [ ] T17 (S8): quizzes + projects for modules 4, 7, 8, 11 (sistema de calificaciones, lista de tareas, biblioteca de estructuras de datos, agenda de contactos, motor de búsqueda simple).
- [ ] T18 (S6): presentation estructuras enlazadas; review of the existing array, string and sort presentations against the rewritten lessons.
- [ ] T19 (S7): films for module 2 (control flow), module 4 and module 7-8 lessons.
- [ ] T20 inline: registration, checks, browser verification, stage PR.

### Stage 3: professionalize the practice (report Etapa 3)

- [ ] T21 (S4, S5): NEW `depuracion-y-sanitizers`, `pruebas-estilo-y-portabilidad`.
- [ ] T22 (S8): quizzes + projects for module 9, final project sistema de inventario with rubric.
- [ ] T23 (S6): presentation depuración; T-S3-PRES three modes (Aprender / Practicar / Evaluar) added to the C presentations, new ones first.
- [ ] T24 (S7): films for module 9 and the remaining lessons of modules 1 and 3 (01, 02, 04, 06, 07, 15, 17).
- [ ] T25 inline: registration, checks, browser verification, stage PR.

### Stage 4: modern and advanced C (report Etapa 4)

- [ ] T26 (S4, S5): NEW `c23-moderno`, `preprocesador-y-programacion-generica`, `concurrencia-threads-y-atomics` (advanced).
- [ ] T27 (S8): quizzes + projects for module 10 (aplicación multihilo).
- [ ] T28 (S7): films for module 10 and module 11.
- [ ] T29 (S11) inline: report §13 checklist verified item by item, final PR.

## Log

- L1 (2026-11-22) user request: "Vamos a mejorar el curso de /cursos/c/ para ello vas a analizar el docuemnto /Users/facundouferer/Downloads/informe_redisenio_c_de_cero_a_profesional.md y mejorar tanto las presentaciones, agregarás las animaciones y colocarás las actividades de autoevaluación y de código para desarrollar."
- L2 (2026-11-22) scope answer: "Plan completo documentado".
- L3 evidence (current state): 32 lessons in 5 roadmap modules; 21 presentations linked to C lessons (one is `tipos_de_datos_en_javascript` linked to `tipos-de-datos`); 0 C animations; 0 C activities. No lesson teaches pointers on its own; `malloc` first appears in `estructuras-dinamicas-colas` (lesson 23) and `arboles-binarios`, with no `free` in the trees lesson; `sizeof` appears only in lessons 23-24; `variables-parametros-y-pasaje` says "por referencia" 7 times; no lesson states a C standard or compile flags.
- L4 evidence: Apple clang 21 compiles `constexpr`, `typeof`, `nullptr` and `bool` with `cc -std=c23 -Wall -Wextra -Wpedantic` and runs them (exit 0), so S9 is checkable locally.
- L5 decision D1: derived types (report module 5) are taught before pointers (report module 4) because pointers to arrays and `->` depend on them; recorded in S4.
- L6 forecast: ~12 new lessons, ~20 rewritten lessons, 88 activities, 9 new presentations + reviews, 44 films. Films dominate (~80k lines); stage 1 alone is roughly 30-35k authored lines including its 8 films.
- L7 (2026-11-22) user: "si, arranca con la etapa 1 y despues con todas las siguientes. quiero que termines todas las etapas y que seas autónoma en sus realizaciones para terminar toda la actuación."
- L8 T1-T3: shared data in `tests/helpers/c-curriculum.mjs` (`DONE_STAGE`, `LESSONS`, `TAUGHT_AT`, `activityStage`); tests `courses-c-curriculum`, `activities-c`, `c-examples-compile`; `scripts/check-c-examples.mjs` (baseline: 140 programs, 12 fail in lessons 01, 04, 21, 16). 58 renames to the new numbering, roadmap regenerated with existing lessons only (`resolveRoadmap` throws on unknown slugs, so new lessons enter the roadmap when their file exists).
- L9 T4-T8 done (commits d80d2de, the module 1 commit after it): curriculum 185/185, compile check green (lessons 03-07, 15-17, 25-29). Writers verified outputs by running the programs (ASan for 25-29). Known: intentionally wrong memory programs in 27/29 compile under Apple clang but GCC 12+ `-Wuse-after-free` may reject them; lesson 06 previews `if`/`while` as labelled recipes before lessons 8/11.
- L10 T9a done (commit 44554c9): quizzes + projects for lessons 01, 02, 08-14. Stage 2 must fix `operador-ternario` using `char *` before lesson 25.
- L11 Decisions: `tipos_de_datos_en_javascript` is a multi-language types comparison; moved to `javascript/tipos-de-datos` (S6). `paso_por_valor_y_referencia` uses pointer code and compares languages: wording fixed (C has no pass by reference) and moved to `punteros-y-direcciones` (it showed pointers at lesson 16). Catalog entries for the 8 stage-1 films and 7 presentations added by the parent before launching their writers; `highlightCode` gained `'c'` (commit f8088d5).
- L12 Stage 1 content done: lessons (d80d2de, module 1 commit), activities (44554c9, c5201fa, 2672e5d), presentations (bcfc58a; layout test now counts one component per catalog entry), films (3c4e751, 91/91 film tests). T12 browser verification delegated to a verifier (port 4341). Stage 2 lessons done except 30-33: 08-10 (1b88629), 11-14 (561aa38), 18-21 (de2c49d), 22-24 (e8fb444), 34-35 (4614927), 41-44 (4f2ecf1); stage 3 lessons 01-02 (bcf125f). Activities test voseo regex made accent-aware. In flight: module 2 and 4 films, activities 18-24, 34-35, 41-44, lessons 30-33, 36-37, 38-40.
