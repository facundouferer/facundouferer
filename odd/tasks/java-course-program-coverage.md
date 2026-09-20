# Complete the Java course program coverage

Expand the bilingual Java course so every missing or partial topic from the
Programación II 2026 program is taught with explanations, examples, and
verifiable ES/EN parity.

## Problem

The current 22-lesson course covers most of the program, but eleven topics are
absent and five are only mentioned. Learners therefore encounter later data
structures, concurrency, tooling, and Spring material without all the required
foundations or operational practice.

## Why

The course should be a complete learning path, not a checklist of terms. Each
topic must explain the mental model, show a practical Java or tooling example,
and state the relevant tradeoffs and failure modes.

## Scope

- Add five bilingual lesson pairs for algorithmic foundations, Git/GitHub,
  N-ary trees, and debugging/refactoring.
- Expand seven existing bilingual lesson pairs for the remaining gaps.
- Keep every existing slug stable and use `order` for the visible sequence.
- Add focused regression tests for topic coverage, bilingual parity, and order.
- Do not change the content schema or rename existing lesson routes.

## Constraints

- Artifacts are written in professional Spanish and English according to each
  lesson locale; repository-facing documentation remains in English.
- TDD is enabled by `AGENTS.md`; runner: `node --test`.
- Every task follows RED → GREEN → REFACTOR and closes with a Conventional
  Commit containing its tests and lesson content.
- Existing unrelated changes in `.atl/.skill-registry*` are out of scope and
  must not be staged or modified.
- The ~400 authored-line guideline is advisory. Preserve pedagogical clarity;
  split only at cohesive learning boundaries, never by compressing content.

## Delivery

- Strategy: `single-pr`.
- Forecast: approximately 3,000–4,500 authored changed lines across 12 work
  units; chained pull requests are recommended.
- Size exception: explicitly accepted by the user on 2026-09-19; all work units
  will be delivered in one pull request.
- Reviewability: preserve cohesive Conventional Commits inside the single PR.

## Tasks

- [x] **JAVA-COVERAGE-01 — Algorithm development and complexity**
  - Route: delegated; writer trigger (new bilingual lesson pair plus tests).
  - Add `23-algoritmia-verificacion-y-complejidad.{es,en}.md` covering algorithm
    phases, verification, time/space analysis, and asymptotic notation through
    `O(n²)`.
  - Acceptance: localized pair exists; examples distinguish correctness from
    efficiency; focused coverage tests pass.

- [x] **JAVA-COVERAGE-02 — IDEs, Java API, and Javadoc**
  - Route: delegated; writer trigger (bilingual expansion plus tests).
  - Expand `01-conceptos-basicos.{es,en}.md` with local/online IDE tradeoffs and
    a practical workflow for reading Java API/Javadoc documentation.
  - Acceptance: learners can choose an IDE and navigate a class, method,
    parameters, return value, exceptions, and versioned API documentation.

- [x] **JAVA-COVERAGE-03 — Variable scope and recursion**
  - Route: delegated; writer trigger (two bilingual lesson pairs plus tests).
  - Expand lessons 02 and 05 with Java scope rules, direct/indirect/tail
    recursion, stack costs, and when iteration is safer.
  - Acceptance: examples distinguish locals, parameters, fields, and `static`;
    recursion guidance explains both use cases and failure risks.

- [x] **JAVA-COVERAGE-04 — Git/GitHub foundations and remotes**
  - Route: delegated; writer trigger (new bilingual lesson pair plus tests).
  - Add `24-git-github-fundamentos-y-remotos.{es,en}.md` covering installation,
    configuration, repositories, GitHub, clone, fetch, pull, and push.
  - Acceptance: commands form a safe end-to-end local/remote workflow and
    explain common failure handling.

- [x] **JAVA-COVERAGE-05 — Git branches, merges, conflicts, and rebase**
  - Route: delegated; writer trigger (new bilingual lesson pair plus tests).
  - Add `25-git-ramas-merge-conflictos-y-rebase.{es,en}.md` with branch-based
    collaboration, merge, conflict resolution, and safe rebase guidance.
  - Acceptance: history-rewriting risks and recovery steps are explicit.

- [x] **JAVA-COVERAGE-06 — Queue-based event simulation**
  - Route: delegated; writer trigger (bilingual expansion plus tests).
  - Expand `14-tad-pilas-y-colas.{es,en}.md` with a discrete-event simulation
    implemented using a priority queue.
  - Acceptance: event ordering, simulated clock, and deterministic tie-breaking
    are explained and tested by textual coverage assertions.

- [ ] **JAVA-COVERAGE-07 — N-ary trees and indexed representations**
  - Route: delegated; writer trigger (new bilingual lesson pair plus tests).
  - Add `26-arboles-n-arios-y-representacion-con-vectores.{es,en}.md` covering
    N-ary trees, binary↔N-ary transformations, and vector/index storage.
  - Acceptance: representations are compared with explicit complexity and
    invalid-index handling.

- [ ] **JAVA-COVERAGE-08 — Floyd–Warshall**
  - Route: delegated; writer trigger (bilingual expansion plus tests).
  - Expand `18-grafos-representacion-y-algoritmos.{es,en}.md` with the
    Floyd–Warshall algorithm, matrix evolution, complexity, and comparison with
    Dijkstra.
  - Acceptance: example handles unreachable vertices and explains negative
    edges and negative-cycle detection.

- [ ] **JAVA-COVERAGE-09 — Native distribution**
  - Route: delegated; writer trigger (bilingual expansion plus tests).
  - Expand `19-archivos-persistencia-y-empaquetado-jar.{es,en}.md` with
    `jpackage` and a bounded Launch4j comparison for Windows.
  - Acceptance: prerequisites, platform-specific builds, output verification,
    and packaging tradeoffs are explicit.

- [ ] **JAVA-COVERAGE-10 — Thread coordination and deadlocks**
  - Route: delegated; writer trigger (bilingual expansion plus tests).
  - Expand `20-programacion-concurrente-hilos-y-pools.{es,en}.md` with
    `wait()`, `notify()`, `notifyAll()`, deadlock causes, prevention, and
    diagnosis.
  - Acceptance: examples use monitor ownership and condition loops correctly;
    safer high-level alternatives are identified.

- [ ] **JAVA-COVERAGE-11 — Debugging, clean code, and refactoring**
  - Route: delegated; writer trigger (new bilingual lesson pair plus tests).
  - Add `27-depuracion-codigo-limpio-y-refactorizacion.{es,en}.md` covering
    breakpoints, watches, stepping, code smells, and test-supported refactoring.
  - Acceptance: debugging and refactoring are taught as distinct feedback
    loops with a practical before/after example.

- [ ] **JAVA-COVERAGE-12 — Complete Spring CRUD with PUT**
  - Route: delegated; writer trigger (bilingual expansion plus tests).
  - Expand `22-testing-junit-y-spring-boot.{es,en}.md` with `@PutMapping`, the
    service/repository update path, validation, not-found behavior, and tests.
  - Acceptance: CRUD includes CREATE, READ, UPDATE, DELETE with explicit HTTP
    semantics and failure responses.

## Verification

Run after each work unit:

```bash
node --test tests/courses-java-program-coverage.test.mjs
```

Run at feature completion:

```bash
node --test tests/courses-java-program-coverage.test.mjs
node --test tests/courses-filename-normalization.test.mjs tests/courses-schema.test.mjs tests/courses-java-namespaces.test.mjs
npm test
npm run astro -- check
npm run build
```

## Progress evidence

| Task | Commit | Focused check | RDD outcome |
|---|---|---|---|
| JAVA-COVERAGE-01 | `5926e19040d5b3c584fd641644ca583a2f1abd51` | `node --test tests/courses-java-program-coverage.test.mjs` — 3 passed | disabled/unmanaged; assessment medium (`slice_budget_reached`) |
| JAVA-COVERAGE-02 | `36c37c842190599710d344c3134aafbc5c94d64f` | `node --test tests/courses-java-program-coverage.test.mjs` — 5 passed | disabled/unmanaged; assessment medium (`under_budget`) |
| JAVA-COVERAGE-03 | `df76145afbbc852181afa785676257fd0a3a4c07` | `node --test tests/courses-java-program-coverage.test.mjs` — 7 passed | disabled/unmanaged; assessment medium (`under_budget`) |
| JAVA-COVERAGE-04 | `9e58afc698bdba79ac72d9af3ac42472bede0932` | `node --test tests/courses-java-program-coverage.test.mjs` — 9 passed | disabled/unmanaged; assessment medium (`slice_budget_reached`) |
| JAVA-COVERAGE-05 | `40fc8059869ceb7162181a38985a820c957e17cb` | `node --test tests/courses-java-program-coverage.test.mjs` — 11 passed | disabled/unmanaged; assessment medium (`slice_budget_reached`) |
| JAVA-COVERAGE-06 | `019f75859df65b8963b39576a8aadc16f14482a1` | `node --test tests/courses-java-program-coverage.test.mjs` — 12 passed | disabled/unmanaged; assessment medium (`under_budget`) |

## Next step

Implement `JAVA-COVERAGE-07` with a delegated writer using strict RED → GREEN
→ REFACTOR.
