# Closed Spec: Multi-Language Variables, Constants & Mutability Presentation

## Status: COMPLETED
Implementation fulfilled in `src/components/presentaciones/variables_y_constantes.astro`.

## Overview
Redesign and enhance the interactive presentation component `src/components/presentaciones/variables_y_constantes.astro` to strictly adhere to the design contract in [DESIGN.md](file:///Users/facundouferer/Devs/facundouferer/DESIGN.md) and the **Organic Design System** ([Organic/readme.md](file:///Users/facundouferer/Devs/facundouferer/Organic/readme.md)).

This presentation expands from a basic 4-slide single-topic visualizer to a comprehensive 6-slide interactive multi-language comparison of **variables, constants, data types, and mutability** across **C, JavaScript, Python, and Java**.

---

## Design System Contract & Adherence (DESIGN.md & Organic DS)
- Ground: `var(--color-bg)` (`#f5ead8`)
- Surface: `var(--color-surface)` (`#ebddc5`)
- Text: `var(--color-text)` (`#201e1d`)
- Primary Accent: Terracotta `var(--color-accent)` (`#c67139`) and `var(--color-accent-700)` (`#8c491a`)
- Secondary Accent: Sage `var(--color-accent-2)` (`#7a8a5e`) and `var(--color-accent-2-700)` (`#56633f`)
- Headings: `var(--font-heading)` (`Caprasimo`).
- Body: `var(--font-body)` (`Figtree`).
- Code: `'Fira Code'`, monospace.
- Max `z-index: 90`.

---

## Verification & Acceptance Criteria
- [x] Spec file moved to `specs/closed/variables-y-constantes-multilenguaje.md`.
- [x] Component compiles cleanly without Astro type errors (`npm run astro -- check`).
- [x] Interactive controls operate smoothly with keyboard shortcuts (`Left`/`Right` arrow keys).
- [x] Scoped CSS (no `is:global` or `:root` leakage).
- [x] Zero raw hex colors or hardcoded font families outside tokens.
- [x] Fully localized string support for Spanish (`es`) and English (`en`).
