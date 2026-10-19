# CDN readiness report — v1

**Date:** 26 August 2026  
**Scope:** Next.js app + Supabase Storage (generic CDN / edge readiness)  
**Status:** Partially CDN-ready — not CDN-hardened yet

---

## Verdict

You’re partly CDN-ready for a **Next.js + Supabase Storage** setup, but not “CDN-hardened” yet. Checklist item **CDN** in the project docs is still unchecked for a reason — most gaps are **headers strategy**, **HTML cacheability**, and **storage cache metadata**, not missing `next/image`.

---

## Checklist scan

### 1. Correct cache headers — **Gap (app-level)**

| Layer | Status |
|--------|--------|
| Next `_next/static/*` | Handled by Next/host (hashed → long-cache) |
| Your `next.config.ts` | **No** `headers()` / `Cache-Control` |
| Supabase uploads | **No** `cacheControl` on `.upload()` |

You never set HTTP cache headers in app code. You’re relying on platform defaults only.

**Gap:** Explicit policy for HTML, `public/`, OG images, and Storage objects.

---

### 2. Cache-control strategy — **Partial (data only)**

**Handled**
- Blog reads: `unstable_cache` + `revalidate: 300` + `BLOGS_CACHE_TAG` in `data/blogs.ts`
- Mutations: `revalidateTag` / `revalidatePath` in `actions/blogs.ts`

**Gaps**
- No documented split like: HTML `s-maxage` / `stale-while-revalidate` vs assets `immutable` vs APIs `private, no-store`
- Marketing layouts call `isAuthenticated()` (`app/(marketing)/en/layout.tsx`), and **middleware always refreshes Supabase session** — HTML is effectively **personalized / cookie-tied**, so a full-page CDN edge cache is weak or wrong unless you redesign (e.g. shell + client auth snippet, or `Vary` / no HTML CDN)

---

### 3. Asset versioning — **Handled for Next; Partial for uploads**

**Handled**
- Next build hashes JS/CSS under `/_next/static/…`
- Blog uploads use new paths: `` `${blogId}/${nanoid(10)}.${ext}` `` then delete old file — good **content-busting** without query strings

**Gaps**
- Files in `public/` (few SVGs today) are **not** content-hashed
- Partner logos point at **external** `cdn.21st.dev` URLs (third-party versioning, not yours)

---

### 4. Immutable static assets — **Handled by framework default**

Middleware correctly skips `_next/static` and `_next/image`:

```text
"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
```

You don’t override that with bad headers. **No custom “immutable” policy** in repo, but Next’s hashed assets are the right model.

---

### 5. Public / private file handling — **Mostly handled (blogs)**

**Handled**
- Public buckets `blogs` + `auther` with public SELECT + admin-only write (`supabase/migrations/20260826140100_blogs_storage_buckets.sql`)
- MIME + size limits on buckets
- App builds **public** URLs only (`/storage/v1/object/public/...`)
- Admin-gated uploads in `actions/blogs.ts`

**Gaps**
- No **private** buckets / signed URLs yet (fine if everything media-related stays public)
- Portfolio/startup storage called out in docs but **not implemented** in migrations/app yet
- Bucket name typo `auther` (cosmetic/ops, not CDN)

---

### 6. Cache invalidation strategy — **Partial**

**Handled (app/data cache)**
- Tag + path revalidation on blog CRUD/image change

**Gaps (CDN / Storage)**
- No purge API / CDN webhook story
- Storage: replace-by-new-path helps browsers; **edge CDN can still cache old URL** until TTL if something still links it
- Upload doesn’t set short/long `cacheControl` on the object
- HTML/edge invalidation not designed (and hard while pages are auth-aware)

---

### 7. Image optimization — **Partial**

**Handled**
- `next/image` on blog cards, featured section, startup cards, logo cloud
- Responsive `sizes` on several marketing images
- `remotePatterns` for Untitled UI, `cdn.21st.dev`, Supabase public storage

**Gaps**
- Avatars use `AvatarImage` (plain `<img>`), **not** `next/image` — no optimizer/CDN transform
- No app-side resize/compress before upload (originals up to 5MB / 2MB)
- No blur placeholders / consistent `priority` policy beyond featured hero
- Confirm `hostname: "*.supabase.co"` works for your Next version; if not, pin `your-project.supabase.co`

---

### 8. CDN URLs if needed — **Partial / not productionized**

**Today**
- Media: `NEXT_PUBLIC_SUPABASE_URL` + `/storage/v1/object/public/...` (Supabase’s CDN front)
- Logos: third-party `cdn.21st.dev`
- App assets: same origin as the Next host (Vercel Edge if you deploy there)

**Gaps**
- No custom asset domain (e.g. `cdn.asip…` / Cloudflare in front of Storage)
- No env like `NEXT_PUBLIC_CDN_URL` / image loader rewrite
- No decision doc: host CDN vs Supabase CDN vs dual

---

### 9. CORS for assets — **Not in this repo (platform config)**

No CORS headers or asset CORS docs in the Next app. For **public Storage + same-site pages** this is usually fine. Gaps appear if you:
- Load Storage from a **custom CDN domain**
- Use canvas / cross-origin fetches
- Serve fonts/assets cross-origin

That lives in **Supabase Storage / CDN dashboard**, not in your TS today.

---

### 10. Upload / storage architecture — **Good start; incomplete for full product**

**Handled (blogs)**
- Server Action upload (admin only)
- Path namespacing by `blogId`
- MIME/size checks
- DB URL update + delete previous object
- Rollback delete on failed DB update

**Gaps**
- No `cacheControl` on upload options
- No image pipeline (WebP/AVIF, max dimensions)
- No multipart / direct-to-Storage signed upload (all bytes through Next server)
- No private/sensitive uploads
- Startup logo/gallery storage still a **doc TODO**, not code

---

## Scorecard

| Checklist item | Status |
|----------------|--------|
| Correct cache headers | Gap |
| Cache-control strategy | Partial (Next data cache only) |
| Asset versioning | Partial (Next + nanoid paths; not `public/` / CDN URL layer) |
| Immutable static assets | OK via Next defaults |
| Public/private files | OK for blog public buckets; no private pattern |
| Cache invalidation | Partial (revalidatePath/Tag; no CDN/Storage purge policy) |
| Image optimization | Partial (`next/image` yes; avatars + upload pipeline no) |
| CDN URLs | Partial (Supabase public URLs; no first-party CDN) |
| CORS for assets | Not configured in app (usually OK for public Storage) |
| Upload/storage architecture | Solid for blogs; incomplete product-wide |

---

## Highest-impact gaps before “CDN-efficient”

1. **Decide HTML caching** — today middleware + auth in marketing layout fight full-page CDN.
2. **Set Storage `cacheControl`** on upload (e.g. long max-age for immutable nanoid paths).
3. **Add `headers()`** (or host rules) for `public/` and any non-hashed assets.
4. **Optimize avatars** through `next/image` (or a loader).
5. **Document** invalidation: tag revalidate (pages) vs new object key (media) vs CDN purge (if you add one).
6. When portfolio ships, **reuse** the blogs bucket pattern (public read, admin write, versioned paths).

---

## Related

- Prompt / checklist source: `Docs/[06] Documentation/[6.7] CDN ready.md`
- Project checklist CDN item: `Docs/[06] Documentation/[6.1] Project Checklist - v2 .md`
