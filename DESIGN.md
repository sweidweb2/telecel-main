# Telecel Global — DESIGN.md

The source of truth for the public site. Where an installed design skill disagrees, this file wins. The full plan is in `docs/plans/public-pages-frontend.md`.

## Direction: "Editorial network"

- **Surfaces:** warm neutral (`--surface #f5f5f3`) and white, separated by hairline rules (`--hairline`). No gradients, glass or mesh backgrounds. One ink band per page is allowed for its signature section.
- **Ink:** `--ink #171717` for type and the outlined CTAs.
- **Red:** Telecel red (`--brand`) appears about once per section: an eyebrow, an index number, the primary CTA, a state dot. Never use it for large fills.
- **Type:**
  - `--font-heading` for display text.
  - Plex Sans for body.
  - Plex Mono only for technical notation: service codes, country codes, SLAs, eyebrows.
- **Layout:** a 12-column grid with generous measure (≤ 68ch for prose). Each section holds one idea.
- **Signature pattern:** the _editorial index_. Content is numbered and coded (`NEC-01`) like a carrier's rate sheet, so it reads as an operator's document, not a template.

## Voice

- Every claim names a place, a number or a named outcome. Until the text pack and evidence are approved, copy describes **what a service is**, never how big, fast or proven it is.
- **Banned words:** seamless, empower, unlock, cutting-edge, world-class, next-gen, journey, synergy, robust, leverage, revolutionise.
- **CTAs depend on context:**
  - Carriers and operators on buyer pages: "Discuss interconnection"; mixed-audience service pages use "Talk to Sales".
  - Enterprises: "Request a quote".
  - Everyone else: "Talk to Sales".
  - CTAs pass `intent` and `area` through to `/contact`.

## Evidence (RFQ §4.3)

Metrics, customers and coverage render only from `constants/evidence.ts` entries marked `approved: true`, with a source. Unapproved claims never render.

## Motion

- Durations: 150–250ms for UI, 600–900ms for one-time diagram draws.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animate only transform, opacity and stroke properties; short (≤200ms) colour/border transitions are allowed for hover and selected states. Nothing autoplays, motion pauses offscreen, and reduced motion gets the static final state.

## Hard no

Glowing-earth or server-aisle stock, carousels, particles, purple gradients, glassmorphism, card tilt, vague copy, unlabelled logo walls, fake POPs or "live" data, political borders on maps.
