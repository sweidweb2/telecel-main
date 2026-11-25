# Caching strategy

Next 16 without `cacheComponents`. Data caching uses `unstable_cache` with
tags; route caching uses static rendering / ISR (`export const revalidate`).

## Public marketing pages

| Route | Mode | Invalidation |
| --- | --- | --- |
| `/`, `/contact`, other content pages | Static (built once) | Redeploy |
| `/insights` | ISR, `revalidate = 300` | `updateTag("blogs")` + `revalidatePath` |
| `/insights/[slug]` | ISR, `generateStaticParams` + `revalidate = 300` | `updateTag("blogs")`, `updateTag("blogs:slug:<slug>")` + `revalidatePath` |
| `/sitemap.xml` | Static, uses cached slugs | `revalidatePath("/sitemap.xml")` |

The marketing layout never reads cookies or the session, so these pages stay
static. Do not add `cookies()`/`headers()` there.

## Blog data (`data/blogs.ts`)

All public reads use the anon Supabase client (published rows only, via RLS)
wrapped in `unstable_cache`, tagged `blogs` (`lib/cache-tags.ts`); single-post
reads also carry `blogs:slug:<slug>`. TTL 300 s is only a backstop.

`refreshBlogPaths()` in `actions/blog-shared.ts` is called by every blog
mutation (create, update incl. publish/unpublish/feature, delete, cover image
upload/remove). It uses `updateTag` (Server Actions only) so the editor's next
view waits for fresh data instead of getting stale-while-revalidate. Pass both
old and new slugs on rename. Do not call it from Route Handlers; use
`revalidateTag(tag, "max")` there.

## Dynamic and protected surfaces

- `/dashboard/*`, `/login`, `/update-password`, `/auth/*`, `/maintenance`
  read cookies / the session and render dynamically. `next.config.ts` also
  sends `Cache-Control: private, no-cache, no-store, must-revalidate` so no
  browser or CDN keeps protected HTML.
- Staff-only reads (dashboard lists) are never wrapped in `unstable_cache`;
  they use the per-request authenticated client.
- **Maintenance**: `proxy.ts` reads the flag via `getMaintenanceModeForProxy`
  (short in-memory + `unstable_cache` tagged `MAINTENANCE_CACHE_TAG`) and
  rewrites public traffic to `/maintenance`. The rewrite sets `no-store`, so a
  static page's URL never caches the 503 screen. Toggling the flag in
  `actions/site-settings.ts` calls `revalidateTag(MAINTENANCE_CACHE_TAG)` and
  clears the proxy memory cache. Because the proxy runs on every matched
  request, static pages are gated even when served from the ISR cache.

## Static assets

- `/_next/static/*` (hashed): `public, max-age=31536000, immutable`, set by
  Next and not overridable.
- `/brand/*` (un-hashed files in `public/`): `public, max-age=86400,
  stale-while-revalidate=604800`. Rename the file when artwork changes.
- Remote images go through `next/image` (Supabase storage pattern).
