# Design system: "Connected Energies"

Art direction by Codex (gpt-6-astra) on 2026-10-20, then implemented and QA-reviewed by Codex. It refines, but doesn't replace, Telecel's approved V11/V11.1 direction once the team receives it. Binding rules come from RFQ §4.1 and §6.

**Agent rule:** `.cursor/rules/design-system.mdc` — use only the tokens and shared components below.

## Principles

- **The real Telecel identity** is the anchor: the official wordmark and the "Connecting Energies" tagline. Never retype the wordmark in a web font.
- **Red is a signal, not a fill.** About 3–5% of a viewport: identity, primary action, selected stage, one motif route. About 85% white or light surfaces. Large dark areas only in the footer, login aside and CMS sidebar.
- **Diagrams that explain.** The hero shows the five service pillars joining "One Global B2B Platform". The Platform rail shows the Connect → Optimize sequence. No telemetry, geography, fake dashboards or invented proof.

## Theme engine

All style tokens live in **`app/globals.css`** (`:root` / `.dark` + `@theme inline`). Light mode is default; dark is class-based via `next-themes` (`ThemeProvider` in `app/layout.tsx`).

### Brand (60–30–10)

| Token | Value | Use |
| --- | --- | --- |
| `--brand` | `#E51B23` (hover `#C91720`) | Provisional Telecel red. Confirm against the brand guide. |
| `--ink` | `#171717` | Text, outline buttons |
| `--muted-foreground` | `#626262` | Secondary text |
| `--surface` | `#F5F5F3` | Alternating sections, login aside |
| `--hairline` | `#DEDEDA` | Decorative dividers |
| `--input` | `#767676` | Control boundaries (3:1 contrast) |
| `--charcoal` | `#1B1B1B` | Footer, CMS sidebar |

### Semantic

`success` / `warning` / `error` / `info` / `disabled` (+ `-foreground`). Error aliases `destructive` for shadcn.

### Role colors

`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `border`, `ring`, sidebar tokens — light in `:root`, dark-ready in `.dark`.

### Type, space, chrome

- Fonts (`lib/fonts.ts`): Jost (display), IBM Plex Sans (body), IBM Plex Mono (notation).
- Utilities: `type-display`, `type-section`, `type-notation`, `container-site`, `dashboard-page`.
- Also tokenized: radius, border width, focus ring, shadows, control/icon/avatar sizes, container widths, breakpoints, z-index, motion durations/easing, opacity (disabled / hover / overlay).

## Shared UI (`components/ui/`)

shadcn **Base Nova** (`@base-ui/react`). Add with `npx shadcn@latest add <name>` **when a feature needs it** — do not pre-add unused kit (DatePicker, Combobox, FileUpload, etc.).

**Adopted Telecel wrappers:** `Heading`, `Text`, `SearchInput`, `EmptyState`, `InputGroup`.

**In repo today (forms / chrome):** Button (`cta`, `ink-outline`), Input, Textarea, Select, Checkbox, Switch, Label, Field, Dialog, Alert Dialog, Sheet, Dropdown Menu, Tooltip, Card, Table, Pagination, Badge, Avatar, Accordion, Separator, Tabs, Breadcrumb, Sidebar, Sonner, Skeleton, Spinner.

**Typography:** `Heading`, `Text`.

## Layout (`components/layout/` + shells)

| Piece | Location |
| --- | --- |
| Marketing navbar / footer | `site-navbar.tsx`, `site-footer.tsx` |
| Page container / section / container | `page-container`, `section`, `container` |
| Auth shell | `components/auth/auth-shell.tsx` |
| CMS header / sidebar | `dashboard-header`, `app-sidebar` |
| Portal page header | `portal-page-header` |
| Errors | `error-screen`, `route-error`, `access-denied`, `unauthorized`, `bad-request`, `maintenance-screen` |
| Route loading | `RouteSkeleton` + colocated `loading.tsx` |

Flex/grid spacing: Tailwind utilities only — no `Stack` / `Grid` React wrappers.

No mobile bottom tab bar (public Sheet + CMS collapsible sidebar cover narrow viewports). No stepper until a multi-step flow ships.

## Non-visual engines

| Concern | Where |
| --- | --- |
| API / DB | `lib/supabase/{client,server,admin}.ts` |
| Auth + guards | `data/auth.ts`, `proxy.ts`, `lib/auth-config.ts` |
| Permissions | `constants/dashboard-nav.ts` + `data/auth` guards |
| Validation | `validations/*` + Zod + react-hook-form |
| Formatters | `lib/format.ts` (date, relative, currency) |
| Hooks | `hooks/use-debounced-search-param`, `use-mobile` |
| Constants / routes | `constants/*` |
| i18n | English only (Phase 1). Typed label modules; no locale prefix. |
| Client state | Prefer Server Components + URL params. No Zustand/TanStack Query by default. |

## Motion and accessibility

- 150ms color (`--duration-fast`), 240ms panels (`--duration-panel`). No perpetual animation. `prefers-reduced-motion` removes motion.
- 4.5:1 text contrast, 3:1 essential graphics, visible focus (2px ink outline), 44px targets. Status is never color alone.

## Pending from Telecel

Official logo SVGs (color, reversed, emblem), the confirmed brand red, the brand font decision, V11/V11.1 designs, the hero film, and the approved text pack (all home copy in `constants/home-content.ts` is provisional).
