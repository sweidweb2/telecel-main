# Lightweight stack — what to keep, cut, or replace

Dated 2026-10-27. Companion to [`../02-architecture/libraries.md`](../02-architecture/libraries.md).

Goal: shrink install size and client JS without rewriting the app or abandoning the approved Next.js + Supabase + shadcn stack.

**Rule of thumb:** measure production impact (route JS / First Load), not `node_modules` folder size. Dev tools (Vitest, Playwright, Supabase CLI) do not ship to users.

---

## 1. Keep (core — do not replace)

| Library | Why |
|---|---|
| Next.js, React, React DOM | App framework |
| TypeScript | Tooling |
| `@supabase/ssr`, `@supabase/supabase-js` | Auth + DB |
| `server-only` | Guard server modules |
| Zod, react-hook-form, `@hookform/resolvers` | Shared validation + forms |
| Tailwind v4, `@base-ui/react`, shadcn/ui, lucide-react | UI system |
| `clsx`, `tailwind-merge`, `class-variance-authority` | `cn()` + variants (tiny) |
| Vitest, Playwright | Tests (dev-only) |

Swapping any of these costs more than it saves.

---

## 2. Cut or replace (priority order)

Do these in order. Stop when the app is light enough.

### P1 — Biggest client-bundle wins

| Current | Action | Replace with | Tradeoff |
|---|---|---|---|
| **TipTap** (6 packages) | Cut if blogs can leave WYSIWYG | Markdown (`textarea` + markdown renderer) or plain text | No rich HTML editor in admin |
| **isomorphic-dompurify** | Cut with TipTap | Not needed for Markdown; keep a sanitizer only if HTML is still stored | Security still required for any HTML path |
| **boneyard-js** | Cut | shadcn `Skeleton` in each `loading.tsx` | Less pixel-perfect route skeletons; simpler DX |

Touch points today:

- TipTap → `components/blogs/blog-rich-text-editor.tsx`
- Sanitize → `lib/sanitize-html.ts`, `actions/blogs.ts`
- Boneyard → `bones/`, `components/skeleton/route-skeleton.tsx`, `app/**/loading.tsx`, `BoneyardSetup` in root layout

### P2 — Easy native swaps (small but clean)

| Current | Action | Replace with |
|---|---|---|
| **date-fns** | Replace if only used for `format()` | `Intl.DateTimeFormat` / `toLocaleDateString` |
| **nanoid** | Replace | `crypto.randomUUID()` (browser + Node) |

Touch points today: tables/dialogs (`format`), blog/user actions and e2e helpers (`nanoid`).

### P3 — Optional UX trims (only if product agrees)

| Current | Action | Notes |
|---|---|---|
| **nextjs-toploader** | Remove or tiny CSS bar | Route progress is nice-to-have |
| **next-themes** | Remove if no dark mode | Dashboard theme toggle goes away |
| **sonner** | Remove or tiny custom toast | Keep if mutations still need feedback |

### Leave alone (not worth the churn)

| Library | Why leave |
|---|---|
| **ts-pattern** | Tiny; improves `actions/` / `data/` branching |
| shadcn helpers (`cva`, `clsx`, `tailwind-merge`) | Required by UI primitives |
| Vitest / Playwright / Supabase CLI | Dev-only |

---

## 3. Target “slim” dependency set

After P1 + P2 (and optional P3):

**Runtime**

- next, react, react-dom
- @supabase/ssr, @supabase/supabase-js, server-only
- zod, react-hook-form, @hookform/resolvers
- @base-ui/react, lucide-react, next-themes\*, sonner\*, nextjs-toploader\*
- class-variance-authority, clsx, tailwind-merge, tw-animate-css
- ts-pattern (optional keep)

\* Drop only if P3 is approved.

**Dev**

- typescript, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss
- vitest, jsdom, @playwright/test, supabase, shadcn, @types/*

**Removed vs today**

- `@tiptap/*` (all)
- `isomorphic-dompurify` (if no HTML body)
- `boneyard-js`
- `date-fns`
- `nanoid`

---

## 4. What “lightweight” does *not* mean

- Do not add Zustand / TanStack Query / Redux to “optimize” — they add weight.
- Do not switch Base UI → Radix or invent a second component system.
- Do not replace Zod with hand-rolled validators.
- Do not chase micro-deps if First Load JS is already acceptable after P1.

---

## 5. Suggested rollout

1. **Decide blog body format** — Markdown (or plain text) vs keep TipTap HTML. This is the only product decision that unlocks P1.
2. **Remove boneyard** — replace `RouteSkeleton` usages with shadcn `Skeleton` layouts; delete `bones/` + config scripts when unused.
3. **Native dates + IDs** — one PR for `date-fns` / `nanoid` call sites.
4. **Optional chrome** — toploader / themes / toasts only after measuring and product OK.
5. **Update** [`libraries.md`](../02-architecture/libraries.md) in the same PR that removes a package, so approved stack stays accurate.

---

## 6. Checklist before merging a cut

- [ ] Package removed from `package.json` and lockfile
- [ ] No remaining imports (search the repo)
- [ ] Blog/public HTML path still sanitized if HTML remains
- [ ] `loading.tsx` routes still show a skeleton
- [ ] Auth / blogs / users smoke paths still work
- [ ] `libraries.md` updated
