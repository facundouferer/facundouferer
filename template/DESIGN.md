# Design System Specification: The Deep Narrative

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Architect"**

This design system is engineered to move beyond the "portfolio template" and into the realm of high-end, editorial SaaS product design. Inspired by the precision of Linear and the fluid aesthetics of Stripe, "The Digital Architect" focuses on **Tonal Depth** and **Asymmetric Balance**. 

Instead of traditional grids that feel boxed in, we utilize expansive whitespace and "breathing layers." The goal is to convey senior-level expertise through restraint. We do not shout with loud colors; we whisper with precise typography and sophisticated light-play.

---

## 2. Colors: Depth & Atmospheric Light
The palette is built on a foundation of `surface` (`#060e20`), a deep midnight that provides more warmth and "inkiness" than pure black.

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** 
To separate the Hero from the Project Grid, or the Project Grid from the Footer, use background shifts. 
- *Example:* Place a `surface_container_low` (`#091328`) section directly against the `surface` (`#060e20`) background. The 1.5% shift in luminance is enough for the human eye to perceive a boundary without the visual "noise" of a line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
- **Base Level:** `surface` (#060e20)
- **Mid-Level (Sections):** `surface_container_low` (#091328)
- **Top-Level (Cards/Modals):** `surface_container_high` (#141f38)
- **Interaction Layer:** Use `surface_bright` (#1f2b49) for hover states to simulate light hitting the surface.

### The "Glass & Gradient" Rule
To achieve the signature "Vercel" look, utilize `surface_variant` at 40% opacity with a `backdrop-blur` of 12px for navigation bars and floating chips. 
- **Signature Texture:** Primary CTAs should not be flat. Use a linear gradient: `primary` (`#9fa7ff`) to `tertiary` (`#c890ff`) at a 135-degree angle. This creates a "glow" that feels engineered, not just colored.

---

## 3. Typography: Editorial Authority
We use a dual-sans pairing to distinguish between "Action" and "Narrative."

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech" feel. Use `display-lg` (3.5rem) for hero statements with a negative letter-spacing of `-0.02em` to create a tight, authoritative "Stripe-like" lockup.
- **Body & Labels (Inter):** The industry standard for readability. Inter's tall x-height ensures that even at `body-sm` (0.75rem), technical documentation or project descriptions remain legible.

**Hierarchy Note:** Always maintain at least a 2x size difference between your `headline-lg` and `body-lg` to ensure a clear visual "entry point" for the user's eye.

---

## 4. Elevation & Depth: Tonal Layering
We abandon the 2010s "Drop Shadow" in favor of **Ambient Occlusion** and **Tonal Lift**.

- **The Layering Principle:** To make a project card pop, place a `surface_container_highest` card on a `surface_container_low` background. The contrast in depth is inherent in the token value.
- **Ambient Shadows:** For floating elements like Modals, use a shadow with a 40px blur, 0px spread, and 8% opacity. The shadow color must be derived from `on_surface` (`#dee5ff`) to ensure the shadow feels like a "reflection" of the dark theme rather than a muddy grey hole.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline_variant` (`#40485d`) at 20% opacity. It should be felt, not seen.

---

## 5. Components: Precision Primitives

### Buttons (The "Engineered" Click)
- **Primary:** Gradient (Primary to Tertiary), `rounded-md` (0.375rem). Text: `label-md` uppercase with 0.05em tracking.
- **Secondary:** `surface_container_highest` background with a "Ghost Border." 
- **Interaction:** On hover, apply a 2px outer glow (box-shadow) using the `primary` color at 30% opacity.

### Project Cards (The "Sleek" Container)
- **Structure:** Forbid divider lines. Separate the "Project Title" from "Tech Stack" using a `2.5` (0.85rem) spacing gap.
- **Background:** `surface_container_low`. On hover, transition to `surface_container_high` and scale the image by 1.02x for a "lifting" effect.

### Chips (Tech Stack Tags)
- **Style:** No background. Use a `1px` Ghost Border (`outline_variant` at 20%) and `label-sm` typography. This keeps the focus on the content, not the container.

### Input Fields
- **Style:** Understated. `surface_container_lowest` background, no visible border until `:focus`. On focus, animate a 1px border using `secondary` (`#2db7f2`).

---

## 6. Do's and Don'ts

### Do
- **Do** use `20` (7rem) or `24` (8.5rem) spacing for vertical section padding. Space is a luxury; use it.
- **Do** use "Intentionally Asymmetric" layouts. For example, a left-aligned headline with a right-aligned descriptive paragraph two steps down the spacing scale.
- **Do** use `primary_dim` for secondary text links to maintain the "purple/blue" brand resonance without the harshness of full white.

### Don't
- **Don't** use `#000000` for backgrounds unless it is for `surface_container_lowest` in a nested state. Pure black kills the "navy/midnight" depth.
- **Don't** use 1px solid lines to separate list items. Use a `1.5` (0.5rem) spacing gap and a subtle background hover state instead.
- **Don't** use standard "Blue" for links. Use `secondary` (`#2db7f2`) to maintain the vibrant, high-end SaaS feel.

---

## 7. Signature Layout Patterns: The "Full-Stack" Reveal
For the portfolio aspect, use **The Masked Reveal**. Project images should be housed in `rounded-xl` containers with a `mask-image` linear gradient that fades the bottom 10% of the image into the `surface_container` color. This creates a seamless integration between imagery and code-driven UI.