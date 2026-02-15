AGENTS.md

Important
- Deben contestar y comentar en español en todo momento al informar al programador sobre qué están haciendo, los cambios realizados y el razonamiento detrás de sus acciones.

Purpose
- This file guides agentic coding agents (and humans) working on this repository.
- It lists build/lint/test commands, conventions, and rules to follow when editing code.

Commands
- Development server: `npm run dev`
  - Runs: `next dev --turbopack`
- Build production: `npm run build`
  - Runs: `next build`
- Start production server: `npm run start`
  - Runs: `next start`
- Lint: `npm run lint`
  - Runs: `next lint` using the project's ESLint Flat config (`eslint.config.mjs`) that extends `next/core-web-vitals` and `next/typescript`.
- Type-check (recommended before PRs): `npx tsc --noEmit`
- Run a single test (this repo has no test runner configured):
  - If you add Jest: `npx jest path/to/file.test.ts -t "test name"` or `npx jest path/to/file.test.ts --testNamePattern="test name"`
  - If you add Vitest: `npx vitest run path/to/file.test.ts -t "test name"`
  - If you add Mocha: `npx mocha path/to/file.test.ts --grep "test name"`
  - Note: Add a `test` script in `package.json` when a test framework is installed. Example: `"test": "vitest"`.
- Fix lint issues: `npx eslint "src/**/*.{js,ts,tsx}" --fix` (prefer to run the project's `npm run lint` first)
- Clean build caches (Next): remove `.next` and run `npm run build` again.

Repository-specific notes
- This is a Next.js project (App Router) with TypeScript. `tsconfig.json` enables `strict: true` and `paths` alias `@/* -> ./src/*`.
- ESLint config is in `eslint.config.mjs` and uses Next.js recommended rules. Respect those rules when editing.

Cursor / Copilot rules
- I checked the repository for Cursor rules (`.cursor/` or `.cursorrules`) and Copilot instructions (`.github/copilot-instructions.md`) and none were found. There are no additional repo-level AI assistant constraints present in files.

Style Guidelines (for agents)
General principles
- Prefer minimal, focused changes. Do not modify unrelated files.
- Fix root cause, not symptoms. If a bug fix requires a small refactor, prefer the smallest safe refactor.
- Do not add or commit secrets. If a secret is found in source, raise an issue and move it to env vars.

Formatting
- This project does not include a Prettier config. If you add formatting tools, document them in this file and in a PR.
- Use 2-space indentation consistent with existing files.
- Keep lines reasonably short (wrap at ~100 characters) for readability.

Imports
- Use the `@/` path alias for internal imports (configured in `tsconfig.json`). Example: `import Foo from '@/components/Foo'`.
- Order imports by category: 1) Node / built-ins, 2) external packages, 3) absolute alias `@/...`, 4) relative (`./`, `../`).
- Prefer named imports where appropriate, but default exports are allowed when the module is clearly a single default export (React components commonly use default exports in this repo).

TypeScript
- `tsconfig.json` has `strict: true`: favor strict types and avoid `any` unless necessary with a clear justification in a comment.
- Use interfaces for public object shapes, prefer `type` for unions and lightweight aliases.
- Keep component prop types explicit. Use `React.FC<Props>` only if helpful; otherwise prefer plain functions with typed props.
- Avoid `// @ts-ignore`. If a type must be overridden, add a comment explaining why and consider opening a follow-up task to improve types.

Naming conventions
- Components: `PascalCase` (e.g., `Navbar.tsx`, `PortfolioItem.tsx`).
- Files: `kebab-case` for assets, `PascalCase` or `camelCase` for React components and utilities consistent with existing code.
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants and environment variable names.
- Types/Interfaces: `PascalCase` with `I` prefix avoided (prefer `User`, `Post` not `IUser`).

React / Next.js rules
- Respect the App Router conventions. Server components (default) must not use client-only hooks. Use `'use client'` at the top of client components.
- Keep components small and focused. Prefer composition over large monolithic components.
- For data fetching in server components use async functions and stream data as allowed by App Router. For client-side fetching use fetch in effects or SWR/React-Query if added.
- Use Next/image (or `next/image`) when appropriate for images that benefit from optimization, but note public/static images in `/public/img` are referenced directly in code.

API routes and Responses
- API routes under `src/app/api` use the App Router `route.ts` / `route.js` handler pattern.
- Response shape convention in existing code: `{ success: boolean, data?: any, error?: string }`. Follow the same shape for new routes unless there is a strong reason to deviate.
- Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500). For errors include a descriptive `error` message and log server-side (but don't leak sensitive details to clients).

Error handling & logging
- Do not swallow exceptions. Catch expected errors and return a coherent API response.
- Log server-side errors with `console.error()` or an injected logger. Include enough context for debugging (request id, route, input) but avoid logging secrets.
- On the client, show user-friendly messages. Keep technical errors for logs only.

Security and secrets
- Never commit credentials or API keys. Use environment variables and reference them via `process.env.MY_VAR`.
- If you find an API key or secret in the source, create an issue and remove it. Treat historical commits that contain secrets as sensitive.
- For authentication and session handling prefer secure cookies, NextAuth (already in `package.json`), or server-side session stores as required.

Performance
- Reuse static assets from `/public` when possible.
- Keep bundle sizes minimal: prefer dynamic imports for rarely-used components.
- Use server-side rendering for SEO-critical pages and static generation/ISR where appropriate.

Testing (guidance)
- There are no tests configured. If you add tests, prefer Vitest or Jest. Place tests next to the file (`Foo.test.tsx`) or under a `tests/` folder.
- Run a single test with the test runner's `-t` or `--grep` flag to run a test by name. Example: `npx vitest run src/components/Navbar.test.tsx -t "renders"`.
- Add test scripts to `package.json` if you install a runner, and document them here.

Commit & PR guidance (for agents)
- Make focused commits with clear messages: short summary line and optional explanatory body.
- Do NOT create or push git commits automatically unless the user asked you to. If asked, create a single commit per logical change.
- When opening a PR (if asked), include a summary, list of files changed, and testing instructions.

Local developer experience notes
- To quickly validate type-safety: `npx tsc --noEmit`.
- To reproduce runtime issues run the dev server and check logs in terminal and browser overlay.

Adding new dependencies
- Keep the dependency surface minimal. Prefer lightweight packages.
- When adding a package, update `package.json` and run the preferred package manager locally. Document the change in the PR.

If you change project rules
- Update this `AGENTS.md` to reflect new commands, linters, formatters, or AI rules.

Questions you should ask before making changes
- Does this change affect production behavior or only dev UX?
- Does this require environment variables or external services?
- Will this change increase bundle size or add runtime cost?

If something is missing
- This project currently has no test runner and no Prettier config. If you're asked to add one, document choices and add scripts and configs in a dedicated commit.

Contact
- If uncertain about conventions, open an issue or ask the repository owner before large changes.

END
