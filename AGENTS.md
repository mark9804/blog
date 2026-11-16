# Design System & Engineering Guidelines

This repository powers a personal website and blog built on VitePress 2 and Vue 3 (Composition API) with the custom `ElysiumUI` component layer. All visual and code changes must strictly adhere to the principles and invariants below.

---

## 1. Visual Aesthetic & Design Trade-offs

The site's visual language draws from editorial frontispiece typography, matte gouache color blocking, and positive-negative space (figure-ground) composition:

- **Figure-Ground Interplay over Closed Boxes**: Avoid wrapping every UI element in four-sided closed borders with drop shadows. Use open or overhanging `1px` drafting hairlines, intentional negative-space cutouts, and flat color planes so foreground elements and the paper background interlock.
- **Matte Gouache Flatness**: Reject blurry `drop-shadow` / `box-shadow` glows, neon gradients, glassmorphism on content cards, and `scale()` hover magnification. Spatial hierarchy and interactive states are expressed through flat opaque color planes, crisp `1px` border shifts, and offset backing blocks (`3px-4px` solid plane displacement) or positive-negative ink inversion.
- **Minimalist Restraint**: Do not introduce literal illustrations, decorative star ornaments, or skeuomorphic clutter. Every line or plane must serve composition, alignment, or visual hierarchy.
- **Tactile Paper Ground**: A static, ultra-low-opacity (`~0.02-0.025`) inline SVG fractal-noise grain overlays the viewport to give flat digital colors a matte cotton-paper texture with zero network requests and zero per-frame GPU cost.

---

## 2. Color Architecture & Single-Seed OKLCH Invariants

All theme colors derive automatically at build time from a **single light-mode seed variable** (`$accent` in `docs/.vitepress/configs/theme.scss`) inside `docs/.vitepress/theme/styles/colors.scss`.

- **Why OKLCH instead of HSL**: HSL lightness is perceptually non-uniform across hues, causing unpredictable contrast drops when `$accent` changes. All derivations convert `$accent` to `oklch(L C H)`, extract its hue `H`, clamp chroma `C` into the matte gouache pigment range (`0.024 .. 0.072`), and lock perceptual lightness `L` to fixed contrast invariants.
- **Strict 4-Tier Palette Budget**: Each mode (Light and Dark) restricts visible surfaces and accents to four core perceptual tiers along a unified Warm Paper <-> Pigment Ink axis:
  1. **Paper Ground (`--gouache-paper` / `--vp-c-bg`)**: Warm ivory paper in light mode (`L ~ 96.4%`); deep matte slate in dark mode (`L ~ 20.5%`). Serves as both page background and negative-space highlight.
  2. **Chalk / Gouache Wash (`--gouache-chalk`, `--gouache-wash`)**: Lifted porcelain card planes and pale gouache washes (`L ~ 91.8%-98.5%` light; `L ~ 24.5%-29.5%` dark) for shadowless flat layering.
  3. **Pigment Mid-tone (`--gouache-pigment` / `--color-accent-secondary`)**: Desaturated gouache mid-tone (`L ~ 66%` light; `L ~ 56%` dark) for structural figure-ground blocks, active hairlines, and dividers.
  4. **Deep Ink (`--gouache-ink` / `--color-accent-text-primary`)**: Primary reading ink and inverted action blocks (`L ~ 33%` light; `L ~ 91.5%` warm chalk in dark mode).
- **Readability Guarantee**: Primary text maintains `>= 12:1` WCAG AAA contrast against paper, secondary text `>= 6.5:1` AA+, and tertiary metadata `>= 4.5:1` AA across any seed hue. Never hardcode Tailwind `gray-*` or raw `#fff` / `#000` colors in components; always consume semantic CSS custom properties.
- **Appearance Switching**: Preserve the View Transition API light/dark toggle in `docs/.vitepress/theme/layouts/MainLayout.vue` (`html.dark` and `.vt-transitioning`).

---

## 3. Typography Discipline (Two-Font Rule)

A single page must never mix more than two font families for prose and UI (a third monospace family is permitted strictly inside code/math blocks):

1. **Editorial Display Serif (`--font-family-serif`: `Newsreader` + `Noto Serif SC`)**:
   - Reserved exclusively for structural and literary hierarchy: frontispiece name and epigraph, section index titles (`Breves` / `Quavers`), article `h1`/`h2` headings, and article card titles.
   - Prefer medium/semi-bold weights (`500-600`) over heavy `700-800` weights so serif strokes stay crisp.
2. **Functional UI & Body Sans (`--font-family-base`: `Wix Madefor` + `HarmonyOS Sans SC`)**:
   - Used for all body paragraphs, card excerpts, timestamps, word counts, tags, buttons, navigation items, and search UI.
3. **Code Monospace (`--font-family-mono`)**:
   - Restricted strictly to `<code>`, `<pre>`, and technical notation.

---

## 4. Motion & Engineering Standards

- **GPU-Composited Micro-animations**: Prefer SVG and CSS `transform` / `opacity` animations over continuous full-viewport `<canvas>` redraw loops. Ambient motion on the `100dvh` frontispiece should operate on long, asynchronous periods (`14s-20s`) with small displacements (`4px-8px`) to evoke quiet breathing of figure-ground planes.
- **Accessibility & Reduced Motion**: Every continuous or parallax animation must disable or settle into a static state under `@media (prefers-reduced-motion: reduce)`.
- **Code Simplicity**: Use Vue 3 `<script setup lang="ts">` Composition API. Design data structures and CSS token mappings cleanly so components require minimal conditional branching. Write all code comments in English.
