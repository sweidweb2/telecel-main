# Public Pages Front-end — Plan v2

Reviewed by Codex (7.5/10) and a Claude design reviewer (7/10) on v1. Their points are folded in below.

Goal: turn the blueprint pages into a finished, credible B2B telecom site that does not read as AI-made. Stack stays the same: Next.js 16, Tailwind v4 tokens in `app/globals.css`, and the existing primitives.

## 1. Direction: "Editorial network"
- **Look:** warm neutral surfaces and ink type, with Telecel red used about once per section. Dark mode gets its own designed palette, not an inverted copy.
- **Type:** Jost-style display headings. Mono only for technical notation (latency, ASN, country codes, SLAs), not for every number.
- **Point of view:** an Africa-centred view is the brand statement. It is told through verified corridor stories, operational diagrams and customer outcomes, never a spinning globe or glowing-earth stock.
- **Photography:** real photographs of people at work (NOC, landing stations, offices), licensed or commissioned, paired with schematics so the site doesn't feel cold and all-SVG.
- **Motion:** used only to explain something. 150–250ms for UI and 600–900ms for one-time diagram draws, with ease-out curves. Only transform, opacity and stroke properties animate. Animations pause offscreen, there is a static fallback for reduced motion, and nothing autoplays (the current `PlatformLayers` autoplay will be removed).
- **Source of truth:** a single `DESIGN.md` written before any build. Where the taste skill and the impeccable skill disagree, `DESIGN.md` wins.

## 2. Voice and copy brief (write before visuals)
- **Rule:** every claim names a place, a number or a named outcome.
- **Banned words:** seamless, empower, unlock, cutting-edge, world-class, next-gen, journey, synergy, robust, leverage.
- **Sample headlines** set the tone; for example "Africa's routes, run by people who live on them." The final set needs client sign-off.
- **CTAs depend on the buyer:**
  - Carriers: "Discuss interconnection".
  - Enterprises: "Request a quote".
  - OTT and platforms: "Get A2P SMS access".
  - All three pass the service and geography through to the contact form.

## 3. Verified evidence (launch dependency)
- Every stat, point of presence (POP) and latency figure lives in `constants/network.ts` as `{ value, source, owner, approved, reviewedAt }`.
- An unapproved value **does not render** in production, and a unit test fails the build if one is referenced.
- Each latency figure states its endpoints, how it was measured and the date. No "live" dots without live data.

## 4. Navigation
- Primary nav keeps direct service links and adds buyer shortcuts (Carriers / Enterprises / OTT & Platforms).
- Each buyer gets a short page path ending in its own CTA.

## 5. Build order: one buyer journey first
1. Write `DESIGN.md`, the voice brief and the shape of the evidence data. Test the palette on one real section in light and dark.
2. **Carrier journey end to end:** Home → Services/[slug] (SpecSheet + schematic) → contact form pre-filled with intent, service and region. Score it and fix it until every gate passes.
3. Shared blocks the journey proves out:
   - `SpecSheet`: semantic table plus "Download as PDF".
   - `CoverageMap`: static dot-matrix SVG centred on Africa. It distinguishes owned, partner and planned coverage, shows POP detail on hover or focus, and has a country/city search. An equivalent HTML list is the default view on mobile.
   - `OutcomeCard`, `SchematicDraw`, and a `StatStrip` that shows approved values only.
4. **Remaining pages:**
   - Platform: the map is its signature moment.
   - Solutions, organised by buyer.
   - Use-cases: outcome-first.
   - Why Telecel + Leadership: the Africa projection, shown as a labelled, deliberate choice.
   - Insights.
   - Footer: offices with local times.
   - The services hero is simplified.
5. **One signature moment per page**, so the site doesn't read as a template.

## 6. Release gates (replace reviewer averages)
A page ships only when it passes all of these:
- **Layout:** renders at 320, 390, 768 and 1440 px in light and dark, reflows at 200% zoom, and the break-ui worst-case data test passes.
- **Accessibility:** keyboard and screen-reader pass, contrast meets WCAG AA, spec tables are semantic, and Lighthouse a11y scores ≥ 95.
- **Performance:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, and the per-page JS and SVG budget holds. Map controls are isolated small client components, and pages stay static and cacheable.
- **Content and SEO:** no unapproved claims in production, canonical tags and indexability are set, and form recovery is tested.
- **Reviewer scores:** Codex and Claude score craft, UX and anti-slop, and the loop continues until both give ≥ 8. A high visual score never offsets a failed gate above.

## 7. Anti-patterns (hard rules)
- Glowing-earth stock or server-aisle photos.
- Carousels.
- Particle or mesh backgrounds, purple gradients, glassmorphism.
- Card tilt.
- Vague copy.
- Unlabelled logo walls.
- Fake POPs or fake "live" data.
- Disputed borders drawn on the map. Use dots only, with no political boundaries.

## 8. Needed from the client
- Real POPs, coverage (owned, partner or planned), country and carrier counts, and traffic figures, each with its source.
- Brand logo / RFQ assets.
- Leadership photos and roles.
- Office addresses.
- Photography.
- Approved headlines.
