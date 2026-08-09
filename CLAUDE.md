# CLAUDE.md — `facundouferer`

Project-scoped instructions for Claude Code in this repository. These complement
the global `~/.claude/CLAUDE.md` and are authoritative for this project.

## Canonical documents

Read these before working. They override any default assumption.

| Document | Scope |
| --- | --- |
| `AGENTS.md` | Full operating guide: commands, code style, content model, i18n |
| `DESIGN.md` | **The design contract** — Organic design system |

## Design System — MANDATORY

**This project has a design system: Organic, in `Organic/`.**
All design must be taken from it. Do not invent visual design.

Before writing or modifying any component, page, layout, or style:

1. Read `DESIGN.md`.
2. Open the matching reference in `Organic/readme.md`,
   `Organic/components/*.html`, or `Organic/foundations/*.html`. They are plain
   HTML — view source and copy the markup.
3. Only then write code.

Hard rules:

- **Tokens only.** Every color, font, spacing, radius and shadow comes from
  `var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`,
  `var(--shadow-*)`. No raw hex, no raw font family, no hard-coded px where a
  token exists.
- **Reuse system classes** (`.btn*`, `.tag*`, `.card*`, `.input`, `.nav*`,
  `.elev-*`, `.washed`, `.container`, `.section`, `.kicker`, `.section-title`,
  `.badge`) instead of inventing parallel ones.
- **Single source of tokens:** the `:root` block in `src/styles/global.css`.
  New shared classes go there too, never as one-off component styles.
- **Component `<style>` blocks are for layout unique to that component only** —
  never to restyle a system class.
- Accent text at body size uses `--color-accent-700`, not `--color-accent`.
- Keep the themed interaction states: accent-ramp hover/pressed, 2px
  `:focus-visible` accent ring, accent `::selection`, `0.45` disabled opacity.
- Content photographs are wrapped in `.washed`.
- **All graphics come from Organic, not just components.** Icons are Lucide at
  `stroke-width: 2.75`; illustrations, diagrams, inline SVG, Open Graph cards and
  presentation visuals use the Organic palette (terracotta `--color-accent`,
  sage `--color-accent-2`, neutral ramp on the cream ground), rounded geometry
  and the Caprasimo/Figtree pairing. Never introduce a second palette, a second
  display face, or a foreign icon set. See `DESIGN.md` §6.
- Layouts are left-aligned and asymmetric; over-round containers; separate
  sections with whitespace, not with rules or dividers.

If a component exists in `Organic/` but not yet in `src/styles/global.css`
(`.field`, `.radio`, `.seg`, `.table`, `.dialog`, `.btn-block`), port it from
`Organic/styles.css` — do not reimplement it.

If the design system genuinely cannot express what a task needs, say so and
propose a token or class addition. Do not silently diverge.

## Everything else

Commands, TDD workflow, TypeScript rules, content collections (articles,
projects, courses), i18n conventions and the spec lifecycle are all in
`AGENTS.md`. Follow it.
