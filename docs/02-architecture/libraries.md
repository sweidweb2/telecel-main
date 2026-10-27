# Libraries

Board card: *Decide libraries we will use and put them in package.json*. Decided 2026-10-20 for Telecel Global. Every dependency is free/OSS; RFQ §13 requires approval before adding any paid plugin, font or service.

Approved stack for this Next.js App Router + Supabase app. Prefer these over alternatives. Do not add Zustand, TanStack Query, or Redux until the conditions below are met.

## Backend

- **@supabase/ssr** + **@supabase/supabase-js** — official Next.js App Router clients (cookies/session). Do not use the old auth-helpers packages.
- **server-only** — import at the top of server-only modules (`data/`, `lib/supabase/admin.ts`) so a client import fails the build.

## UI / styling

- **shadcn/ui** — not an npm component library. This app uses the **Next** template, **Base UI** library, and **Nova** preset (`style: "base-nova"` in `components.json`). CLI copies source into `components/ui/`. Add with `npx shadcn@latest add <name>`. Do not reinvent primitives shadcn already has. Do not re-init onto Radix or another preset.
- **@base-ui/react** — underlying primitives for `components/ui/`. Do not add Radix (`radix-ui` / `@radix-ui/*`) for new UI.
- **Tailwind CSS v4** — required by shadcn; no runtime CSS-in-JS.
- **lucide-react** — default shadcn icon set. Tree-shakeable; keep icons at `h-4 w-4` / `h-5 w-5`.
- **clsx** + **tailwind-merge** — used only via `cn()` in `lib/utils.ts` for conditional classNames.
- **nextjs-toploader** — thin top-of-screen progress bar on route changes (YouTube/GitHub style). Not shadcn. Mount once in `app/layout.tsx`. For `router.push` / `router.replace`, import `useRouter` from `nextjs-toploader/app` so the bar still runs.
- **next-themes** — class-based light/dark/system theme. Wrap the app with `ThemeProvider` in `app/layout.tsx`; dashboard avatar menu toggles theme.
- **boneyard-js** — pixel-perfect route skeletons captured from real UI ([docs](https://github.com/0xGF/boneyard)). Colocate `loading.tsx` with `RouteSkeleton` from `components/skeleton/route-skeleton.tsx`; pass shadcn layout as `fallback` until `npm run bones:build`. Registry lives in `bones/registry.ts` (imported once via `BoneyardSetup` in `app/layout.tsx`). Config: `boneyard.config.json`. Keep shadcn `Skeleton` in `components/ui/skeleton` for small inline placeholders (sidebar menu, form suspense) — not for route-level loading.

## Forms & validation

- **zod** — schemas live in `validations/`. Same schema for client forms and Server Actions.
- **react-hook-form** — performant forms (uncontrolled inputs). Do not drive forms with a pile of `useState`.
- **@hookform/resolvers** — `zodResolver` connects Zod to react-hook-form.
- **@tiptap/react** (+ StarterKit, Link, Underline, Placeholder) — rich HTML editor for news, case studies, leadership bios and service modules (`components/blogs/blog-rich-text-editor.tsx`). Do not add the full TipTap Simple Editor CLI scaffold (extra UI kit that conflicts with Base UI).
- **isomorphic-dompurify** — sanitize TipTap HTML on save and before public render (`lib/sanitize-html.ts`).

## Dates & IDs

- **date-fns** — tree-shakeable date utils. Import only the functions you need. Never use moment.js.
- **nanoid** — short client-side IDs (e.g. optimistic UI temp IDs). DB IDs stay `gen_random_uuid()`.

## Control flow

- **ts-pattern** — type-safe matching in `data/` and `actions/` (error/result branching). Prefer over large `switch`/`if` chains on discriminated unions.

## Testing

- **Vitest** — unit and component tests (`npm test`). Fast, isolated logic.
- **Playwright** — E2E (`npm run test:e2e`), especially auth and RLS. First machine: `npx playwright install chromium`.
- They are not interchangeable. Do not add Jest.

## Do not install unless needed

- **zustand** — only for genuine cross-component client state that Server Components and URL search params cannot handle. Do not create `stores/` or install Zustand by default. Never Redux.
- **@tanstack/react-query** — only for client-side data that changes after load (polling, optimistic updates, infinite scroll, client-triggered refetches). Initial reads go through Server Components + `data/`. Do not add it just to “fetch data.”


## Planned additions (need team sign-off when the feature is built)

- **Analytics/tag manager**: `@next/third-parties` (GTM/GA) once Telecel confirms its analytics account (RFQ §5).
- **Shared rate limiting**: `lib/rate-limit.ts` is per-instance memory. For multi-instance hosting, move to a Postgres-backed limiter (no new vendor) or Upstash (needs approval).
- **Cookie consent**: use Telecel-provided wording; prefer a small in-house banner over a paid CMP.
