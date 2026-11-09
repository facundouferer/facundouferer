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

## Lesson films — the default for "make the animation for this lesson"

When the user passes a lesson URL (`/cursos/<course>/<slug>`) and asks for its
animation, build a **film** in the style of `viaje-excepcion-java`, without asking
for a brief. Reference implementation, to copy and adapt:

- `src/data/animations/viaje-excepcion-java.ts` (captions and cues)
- `src/components/animaciones/viaje-excepcion-java.astro` (canvas and palette)
- `tests/animation-viaje-excepcion-java.test.mjs`

Steps:

1. **Study the lesson first.** The URL slug is the frontmatter `slug`, not the file
   name: find the file with `rg "slug: '<slug>'" src/content/courses`. Read it whole
   (explanations, code, diagrams, exercises). The film must not contradict it nor
   add concepts it does not teach.
2. **Pick one story.** A film explains the central mechanism of the lesson as a
   single continuous journey, not a tour of every section. Write down the five or
   six questions a student must be able to answer after watching; each scene
   answers one, and the test asserts the narration covers them.
3. **Build it as one persistent motion canvas** (`data-scene` + `data-motion`,
   `viewBox="0 0 1280 720"`), six scenes, about eight motion steps, 90 to 120
   seconds in both languages (the test checks the total).
4. **Register it** as an extra animation of the lesson (catalog entry in
   `src/data/animations.ts` after the lesson's existing one, both `[slug].astro`
   component maps, thumbnail, test). Never replace the step-by-step animation.

Style and treatment (this is the approved exception to the Organic palette, see
`DESIGN.md` §8; it applies to films only):

- **Palette:** copy the `--xj-*` token block as is: near-black blue ground, deep
  blue `#00203a`, light blue for the normal flow, magenta `#f7038a` for the
  problem or exceptional element, violet for what handles or resolves it, white
  text. Raw colors appear only in that block; add the new file to
  `paletteExceptions` in `tests/animations-lessons.test.mjs`. Fonts stay Organic
  (`--font-body`, generic `monospace` for code); icons stay Lucide at `2.75`. The
  card thumbnail stays in the Organic palette, since it lives on the lesson page.
- **Layout:** a fixed code editor on the left (outside the camera) and an
  isometric 2.5D system on the right (inside it). The code is part of the scene:
  syntax colors, a bar that slides to the line being executed, the failing line
  marked, the program output typed below. Every instruction has a module, and the
  module shows its editor line number.
- **Metaphor:** one consistent visual identity per concept for the whole film (a
  particle for the flow, an object for the thing that travels, a level per
  method). State changes are shown on the same object, never as explosions or
  cartoon characters. No decoration that does not explain something.
- **Camera:** slow, deliberate moves between named `shot-*` anchors; it follows
  the subject and pulls back at the end to reveal the whole system.
- **Narration:** two or three short captions per step, in neutral Latin American
  Spanish (no voseo) with precise vocabulary, plus English. Identifiers and string
  literals are localized like the lesson does. Clarity beats spectacle.

Engine gotchas already paid for: the player resets `transform` on `data-el`
elements, so place them with an inner group; camera and `move` targets must be
anchors, not elements that travel; after an `exit`, show an element again only
with `enter`; keep cues in chronological order; no SVG filters (fake the glow with
a wide translucent stroke or a radial gradient).

Verify in the browser at every scene (desktop, mobile, English) before reporting,
then run the tests listed in `AGENTS.md` §Animations plus `npx astro check`.

## Everything else

Commands, TDD workflow, TypeScript rules, content collections (articles,
projects, courses), i18n conventions and the spec lifecycle are all in
`AGENTS.md`. Follow it.
