# Java lesson 06: localizable diagrams and practice

## Objective
Replace the two raster diagrams in Java lesson 06 with clear, Organic-styled, inline SVG diagrams in both Spanish and English; add a Spanish activity and self-evaluation limited to lesson 06 concepts; merge the verified feature branch into local `main`.

## Problem and scope
The current diagrams are JPGs whose labels cannot be localized. Lesson 06 introduces procedural vs object-oriented organization and the four pillars. Practice must not depend on concepts first taught in later lessons (class instantiation, `new`, `this`, constructors, exceptions).

## Constraints
- Preserve unrelated dirty `.atl/` files.
- Inline SVG per locale with translated text and accessible title/caption; Organic tokens and existing diagram styling.
- Follow the existing activities collection schema and Spanish-only pilot.
- TDD: required by AGENTS.md §5; runner `npm test`; check `npm run astro -- check` and build.
- Delivery: local feature branch and local `main` merge only; no push. Strategy: ask-on-risk, forecast ~350–500 authored lines (SVG may exceed heuristic for clarity).

## Tasks
- [x] T1 (delegated): Add focused failing tests for localized inline SVG diagrams and lesson-scoped activity/quiz; observe RED. Acceptance: tests assert no JPG diagram references, translated SVG labels, schema-aligned activity/quiz, and no future-lesson concepts. Check: targeted `node --test`.
- [x] T2 (delegated): Replace both diagrams in both lesson locales with accessible Organic SVG and verify translation. Acceptance: visuals explain their concepts, all diagram labels are locale-native. Check: targeted test, Astro check.
- [x] T3 (delegated): Add conceptual project activity and autoevaluation for lesson 06; verify and commit. Acceptance: both render through generic routes, use only already-taught concepts. Check: targeted test, `npm test`, Astro check, build.
- [ ] T4 (inline): Merge verified feature commits into local `main` without touching unrelated dirty files. Check: git status/log and main contains commits.

## Progress
T1–T3 implemented on the feature branch. TDD RED: `node --test tests/java-lesson-06-content.test.mjs` failed 2/2 before implementation. GREEN: same command passed 2/2. Both locale diagrams render as inline SVG with translated title, text and captions; the generic activity routes generated the Spanish project and quiz. `npm run build` passed (367 pages), including both activity detail routes. Full `npm test` ran 431 tests: 425 passed, 6 failed in unrelated pre-existing CourseBreadcrumb, snapshot, language-strategy and testimonials checks. `npm run astro -- check` reported 2 unrelated existing type errors in `grafos-algoritmos-java.astro` (`className.baseVal`); no lesson 06 errors. `git diff --check` passed. Runtime harness: generated `dist/` lesson and activity routes inspected. Rollback boundary: two lesson locale files, two activity files, focused test and this task document. Next: parent handles local main merge (T4) and native review state.
