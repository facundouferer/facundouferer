# Lesson activities

## Objective

Add practice **activities** to course lessons: an "Actividades" access next to the
lesson title (like the presentations access) that leads to a per-lesson activity
list, and from there to each activity page.

## Why

Lessons only have reading content and presentations; students need exercises to
practice and self-assess.

## Scope

- Pilot lesson: `/cursos/java/07-fundamentos-poo-clases-y-objetos` (Spanish only).
- Routes: `/cursos/[course]/[lesson]/actividades` (list) and
  `/cursos/[course]/[lesson]/actividades/[activity]` (detail).
- Activity kinds (extensible): `project` (build a program from a statement and
  requirements) and `quiz` (question kinds: `single-choice`, `true-false`,
  extensible to more).
- Quiz: answer all questions, press "Calificar", see per-question correct/incorrect
  with explanation, and a score always normalized to 10 points.
- Two pilot activities for lesson 07: one project, one quiz.

## Constraints

- Organic design system only (`DESIGN.md`, `Organic/`): tokens, system classes,
  Lucide icons at stroke-width 2.75.
- TDD per `AGENTS.md` (source: AGENTS.md rule 6; runner: `npm test` →
  `node --test tests/**/*.test.mjs`).
- English (`/en/courses`) routes are out of scope for the pilot; the data model
  carries `lang` so they can be added later.

## Tasks

- [x] T1 — Activities content model (collection schema, helpers, grading logic) with tests
- [x] T2 — Routes: list + detail pages, lesson title access, quiz grading UI
- [x] T3 — Pilot content for lesson 07 (project + quiz)
- [x] T4 — Build + tests green, docs (`AGENTS.md` content model) updated
- [x] T5 — User feedback: render quiz code as a real code block, fix cramped inline options

## Route per task

Delegated direct (writer trigger: 2+ non-trivial files).

## Acceptance criteria

- Lesson 07 shows an "Actividades" access next to the title; lessons without
  activities show nothing.
- The list page lists both activities with kind and title; each links to its page.
- Quiz grading marks each answer, explains the right one, and shows `X / 10`.
- `npm test` and `npm run build` pass.

## Progress / evidence

### T1 — content model (done)

- `src/content.config.ts`: added `activities` collection. Schema is
  `z.discriminatedUnion('kind', [projectActivity, quizActivity])`; quiz
  questions are their own nested discriminated union
  (`single-choice` | `true-false`) for future extensibility (e.g.
  `multiple-select`). `superRefine` checks `correctOptionId` matches a real
  option id.
- `src/data/activities/grading.ts`: pure grading module — `isAnswerCorrect`,
  `gradeQuiz` (per-question results, correct/total, score normalized to 10,
  rounded to one decimal), `formatScore` (Spanish comma, e.g. `7,5 / 10`),
  `getCorrectAnswerLabel`. No Astro/DOM dependency; unit-tested directly.
- `src/utils/activities.ts`: `getActivitiesForLesson`,
  `getActivityCountsForCourse`, `resolveActivityEntry` — mirror
  `src/data/presentations.ts` helper style but operate on `CollectionEntry[]`
  since activities are a content collection, not a static catalog.
- Tests: `tests/activities-grading.test.mjs` (13 tests, real logic
  invocation), `tests/activities-content-model.test.mjs` (13 tests: schema
  regex checks + real helper invocation with fake entries). RED observed
  (module/collection not found) before implementation, GREEN after.
- `npm test`: 364 tests, 359 pass, 5 fail — the 5 failures are pre-existing
  and unrelated (CourseBreadcrumb, testimonials, language-strategy doc),
  confirmed present on the branch before this change too (verified via
  `git stash`, untracked new files retained).
- Commit: `f765f1a` feat(activities): add activities content model, helpers,
  and grading logic.

### T2 — routes (done)

- `src/components/LessonActivitiesAccess.astro`: pill link next to the lesson
  title (mirrors `LessonPresentationsMenu`'s spot/styling), Lucide
  `list-checks` icon at stroke-width 2.75, count badge, renders nothing when
  count is 0.
- `src/pages/cursos/[course]/[lesson].astro`: fetches `activities`, wires
  `LessonActivitiesAccess` next to `LessonPresentationsMenu`.
- `src/pages/cursos/[course]/[lesson]/actividades/index.astro`: list page —
  lesson context, back link, activity cards (kind tag, title, description,
  estimated time). `getStaticPaths` only generates lessons that have at
  least one published activity.
- `src/pages/cursos/[course]/[lesson]/actividades/[activity].astro`: detail
  page. `project` kind renders the markdown statement (`<Content />`) plus
  objectives/requirements/example-output/extension-challenges/delivery-tips
  from frontmatter. `quiz` kind renders each question as an accessible
  `<fieldset>/<legend>` radio group (`.radio`, ported into
  `src/styles/global.css` from `Organic/styles.css` alongside `.field`, per
  AGENTS.md porting rule); a client `<script>` imports `gradeQuiz`/
  `formatScore` from the pure grading module (not reimplemented inline),
  toggles `data-graded`/`data-result` attributes per question, and all
  label text (Correcto/Incorrecto/Sin responder/¿Por qué?) is pre-rendered
  server-side via `t()` and shown/hidden with CSS attribute selectors — the
  script never writes translated text, per the i18n rule in AGENTS §6.10.
  "Calificar" grades, "Reintentar" resets.
- i18n: added `courses.activities.*` to both `es.json` and `en.json`
  (English strings added per AGENTS §6.10 even though the English route is
  out of scope for the pilot, so `t()` never breaks if English is added
  later).
- AGENTS.md: new "Activities" subsection under §6.9 documenting the schema,
  helpers, grading module, and render sites.
- Decision: skipped the optional sidebar activity-count badge
  (`LessonsList.astro`) — the task explicitly allowed skipping it "if not
  trivial," and wiring it through the course/lesson pages'
  `getActivityCountsForCourse` calls was more than trivial for this pilot.
- Decision: activity pages pass `esPath` only (no `enPath`/English route);
  `BaseLayout`'s `enPath` default (`/en/`) is used for the hreflang
  alternate, since there is no English activities route yet — acceptable
  given the pilot is explicitly Spanish-only.
- Tests: `tests/activities-routes.test.mjs` (20 tests: component, page,
  lesson-integration, i18n, and AGENTS.md content-presence checks, mirroring
  `tests/lesson-presentations-menu.test.mjs` style). RED observed (files
  missing) before implementation, GREEN after.
- `npx astro check`: 2 pre-existing errors in
  `grafos-algoritmos-java.astro` (unrelated `baseVal` TS errors, present
  before this change); 0 errors/warnings from any activities file. Fixed one
  hint by adding `is:inline` to the JSON data `<script>` tag (it's static
  JSON, not a module).
- `npm test`: 384 tests, 379 pass, 5 fail — same 5 pre-existing unrelated
  failures as after T1 (CourseBreadcrumb ×2, testimonials ×2, language
  strategy doc).
- Commit: `19162d0` feat(activities): add activities list/detail routes and
  lesson title access.

### T3 — pilot content (done)

- `src/content/activities/java/07-fundamentos-poo-clases-y-objetos/gestion-inventario-tienda.es.md`
  (`kind: project`, order 1): "Sistema de Gestión de Inventario de una
  Tienda" — a `Producto` class with public fields, `venderUnidades`/
  `reponerStock`/`actualizarPrecio` (uses `this` to resolve shadowing)/
  `mostrarFicha`, ≥3 independent instances via `new`, and a reference-
  aliasing demonstration. Deliberately scoped to lesson 07 only: verified
  lesson 08 (`08-constructores-y-encapsulamiento.es.md`) is the one that
  teaches custom constructors and access modifiers, so this activity uses
  only public fields and no parametrized constructor.
- `.../autoevaluacion-clases-y-objetos.es.md` (`kind: quiz`, order 2): 10
  questions (6 single-choice, 4 true-false) covering class-vs-object,
  the `new`/Heap instantiation cycle, default values, `this`/shadowing, and
  reference aliasing vs. independent instances (including a "same output
  either way" pair — Q8 aliasing vs. Q10 independent `new` calls — to test
  real understanding, not pattern-matching). Every question has an
  `explanation`. Reviewed each answer against actual Java semantics.
- Tests: `tests/activities-pilot-content.test.mjs` (9 tests: file count,
  frontmatter fields, lesson-07-scope content checks, explicit "no lesson-08
  concepts" checks, question-count/kind-mix checks). RED (files missing)
  before authoring, GREEN after.
- `npm run build`: confirmed the collection actually parses against the
  real zod schema (not just regex) and generates all 3 expected pages:
  `dist/cursos/java/07-fundamentos-poo-clases-y-objetos/actividades/index.html`,
  `.../actividades/gestion-inventario-tienda/index.html`,
  `.../actividades/autoevaluacion-clases-y-objetos/index.html`.

### T4 — verification + a live bug found and fixed (done)

- Live-tested the full quiz flow in Chrome (via `npm run preview` +
  claude-in-chrome), not just static/unit checks: navigated lesson 07 →
  clicked the "Actividades" access → list page → quiz detail page →
  answered a mix of correct/incorrect/unanswered questions → clicked
  "Calificar".
- **Bug found live**: after grading, both "Calificar" and "Reintentar"
  buttons stayed visible — `.btn { display: inline-flex }` (an author
  style) overrides the browser's native `[hidden] { display: none }` UA
  rule, so `gradeBtn.hidden = true` had no visual effect. This is the exact
  same class of bug `LessonPresentationsMenu.astro` already documents and
  guards against for its dropdown panel. Fixed by adding
  `.quiz-actions [hidden] { display: none !important; }`; added a
  regression test (`tests/activities-routes.test.mjs`) and re-verified live
  — after the fix, grading correctly hides "Calificar" and shows only
  "Reintentar", and "Reintentar" correctly clears all radios and hides the
  results/score.
- Verified score math live against a real answer set (8/10 correct →
  "Puntaje: 8,0 / 10"; 2/10 correct → "Puntaje: 2,0 / 10"), matching
  `gradeQuiz`/`formatScore` exactly.
- Also cleaned up an authoring issue found during the visual check: the
  project statement's markdown body referenced the literal frontmatter key
  `exampleOutput` in prose and duplicated the auto-rendered "Salida
  esperada" heading — reworded to avoid both.
- Fix commit: `3b2b9bb` fix(activities): hide the Calificar button after
  grading, tidy project copy.

## Final verification (run and observed)

- `npm test`: 394 tests, 389 pass, 5 fail. The 5 failures
  (`CourseBreadcrumb` ×2, `testimonials` ×2, `language strategy is
  documented for article publication flow`) are pre-existing and unrelated
  to this feature — confirmed present on the branch before any of this
  work (verified via `git stash` at T1, and unchanged in every subsequent
  run).
- `npm run build`: succeeds, 361 pages total, including the 3 activities
  pages for lesson 07 (list + 2 detail pages) confirmed present in `dist/`.
- `npx astro check`: 2 pre-existing errors in
  `src/components/presentaciones/grafos-algoritmos-java.astro` (unrelated
  `baseVal` TS errors on `className`, present before this change); 0
  errors/warnings from any file this feature touched.
- Live browser verification (claude-in-chrome against `npm run preview`):
  "Actividades" access renders next to the lesson title with the right
  count; list page shows both cards with kind tags; quiz grading marks
  each question correct/incorrect/unanswered with the correct answer and
  explanation shown, and the score is exactly right (`X,Y / 10`);
  "Reintentar" fully resets the quiz.

### T5 — user feedback: real code blocks + fixed options layout (done)

- **Problem reported**: on the quiz page, questions with code (e.g. Q10 of
  `autoevaluacion-clases-y-objetos.es.md`) had the code crammed into the
  question heading as `;`-joined plain text, and the radio options rendered
  inline and cramped ("Marta◯ Carlos◯ Laura◯ null") instead of stacked.
- **Root cause of the options bug**: `[activity].astro` used
  `class="stack quiz-options"`, following the `.stack` class used in
  `Organic/components/forms.html`'s radiogroup reference markup — but
  `.stack` only exists in that file's own demo-scaffolding `<style>` block
  ("Demo scaffolding only — everything visual comes from ../styles.css"),
  never in `Organic/styles.css` or `src/styles/global.css`. So `.stack` did
  nothing, and `.radio` (`display: inline-flex`, correctly ported and left
  untouched) flowed its labels inline inside a plain block `<div>`. Fixed by
  adding `display: grid;` directly to the already-existing, component-local
  `.quiz-options` rule (not a system class — safe to restyle per AGENTS.md
  §6.6), replicating the `.stack { display: grid; gap: ... }` behavior the
  reference relies on. Dropped the dead `stack` class token from the markup.
- **Schema**: `src/content.config.ts` — added a shared `quizQuestionCodeFields`
  object (`code: z.string().optional()`, `codeLanguage: z.string().default('java')`)
  spread into both `singleChoiceQuestion` and `trueFalseQuestion`, so a
  question can carry a real multi-line snippet plus its language.
- **Rendering**: `[activity].astro` now imports `Code` from `astro:components`
  and renders `question.code` (when present) below the legend, wrapped in
  `<div class="article-body quiz-code">` so it reuses the exact same
  Shiki `pre`/`code` styling already used for lesson/article markdown code
  fences (`src/styles/article-body.css`) — same theme (`github-dark`,
  Astro's default, matching what `astro.config.mjs` already implies with no
  `shikiConfig` override), same `astro-code` class, same padding/radius. No
  new styling invented.
- **Inline code**: added `src/utils/renderInlineCode.ts` — a tiny, unit-tested,
  dependency-free function that escapes HTML first, then converts
  backtick-delimited spans (`` `x` ``) into `<code>x</code>`, safe to pass to
  `set:html` since the only markup it can ever produce is `<code>` around
  already-escaped text. Applied via `set:html` to the question legend
  (prompt), each option's text, the correct-answer label, and the
  explanation. `aria-label` on the radiogroup uses a backtick-stripped plain
  copy of the prompt (screen readers shouldn't hear literal backticks).
- **Content rewrite**: rewrote
  `src/content/activities/java/07-fundamentos-poo-clases-y-objetos/autoevaluacion-clases-y-objetos.es.md`
  — Q8 and Q10 (the two questions with real multi-statement code) now have a
  `code: |-` YAML block scalar with real line breaks/indentation, and a short
  plain-language prompt ("¿Qué valor tiene `p1.nombre` después de ejecutar
  este código?", "¿Qué imprime este código?"). All 10 prompts/options/
  explanations reviewed; short inline code mentions (`` `this` ``, `` `new` ``,
  `` `this.precio` ``, type names, etc.) now use backticks instead of being
  bare identifiers mixed into prose.
- **Type note**: `<Code>`'s `lang` prop is Shiki's closed `CodeLanguage` union;
  our `codeLanguage` field is intentionally a free-form string (so future
  non-Java activities can pick any language). Bridged with one explicit,
  commented `as any` at the single call site — `Code.astro` itself falls
  back to `'plaintext'` for any string it doesn't recognize, so this is safe
  at runtime. Deep-importing Astro's internal `CodeLanguage` type wasn't a
  viable alternative: `astro`'s `package.json` `exports` map doesn't expose
  that path, so it wouldn't resolve under strict module resolution.
- **Tests (TDD, RED confirmed before implementation)**:
  `tests/activities-inline-code.test.mjs` (new, 8 tests: HTML escaping,
  backtick→`<code>` conversion, XSS-safety, unmatched-backtick edge case);
  `tests/activities-content-model.test.mjs` (+1 test: schema field presence
  on both question kinds); `tests/activities-pilot-content.test.mjs` (+4
  tests: Q8/Q10 have real `code:` fields with line breaks, no prompt crams
  multiple `;`-joined statements anymore, backticked inline code present);
  `tests/activities-routes.test.mjs` (+3 tests: `Code`/`renderInlineCode`
  imports and usage wired in, `.quiz-options` uses `display: grid`).
- **Verification**:
  - `npm test`: 410 tests, 405 pass, 5 fail — the same 5 pre-existing
    unrelated failures as every prior task (`CourseBreadcrumb` ×2,
    `testimonials` ×2, `language strategy is documented for article
    publication flow`); confirmed unchanged before/after this change.
  - `npm run build`: succeeds, 361 pages.
  - `npx astro check`: 2 pre-existing errors in
    `grafos-algoritmos-java.astro` (unrelated `baseVal` issue, present
    before this change); 0 errors from any file this task touched (verified
    the `<Code lang=...>` type mismatch introduced by this change was fixed
    with the `as any` bridge above).
  - Inspected the actual built HTML
    (`dist/cursos/java/07-fundamentos-poo-clases-y-objetos/actividades/autoevaluacion-clases-y-objetos/index.html`):
    Q8/Q10 render a real `<pre class="astro-code github-dark">` block with
    one `<span class="line">` per source line (multi-line, syntax
    highlighted); `.quiz-options{display:grid;...}` present in the compiled
    CSS.
  - Live-verified in Chrome against `npm run preview`: options render as a
    clearly separated vertical list (not the reported inline/cramped
    layout); Q8 and Q10 show the question on top and a proper dark
    syntax-highlighted multi-line code block below it; inline backticked
    terms (`this`, `new`, `int`, etc.) render as `<code>` throughout;
    answered and graded Q10 correctly — "Correcto" tag, explanation with
    inline code, "Reintentar" shown after grading.

## Decisions / things a reviewer should know

- Skipped the optional sidebar activity-count badge (task allowed skipping
  if non-trivial).
- Activity pages pass only `esPath` (no English route); `BaseLayout`'s
  default `enPath` (`/en/`) is used for the hreflang alternate, acceptable
  since the pilot is explicitly Spanish-only.
- Quiz question-kind schema and the activity `kind` schema are both
  `z.discriminatedUnion`, so a new question kind (e.g. `multiple-select`)
  or activity kind can be added later without touching existing content or
  callers.
- `formatScore` always shows one decimal (`8,0 / 10`, not `8 / 10`) for
  consistency, matching the task's own example (`7,5 / 10`).
