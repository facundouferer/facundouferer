# DESIGN.md — Organic Design System

This document is the design contract for this repository. Every component, page,
layout and UI decision must be derived from the **Organic** design system in
`Organic/`. Nothing here is optional styling advice; it is the visual contract.

## 1) Source of truth and where it lives

| Layer | Path | Role |
| --- | --- | --- |
| Machine-readable theme | `Organic/theme.json` | The parameters the system was derived from |
| Canonical stylesheet | `Organic/styles.css` | Token sheet + component layer — reference implementation |
| Written guide | `Organic/readme.md` | Design intent, do's and don'ts |
| Live reference pages | `Organic/foundations/*.html`, `Organic/components/*.html` | Plain-HTML demos of every class and state |
| Starter templates | `Organic/templates/landing/`, `Organic/templates/deck/` | Whole pages consuming the system correctly |
| Lint contract | `Organic/_adherence.oxlintrc.json` | The allowed token list and forbidden literals |
| **Runtime implementation** | `src/styles/global.css` | What the Astro site actually loads |

**Rule of precedence:** `Organic/` defines the system. `src/styles/global.css`
is its implementation for this Astro site and is imported once from
`src/layouts/BaseLayout.astro`. When they disagree, `Organic/` wins unless the
divergence is listed in §8 as an intentional site-layer decision.

Do not duplicate the token block anywhere else. Do not import
`Organic/styles.css` into the Astro build — the tokens already live in
`src/styles/global.css`.

## 2) Design direction

Organic is warm, rounded and slightly playful: a cream-and-sand ground with a
terracotta accent and a sage second accent, a display heading face over a
humanist body face, and 16px radii that grow into pills and soft circles.

- **Left-aligned, asymmetric layouts.** Flush-left headings; content hugs the
  left edge with whitespace on the right.
- **Over-round everything.** `--radius-lg` for containers, `999px` for buttons,
  tags and inputs, `50%` for icon buttons and decorative shapes.
- **Whitespace instead of rules.** This system has no dividers between
  sections. Separate content with spacing from the scale, not with lines or
  boxes. The `.hr` class exists but should be avoided.
- **Washed photography.** Every content photograph goes through `.washed` so it
  sits back into the warm page instead of on top of it.
- **Warmth is the point.** Never desaturate the palette into greys.

## 3) Tokens

Every color, font, spacing, radius and shadow comes from a CSS custom property.
**Never hard-code a hex, a font name, or a px value that a token already
carries.**

### 3.1 Color roles

```
--color-bg        #f5ead8   page ground
--color-surface   #ebddc5   cards, inputs, dialogs
--color-text      #201e1d   body copy
--color-accent    #c67139   terracotta — primary accent
--color-accent-2  #7a8a5e   sage — genuine second voice, not a highlight
--color-divider   color-mix(in srgb, #201e1d 16%, transparent)
```

### 3.2 Tonal ramps

Three ramps — `--color-neutral-*`, `--color-accent-*`, `--color-accent-2-*` —
each with steps `100`…`900`, generated in OKLCH on one shared perceptual
lightness scale. The same step of any ramp carries the same visual weight.

- `100`–`300` → tinted fills, hovers, subtle borders
- `500` → the role's base
- `700`–`900` → text on tinted fills, pressed states, accent-colored body copy

Prefer a ramp step over an ad-hoc `color-mix()`.

### 3.3 Contrast rule (mandatory)

`--color-accent` against `--color-bg` is tuned to ~3:1 — enough for icons,
large display text and interface chrome, **not for body copy**. For
paragraph-size text in the accent, use `--color-accent-700`.

This is why the site layer uses `--color-accent-700` for links, `.btn-ghost`,
`.card-kicker`, `.kicker` and `.accent-word`.

### 3.4 Typography

```
--font-heading         "Caprasimo", system-ui, sans-serif    (display, 400 only)
--font-heading-weight  400
--font-body            "Figtree", system-ui, sans-serif      (400 / 600 / 700)
```

Base body: `15px / 1.6`. Headings: `line-height: 1.12`,
`letter-spacing: -0.015em`. `h6` is an uppercase eyebrow
(`letter-spacing: 0.08em; text-transform: uppercase`).

Caprasimo is the **only** display voice. No condensed or geometric display
faces. No additional font families.

### 3.5 Spacing, radius, elevation

```
--space-1 4.4px   --space-2 8.8px   --space-3 13.2px
--space-4 17.6px  --space-6 26.4px  --space-8 35.2px      (4px base × 1.10 density)

--radius-sm 8px   --radius-md 16px  --radius-lg 28px

--shadow-sm  0 1px 2px   rgba ink 14%
--shadow-md  0 3px 10px  rgba ink 16%
--shadow-lg  0 12px 32px rgba ink 22%
```

Use `--shadow-*` via `.elev-sm` / `.elev-md` / `.elev-lg`. Never write an
ad-hoc `box-shadow`.

### 3.6 Site-layer token

```
--container-max  1180px
```

Owned by `src/styles/global.css`, not by Organic. It backs `.container`.

## 4) Component classes

Build with these classes. Do not invent parallel ones.

| Class | What it is |
| --- | --- |
| `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-icon` | Actions. Primary is a solid accent fill; all are pill-shaped |
| `.tag` + `.tag-accent` / `.tag-accent-2` / `.tag-neutral` / `.tag-outline` | Small labels tinted from the ramps |
| `.input` (incl. `select.input`) | Text fields and selects on native elements |
| `.card` + `.card-kicker` / `.card-title` / `.card-body` / `.card-meta` / `.card-icon` | Surface-filled content cards |
| `.card-hover` | Lift-on-hover interaction for clickable cards |
| `.elev-sm` / `.elev-md` / `.elev-lg` | Elevation utilities |
| `.nav` + `.nav-brand` | The header bar |
| `.washed` | The image wrapper — every content photograph goes through it |
| `.text-muted` | Reduced-emphasis copy |

Site-layer scaffolding (`src/styles/global.css`, not in Organic):

| Class | What it is |
| --- | --- |
| `.container` | Max-width wrapper with fluid inline padding |
| `.section` | Fluid vertical section rhythm |
| `.kicker` | Uppercase eyebrow above a section title |
| `.section-title` / `.section-subtitle` | Fluid section heading pair |
| `.accent-word` | Accent-colored word inside a heading |
| `.badge` + `.badge-dot` | Sage status pill |

Classes documented in Organic but **not yet implemented** in the site layer —
port them from `Organic/styles.css` before use, do not reimplement from scratch:
`.field`, `.radio` + `.dot`, `.seg` + `.seg-opt`, `.table`, `.dialog-backdrop` +
`.dialog`, `.btn-block`, `.hr`.

## 5) Interaction states

States are themed, never browser defaults, and are already built in. Do not
restyle them per component.

- **Hover / pressed** come from the accent ramp: base → `600` on hover → `700`
  on press for solid fills; a `color-mix()` tint for outlined and ghost variants.
- **Keyboard focus** is `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`.
  Never leave the default blue ring, never remove focus without a replacement.
- **Selection** is an accent tint via `::selection`.
- **Disabled** drops to `opacity: 0.45` with `cursor: not-allowed`.

## 6) Icons and graphics

**Every visual artifact on this site comes from Organic — not just components.**
There is one palette, one display face and one icon set. No exceptions.

### 6.1 Icons

Lucide (https://lucide.dev) at `stroke-width: 2.75` for the rounder, heavier
look the system asks for. Do not mix icon sets.

### 6.2 Illustrations, diagrams and inline SVG

- Draw with the Organic palette only: `--color-accent` terracotta,
  `--color-accent-2` sage, the neutral ramp, on the `--color-bg` cream ground.
- Rounded geometry: `rx`/`ry` on rectangles, round line caps and joins, circles
  and blobs. No sharp corners, no hairline-only construction.
- Prefer thick, confident strokes consistent with the `2.75` icon weight.
- Inside a page, use `var(--color-*)` in the SVG. In a standalone `.svg` asset
  under `public/`, custom properties do not resolve — use the literal hex from
  §3.1/§3.2 and keep it in sync with the tokens by hand.

### 6.3 Photographs

Every content photograph is wrapped in `.washed`
(`saturate(0.6) contrast(0.85) brightness(1.1) opacity(0.94)`) with rounded
edges, so it sits back into the warm page instead of on top of it.

### 6.4 Content imagery

Article, project and course images (`public/img/articles/`,
`public/img/projects/`, `public/img/courses/`) follow the same palette and
rounded language, placeholders included.

### 6.5 Open Graph cards and presentation slides

Generated OG images (`src/pages/og/*.svg.ts`) and presentation components
(`src/components/presentaciones/`) use the same palette and the same type
pairing — Caprasimo display over Figtree body. They render outside the CSS
custom-property context, so they carry literal hex values; those literals must
match §3.1/§3.2.

### 6.6 If Organic cannot express it

Extend the system: add the token or class in `Organic/styles.css`, document it in
`Organic/readme.md` and here, then mirror it into `src/styles/global.css`. Never
introduce a second palette, a second display face, or a foreign icon set in a
single file.

## 7) Working rules for agents

When creating or modifying any component, page or layout:

1. **Read before writing.** Check `Organic/readme.md` and the matching
   `Organic/components/*.html` or `Organic/foundations/*.html` page. They are
   plain HTML — view source and copy the markup.
2. **Reuse the class first.** If a class in §4 covers it, use it. Only add a
   component-scoped `<style>` block for genuinely new layout, never to restyle
   an existing class.
3. **Tokens only.** No raw hex, no raw font-family, no raw px where a token
   exists. This is enforced conceptually by
   `Organic/_adherence.oxlintrc.json`; treat it as the rule even though the
   Astro build does not run that lint config.
4. **New shared class → `src/styles/global.css`.** Not a one-off in a component.
   If the class belongs to the system rather than to this site, mirror it into
   `Organic/styles.css` and `Organic/readme.md` so the two do not drift.
5. **New token → `:root` in `src/styles/global.css`.** Never a second `:root`
   block elsewhere.
6. **Accent-colored text at body size uses the `700` step**, per §3.3.
7. **Photographs get `.washed`** and rounded edges.
8. **Respect the repo's formatting.** `src/styles/global.css` and `.astro`
   markup use tabs.

## 8) Intentional site-layer divergences from `Organic/styles.css`

These are deliberate. Do not "fix" them back toward Organic.

| Item | Organic | Site layer | Why |
| --- | --- | --- | --- |
| Link / ghost / kicker color | `--color-accent` | `--color-accent-700` | Body-size contrast, per §3.3 |
| Body line-height | `1.55` | `1.6` | Long-form article readability |
| `.btn-icon` | `34px`, `--radius-md` | `40px`, `50%` | Touch target and rounder shape |
| `.card` padding / title | `--space-3` / `17px` | `--space-4` / `19px` | Content-site density |
| `.tag-outline` | accent border, accent text | divider border, text color, plus `.is-active` state | Used as a filter control |
| Added | — | `.card-icon`, `.card-hover`, `.container`, `.section`, `.kicker`, `.section-title`, `.section-subtitle`, `.accent-word`, `.badge` | Site scaffolding Organic does not cover |

## 9) Verification

There is no automated design lint wired into the build. Before calling UI work
done:

- `npm run astro -- check`
- `npm run build`
- `rg -c "#[0-9a-fA-F]{3,8}\b" src/components src/layouts src/pages -g '!*.svg'`
  — see the known baseline below before treating a hit as new.
- Visually confirm against the matching `Organic/` reference page.

### Known token-adherence baseline (as of this document)

Raw hex values still present in the codebase, measured with the command above:

- `src/components/presentaciones/**` — ~600 hits across 24 slide components.
  This module predates the design system and carries its own self-contained
  palettes. **New presentation components must use tokens**; migrating the
  existing ones is separate, tracked work.
- `src/components/Welcome.astro` (8), `src/components/CourseCard.astro` (1),
  `src/components/LessonsList.astro` (1) — small residual violations, should be
  tokenized when those files are next touched.
- `src/pages/og/site.svg.ts` (7), `src/pages/og/[slug].svg.ts` (6) — generated
  Open Graph SVGs. These render outside the page context where CSS custom
  properties resolve, so literal hex is required. **Keep the literals in sync
  with the tokens by hand.**

Any new hit outside those files is a regression.

## 10) Changing the system

To retune the look: edit the tokens at the top of `Organic/styles.css`, keep
`Organic/theme.json` and `Organic/readme.md` in step, then mirror the token
change into `src/styles/global.css`. Never change the site's tokens alone —
that is how the system drifts from what the CSS actually does.
