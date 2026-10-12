# Update "Lo que la IA no puede hacer por nosotros" and add its presentation

## Objective

Sync the bilingual article with the revised draft, illustrate each concept with
its image, and publish an image-based presentation in the presentations section.

## Problem

The draft `docs/Lo que la IA no escribe por nosotros.md` was restructured: the
per-concept "Qué puede promover la empresa" lists moved into a final
"Plan de capacitaciones" section with a training table and grouped practices.
Concept and slide images were delivered in
`public/img/articles/lo_que_la_ia_no_puede/` with spaces and accents in names.

## Why

The published article must match the author's latest text, and the slides make
the five concepts reusable as a talk.

## Scope

- Rename the images to ASCII kebab-case (no spaces, no accents).
- Rewrite `src/content/articles/lo-que-la-ia-no-puede-hacer-por-nosotros.{es,en}.md`
  body from the draft; keep frontmatter (title, slug, date, image).
- Place each concept image at the end of its concept section (El cuello de
  botella has two).
- New presentation `lo-que-la-ia-no-puede-hacer-por-nosotros` built from the
  `presentacione0N_*` slides, listed in `/presentaciones` and `/en/presentaciones`
  under a new `IA` category.
- The presentation belongs to an article, not a course lesson: `lesson` becomes
  optional in `src/data/presentations.ts`; lesson-only UI must skip it.

## Constraints

- Organic design system (`DESIGN.md`): tokens and system classes only.
- Technical artifacts in English; article content in es/en.
- Do not commit `docs/`, `.atl/` or `.DS_Store`.

## Tasks

- [x] T1 — Rename images; update article es/en with new content and concept images. Route: delegated (writer trigger: 2+ non-trivial files).
- [x] T2 — Presentation component, data entry with optional lesson, routes, category, tests. Route: delegated (same writer).
- [ ] T3 — Verify build, tests, rendered routes; commit on main and push (user asked to publish).

## Acceptance criteria

- Article es/en mirror the new draft structure, with 6 concept images placed at the end of their sections.
- `/presentaciones/lo-que-la-ia-no-puede-hacer-por-nosotros` and its `/en` route render 5 slides plus title.
- `npm run build` passes; test suite shows only the 6 known pre-existing failures.

## Checks

- `npm test` (node --test), `npx astro check`, `npm run build`.

## Progress

- 2026-10-12: document created.
- 2026-10-12 (T1): 11 images renamed to ASCII kebab-case. Article es/en bodies
  rewritten from the draft (H1/date line dropped, `&#32;` and broken bold
  removed, headings in sentence case, per-concept "Qué puede promover la
  empresa" replaced by "Plan de capacitaciones" / "Training plan" with
  Capacitaciones table + grouped practices). Six concept images placed at the
  end of their sections with localized alt text; one sentence links to the
  presentation before "Para saber más" / "Further reading". Only intentional
  wording change vs the draft: "cada uno de las cuatro problemáticas" →
  "cada una de las cuatro problemáticas" (gender agreement).
- 2026-10-12 (T2): `Presentation.lesson` is now optional and a new optional
  `article: { slug }` owner exists (exactly one of the two per presentation);
  new helper `getArticleForPresentation`; lesson helpers skip article-bound
  entries. `IA` tag + `~/ia` / `~/ai` filter. New token-only component
  `src/components/presentaciones/lo-que-la-ia-no-puede-hacer-por-nosotros.astro`
  (prefix `ia`, title + 5 infographic slides + closing slide with article link,
  `object-fit: contain`, system `.btn`/`.kicker`/`.tag` classes). Infographics
  are not wrapped in `.washed` (DESIGN.md §6.3 targets photographs; washing
  would reduce text legibility). `PresentationLessonLink` renders
  "Parte de: <artículo>" for article-bound presentations; catalog cards show
  "Artículo: <title>". Catalog `data-tag` now uses the Spanish tag (the filter
  key), which also fixes the English `~/algorithms` filter.
- Evidence: RED — new test failed (`getArticleForPresentation` missing),
  catalog/component counts 51≠52. GREEN — targeted presentation tests 46/46;
  full suite 561 pass / 6 fail (only the 6 known pre-existing failures);
  `astro check` 0 errors; `npm run build` complete (454 pages); built es/en
  presentation pages render 7 slides, 5 slide images and the article back-link;
  built es/en article pages reference all 6 concept images and the
  presentation link.

## Next step

T3: parent verification, commit and push.
