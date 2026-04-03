# AGENTS Guide for `facundouferer`

This file is the operating guide for coding agents working in this repository.
Follow it as the default unless a user request explicitly overrides it.

## 1) Project Snapshot

- Stack: Astro 6 + TypeScript (`"type": "module"`, strict TS config).
- Package manager: npm (`package-lock.json` is present).
- Node requirement: `>=22.12.0`.
- Source root: `src/`.
- Primary file types: `.astro`, `.ts` (if added), static assets.

## 2) Repository Rules Discovery

- Checked for Cursor rules in `.cursor/rules/`: not found.
- Checked for `.cursorrules`: not found.
- Checked for Copilot rules in `.github/copilot-instructions.md`: not found.
- Conclusion: this file is the current canonical agent guidance in-repo.

## 3) Install & Run Commands

Run all commands from repository root.

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Astro CLI help: `npm run astro -- --help`

## 4) Build / Lint / Test Command Matrix

### Build

- Full production build: `npm run build`

### Lint / Static checks

- No dedicated lint script exists in `package.json`.
- No ESLint/Prettier/Biome configuration was found.
- Use Astro checks directly when validating code quality:
  - `npm run astro -- check`
- If a lint tool is introduced later, add scripts in `package.json` and update this file.

### Tests

- Test runner: Node built-in test runner (`node --test`).
- Run all tests: `npm test`
- Validation baseline for every change: `npm test` + `npm run astro -- check`.

### Running a single test (important)

- File-level test execution: `node --test tests/path/to/file.test.mjs`
- Name-filtered execution: `node --test --test-name-pattern "name" tests/path/to/file.test.mjs`

## 5) Mandatory Agent Workflow

1. Read `package.json` scripts before running commands.
2. Prefer the smallest validating command first (`astro check`, targeted tests when available).
3. Do not invent scripts in instructions; either use existing commands or add scripts explicitly.
4. After changing behavior/UI, run at least one verification command.
5. When adding a new tool (lint/test), update this AGENTS.md immediately.
6. Enforce TDD for all agent work: write/update failing tests first, implement, then make tests pass.
7. Add error-reduction mechanisms in each task: input validation, safe defaults, and explicit failure handling where relevant.

## 6) Code Style Guidelines

### 6.1 Imports and modules

- Use ESM import/export style only.
- Keep imports at the top of frontmatter (`---`) in `.astro` files.
- Order imports by locality:
  1) framework/library imports,
  2) internal modules/components,
  3) static assets.
- Prefer explicit relative paths (current project uses relative imports).
- Do not leave unused imports.

### 6.2 Formatting

- Follow existing formatting in repository files:
  - semicolons in JS/TS statements,
  - single quotes for strings in script sections,
  - tabs used in `.astro` markup/style indentation.
- Preserve line-wrapping conventions already present in touched files.
- Keep files clean and minimal; avoid style-only churn.

### 6.3 TypeScript and types

- TS config extends `astro/tsconfigs/strict`; treat strictness as required.
- Prefer explicit types at module boundaries (function params/returns, public objects).
- Avoid `any`; use unions, generics, `unknown`, or narrowed custom types.
- Narrow nullable/unknown values before use.
- Model props data structures with `type`/`interface` when non-trivial.

### 6.4 Naming conventions

- Astro components/layouts: `PascalCase.astro` (e.g., `Welcome.astro`, `Layout.astro`).
- Route files in `src/pages`: file-system routing names; keep route intent clear.
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- CSS ids/classes: descriptive, stable names; avoid meaningless abbreviations.

### 6.5 Astro component conventions

- Put JS/TS logic inside frontmatter block at top.
- Keep markup declarative; avoid excessive inline logic in templates.
- Prefer component composition over duplicated markup.
- Keep `<style>` blocks scoped and close to component usage unless global is required.
- For assets, import and reference via `asset.src` pattern as used in existing code.

### 6.6 CSS and UI rules

- Prefer component-local styles.
- Reuse tokens/patterns when introduced (colors, spacing, typography variables).
- Keep responsive behavior intentional; include mobile breakpoints where needed.
- Avoid introducing one-off values repeatedly; refactor into custom properties.

### 6.7 Error handling and resilience

- Do not swallow errors silently.
- For server-side logic/endpoints (if added), return meaningful HTTP status codes.
- Include actionable context in thrown errors/logs.
- Fail fast on invalid inputs; validate before processing.
- Handle absent/nullable data explicitly.

### 6.8 Accessibility and semantics

- Use semantic HTML elements first.
- Ensure images have appropriate `alt` text (empty `alt` only for decorative images).
- Keep heading hierarchy meaningful.
- Ensure interactive elements are keyboard accessible.

## 7) Editing Guardrails for Agents

- Make focused changes; avoid unrelated refactors.
- Respect existing project structure unless task requires change.
- Do not add new dependencies without clear justification.
- If adding dependencies, document why and how to verify.
- Prefer incremental commits with clear intent (when user asks for commits).

## 8) Definition of Done (for agent tasks)

- Requested behavior/content is implemented.
- A relevant verification command has been run (or limitation explicitly stated).
- No obvious type/import/runtime issues remain in touched files.
- AGENTS.md is updated if tooling/conventions changed.

## 9) Quick Reference

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Astro CLI: `npm run astro -- <command>`
- Static/type checks: `npm run astro -- check`
- Single test: not available until a test runner is introduced
