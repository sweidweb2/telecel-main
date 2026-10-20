# Design system: "Connected Energies"

Art direction by Codex (gpt-6-astra) on 2026-10-20, then implemented and QA-reviewed by Codex. It refines, but doesn't replace, Telecel's approved V11/V11.1 direction once the team receives it. Binding rules come from RFQ §4.1 and §6.

## Principles

- **The real Telecel identity** is the anchor: the official wordmark and the "Connecting Energies" tagline. Never retype the wordmark in a web font.
- **Red is a signal, not a fill.** About 3–5% of a viewport: identity, primary action, selected stage, one motif route. About 85% white or light surfaces. Large dark areas only in the footer, login aside and CMS sidebar.
- **Diagrams that explain.** The hero shows the five service pillars joining "One Global B2B Platform". The Platform rail shows the Connect → Optimize sequence. No telemetry, geography, fake dashboards or invented proof.

## Tokens (`app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--brand` | `#E51B23` (hover `#C91720`) | Provisional Telecel red. Confirm against the brand guide. |
| `--ink` | `#171717` | Text, outline buttons |
| `--muted-foreground` | `#626262` | Secondary text |
| `--surface` | `#F5F5F3` | Alternating sections, login aside |
| `--hairline` | `#DEDEDA` | Decorative dividers |
| `--input` | `#767676` | Control boundaries (3:1 contrast) |
| `--charcoal` | `#1B1B1B` | Footer, CMS sidebar |
| `--radius` | 4px controls; panels ≤ 8px | Circles only for the emblem and network nodes |

## Type (`lib/fonts.ts`, all OFL)

- **Jost** 500/600: headings. Utilities: `type-display` (64/68 → 40/44), `type-section` (44/48 → 32/36).
- **IBM Plex Sans** 400/500/600: body 18/28 on the site, 16/24 in the CMS.
- **IBM Plex Mono**: `type-notation` (12/18, +0.04em, uppercase), for stage indices and reference labels only.
- Custom utilities use the `type-*` prefix so `cn()`/tailwind-merge never mistakes them for text colors.

## Components

- `components/brand/logo.tsx`: official wordmark (`color` / `reversed`). Falls back to a neutral text label when the confidential artwork is missing locally (`npm run brand:extract`).
- `components/brand/signal-motif.tsx`: original modular strip on a 32×32 grid (arcs, routes, dots, terminals, waves). 1.5 strokes, 90° rotations, one red route. Always `aria-hidden`.
- `components/marketing/service-portfolio-diagram.tsx`: hero diagram (real text, links to pillars).
- `components/marketing/platform-rail.tsx`: five-stage tabs (keyboard via Base UI). Scrolls sideways on mobile.
- Buttons: `size="cta"` (44px) for marketing. `variant="ink-outline"` for secondary actions.

## Layout

- `container-site`: 1280px max width; 20/24/48px side padding. 12-column grids, 24px gutters.
- Header: 88px, opaque. Menu below 1200px.
- Sections: 96px vertical padding on desktop, 56px on mobile.
- Login: 40/60 split.
- CMS: 248px charcoal sidebar with a 3px red active rule, 64px toolbar, 32px workspace padding.

## Motion and accessibility

- 150ms color changes, 240ms panels. No perpetual or ambient animation. `prefers-reduced-motion` removes motion.
- 4.5:1 text contrast, 3:1 for essential graphics, visible focus (2px ink outline), 44px targets. Status is never shown by color alone.

## Pending from Telecel

Official logo SVGs (color, reversed, emblem), the confirmed brand red, the brand font decision, V11/V11.1 designs, the hero film, and the approved text pack (all home copy in `constants/home-content.ts` is provisional).
