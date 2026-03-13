AGENTS.md

Important
- Deben contestar y comentar en espanol en todo momento al informar al programador que estan haciendo, que cambios realizaron y por que.

Purpose
- This file is the operational guide for agentic coding assistants working in this repository.
- It documents build/lint/test commands, coding standards, and repository constraints.

Repository Snapshot
- Framework stack: Next.js App Router + React 19 + TypeScript + Tailwind CSS 4.
- Runtime/API layer: Next route handlers under `src/app/api` with Mongoose models.
- Package manager and scripts: npm (`package.json` contains npm scripts only).
- TypeScript settings: `strict: true`, `noEmit: true`, alias `@/* -> ./src/*`.

Commands
- Install dependencies: `npm install`
- Development server: `npm run dev` (runs `next dev --turbopack`)
- Production build: `npm run build` (runs `next build`)
- Start production server: `npm run start` (runs `next start`)
- Lint: `npm run lint` (runs `next lint` with flat ESLint config)
- Type-check (recommended on every substantial change): `npx tsc --noEmit`

Testing Commands
- Current state: there is no test runner configured and no `test` script in `package.json`.
- If Vitest is added, run full suite: `npx vitest run`
- If Vitest is added, run single file: `npx vitest run path/to/file.test.ts`
- If Vitest is added, run single test by name: `npx vitest run path/to/file.test.ts -t "test name"`
- If Jest is added, run single file: `npx jest path/to/file.test.ts`
- If Jest is added, run single test by name: `npx jest path/to/file.test.ts -t "test name"`
- If Mocha is added, run single file: `npx mocha path/to/file.test.ts`
- If Mocha is added, run single test by name: `npx mocha path/to/file.test.ts --grep "test name"`
- When adding any runner, also add a `test` script in `package.json` and update this document.

Codebase Conventions
- Keep edits minimal and focused; avoid touching unrelated files.
- Prefer fixing root causes over adding patches that hide a deeper problem.
- Preserve existing architecture patterns unless a change request explicitly asks for refactoring.
- Do not introduce new libraries unless there is a clear need and documented tradeoff.

Formatting
- No Prettier config exists in the repository at the moment.
- Match existing style: 2-space indentation and semicolon usage consistent with surrounding code.
- Keep lines around 100 characters when possible for readability.
- Avoid broad style-only rewrites.

Imports
- Prefer absolute alias imports using `@/` for internal modules under `src`.
- Use relative imports only when local proximity makes intent clearer.
- Keep import groups ordered as:
  1) Node/built-in modules,
  2) third-party packages,
  3) internal alias imports (`@/...`),
  4) relative imports (`./`, `../`).
- Keep import ordering consistent within each file (alphabetical inside groups when practical).

TypeScript Guidelines
- Respect strict typing; avoid `any` unless unavoidable and justified.
- Prefer `unknown` in catch blocks and narrow before use.
- Use explicit prop and return types for exported utilities and complex functions.
- Prefer `interface` for externally consumed object contracts.
- Prefer `type` for unions, mapped types, and utility-style aliases.
- Avoid `@ts-ignore`; if used, explain why with a short comment and a follow-up plan.

Naming Conventions
- Components: `PascalCase` (`Navbar.tsx`, `PortfolioItem.tsx`).
- Variables/functions: `camelCase`.
- Constants and env vars: `UPPER_SNAKE_CASE`.
- Types/interfaces: `PascalCase` without `I` prefix.
- Route segment files must follow Next conventions (`page.tsx`, `layout.tsx`, `route.ts`).

React and Next.js
- Assume Server Components by default in App Router.
- Add `'use client'` only when client hooks/events/browser APIs are needed.
- Keep components small and composable.
- Use `next/image` for images that benefit from optimization.
- Prefer server-side data fetching for SEO-critical content when practical.
- Do not use client hooks in server components.

API Route Guidelines
- Place handlers in `src/app/api/**/route.ts`.
- Use `NextRequest`/`NextResponse` and proper HTTP status codes.
- Validate input early and return clear 4xx responses for client errors.
- Log server-side failures with `console.error` and avoid leaking sensitive details.
- Existing routes often use `{ message: string }` on errors; keep response shapes consistent per endpoint.

Error Handling and Logging
- Never silently swallow errors.
- Use explicit checks for expected failure modes (validation, auth, missing data).
- Return user-friendly messages from APIs and UI.
- Include enough diagnostic context in server logs (route and operation) without secrets.

Security and Secrets
- Never commit credentials, tokens, or private keys.
- Keep secrets in environment variables (`process.env.*`).
- If a secret is found in source, remove it and notify maintainers immediately.
- Be careful with auth cookies: set secure flags appropriately in production.

Performance Guidance
- Reuse assets from `/public` where possible.
- Avoid unnecessary client-side work in large pages.
- Prefer code-splitting/dynamic imports for heavy, infrequently used UI.
- Keep bundle growth in mind when adding dependencies.

Suggested Project Structure Practices
- Route handlers: keep endpoint logic in `src/app/api/**/route.ts` and shared helpers in `src/libs`.
- Data layer: keep Mongoose schema/model definitions under `src/models`.
- Components: prefer reusable UI under `src/components` and keep route-specific UI close to route files.
- Static data/config used by UI should remain in `src/data` when applicable.

Environment and Configuration
- Keep runtime secrets in `.env.local` and never commit that file.
- Document every newly required environment variable in the README or PR description.
- Use explicit fallback handling when environment variables are optional.
- Fail fast with clear errors when required env vars are missing in server code.

Validation Checklist for Agents
- Confirm requested behavior change is covered (UI flow or API contract).
- Run `npm run lint` for non-trivial changes.
- Run `npx tsc --noEmit` when touching TypeScript logic or public interfaces.
- If tests exist in the future, run impacted tests first, then full suite when practical.
- Re-open changed files and verify no accidental unrelated edits were introduced.

Agent Working Style
- Prefer reading existing patterns in nearby files before introducing new abstractions.
- Keep naming and response conventions consistent within each feature area.
- If you must deviate from conventions, explain the tradeoff in your final notes.
- Avoid speculative refactors unless directly required for correctness or maintainability.

Linting and Quality Checks
- Minimum recommended checks before finishing a non-trivial change:
  - `npm run lint`
  - `npx tsc --noEmit`
- If lint fails, fix root causes rather than disabling rules.

Git and PR Behavior for Agents
- Do not commit or push unless explicitly asked by the user.
- If asked to commit, keep commits focused and use clear messages.
- Never rewrite history (rebase/amend/force push) unless explicitly requested.

Cursor and Copilot Rules
- Checked for Cursor rules in `.cursor/rules/` and `.cursorrules`: none found.
- Checked for GitHub Copilot instructions in `.github/copilot-instructions.md`: file not found.
- Conclusion: no additional repository-level AI rules were discovered in those locations.

When Updating This File
- Update commands when scripts or tooling change.
- Update style rules when team conventions evolve.
- Keep this file concise, practical, and aligned with the real codebase state.

Contact / Escalation
- For uncertain architectural changes, open an issue or ask the repository owner before large edits.
