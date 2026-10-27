# Foundation plan — Telecel Global (backlog setup cards)

Branch: `feat/foundation-setup`. Source of scope: Telecel Global RFQ (Aug 2026, kept outside git — see `docs/client/README.md`).

## RFQ facts that drive decisions

- Sales-led B2B site. Sitemap: Home, Platform, Services (5 pillars), Solutions (4), Use Cases (6), Why Telecel Global (Approach, Leadership, Global Reach, Partners), Insights (News, Case Studies), Contact (Talk to Sales, Request a Demo, routed inquiry form).
- **English only** for Phase 1. Multilingual is a separately priced optional item.
- CMS governance: **named admin/editor roles**. MarCom edits pages, services, news, leadership, CTAs and forms without a developer. Sub-services start as modules inside pillar pages and must be convertible to standalone pages later.
- Inquiry form fields: name, company, role, email, country, area of interest, business need, preferred contact method, consent. Routing by service area / recipient group must be configurable without code changes. Spam protection, analytics events.
- Security: secure admin access, role-based permissions, backups, no hard-coded credentials. Clean URLs, redirects, editable SEO metadata, sitemap and robots control.
- No paid plugin, font or service without approval. Brand: Telecel red as the anchor, white-dominant, black/grey support, clean geometric type.
- The public pages front-end is AS's card. This plan prepares the foundation it builds on and doesn't build the marketing pages.

## Decisions

1. **Clean base.** Strip prior-product-only features end to end: apply/interest registrations, portfolio/startups, programme, about/FAQ copy, contact messages (superseded by inquiries), unused constants, images, seed script and stray `test-dialog*.css`. Keep the infrastructure: Supabase clients, auth, users CRUD, dashboard shell, error boundaries, SEO helpers, rate limiting, Turnstile, sanitize-html, UI primitives. Leave a minimal Telecel placeholder home, a legal page shell and a site navbar/footer wired to the RFQ sitemap with placeholder routes, so AS starts on a clean slate. Blog/insights CMS is kept and adapted as Insights → News.
2. **English only, no locale prefix.** Remove `/en` and `/fr`, the locale middleware and the FR dictionaries. Clean URLs (`/services/cybersecurity`). Keep copy in typed label modules so i18n can be added later as a priced option.
3. **Fresh migration baseline.** Start Telecel from a clean baseline (no create-then-drop of prior history). Roles: `admin`, `editor` only (RFQ "named admin/editor roles"; drop `viewer`). Keep `is_admin()`, add `has_role()` / `is_staff()`, the role-escalation trigger, trgm indexes and the `get_user_stats` RPC. New auth users default to `editor` unless app_metadata says `admin`.
4. **Login only (invite-only).** Remove public signup and `/register`. Admins create users from the Users portal (Auth Admin API, already implemented). In production, disable Supabase signups ("Allow new users to sign up" = off) so Google OAuth can't create accounts for unknown Google users. Existing users signing in with a Google account on the same email get linked automatically.
5. **Google login.** `signInWithOAuth({ provider: 'google' })` with PKCE through `/auth/callback`. Button on the login page behind `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`. Config in `supabase/config.toml` `[auth.external.google]` via env. If the OAuth user has no profile or signups are blocked, show a friendly error on the login page.
6. **Password reset (research and implementation).** Hosted Supabase's default SMTP only sends to project team members and is heavily rate-limited, so it isn't usable for real users. Options without our own domain: (a) custom SMTP from a provider that allows single-sender verification without a domain (Brevo, or Gmail/Workspace SMTP with an app password); (b) **no email at all:** an admin generates a recovery link with `auth.admin.generateLink({ type: 'recovery' })` in the Users portal and shares it, or sets a temporary password. Implement both paths: `/forgot-password` → `resetPasswordForEmail` → `/auth/callback?next=/update-password` → `/update-password`, plus the admin "Generate reset link" action. Document the SMTP choice for the team.
7. **Session timeout = 1 day, absolute.** Supabase's "time-box user sessions" is Pro-only, so enforce it in the app as well. The proxy reads the JWT claims (`getClaims()`), takes the `amr[].timestamp` (time of the last real authentication), and if it's older than 24h signs out and redirects to `/login?reason=session-expired`. Also set `[auth.sessions] timebox = "24h"` in `config.toml` for local, and on hosted Pro if available.
8. **`middleware.ts` → `proxy.ts`** (Next 16 rename). Proxy does optimistic checks only: session refresh, the 24h timeout, the unauthenticated → `/login?next=` redirect, and logged-in users bounced away from `/login`. Real authorization stays in server code: `requireStaff()` / `requireAdmin()` in the portal layouts, plus RLS. Logout is a server action that clears the session cookies → `/login`.
9. **Portals.** One `/dashboard` shell with a role-aware sidebar.
   - Content (admin + editor): Overview, Pages, Services, Solutions, Use Cases, Insights (News, Case Studies), Leadership, Partners, CTAs, Media, Inquiries, SEO & Redirects.
   - Admin only: Users, Form Routing (recipient groups), Site Settings (analytics/tag IDs, contact defaults), Backups.
   - Each section is an empty page using a shared `PortalPlaceholder` (title, description, planned capabilities). Admin pages call `forbidden()` for editors; enable `experimental.authInterrupts` and add `app/forbidden.tsx`.
10. **Central error pages.** One branded `ErrorScreen` used by `app/error.tsx`, `global-error.tsx`, `not-found.tsx`, `forbidden.tsx`, `unauthorized.tsx` and the segment boundaries. No stack traces shown. Digest shown for support.
11. **Theme, logo and font.** All brand values in CSS tokens in `globals.css`: Telecel red primary, neutral greys and black, light and dark. One `lib/fonts.ts` export, using a free geometric Google font as a placeholder until Telecel confirms the font. A `components/brand/logo.tsx` with a text wordmark placeholder, swapped for the official SVG when supplied.
12. **Docs hierarchy.** `docs/` is committed but holds technical, non-confidential docs only (architecture, database DBML, runbooks, tasks). `docs/client/` is git-ignored for the RFQ, text pack and brand files, because the GitHub repo is **public**.
13. **Tables draft.** `docs/03-database/schema.dbml` holds the full Phase 1 CMS model as a draft (profiles, inquiries, recipient groups/routing rules, service pillars + service modules, solutions, use cases, pages + ordered page sections, insights (news/case study), leaders, partners, CTAs, media assets, redirects, SEO fields, site settings, audit log). Only `profiles` is migrated now. The rest wait for team review of the editor-portal feature list (`docs/02-architecture/editor-portal-features.md`).
14. **Libraries.** Keep the existing approved stack. Rename the package `my-app` → `telecel-global`. Drop deps that only removed features used (e.g. TipTap only if no CMS rich text is planned — **keep it**, since Insights/Leadership need rich text). No new runtime deps.
15. **Env.** Fill in `.env.example` with every variable and a comment for each. Add a runbook for env setup and sharing (via a password manager, never chat or git).

## Execution order
1. Docs hierarchy + plan + git hygiene. 2. Prior-product cleanup + English-only routing + `proxy.ts`. 3. Migration baseline + types. 4. Auth: login only, logout, Google, reset password, 24h timeout. 5. Portals + role guards + error/forbidden pages. 6. Theme tokens, font, logo. 7. DBML + editor features + env example + libraries doc. 8. Lint, typecheck, unit tests, build, and Playwright public/auth smoke tests.

## Not in this branch (needs people or external access)
Collect documents; create the Supabase project and share credentials; Google Cloud OAuth client; SMTP account; official logo/font files; the Public Pages front-end (AS).

## Codex review (2026-10-20) and what changed

Codex (gpt-6-astra, high effort) reviewed this plan read-only. Adopted:

- **Open redirect fixed:** the inherited `next` checks accepted `/\evil.example`. Now there is one validator, `lib/safe-redirect.ts`, with an allow-list (`/dashboard`, `/update-password`) and tests for encoded and backslash variants.
- **Authorization at every operation:** `requireStaff` / `requireSection` (pages) and `authorizeAction` (actions) in `data/auth.ts`, plus RLS. The proxy is optimistic only. `server-only` is imported in `data/` and `lib/supabase/admin.ts`.
- **24h timeout redesigned:** uses `auth.sessions.created_at` via `session_id` (immutable), not JWT `amr`/`iat`. Enforced inside `is_staff()`/`is_admin()`, so direct API calls are covered.
- **No default role:** new accounts get no CMS access unless an admin assigns admin/editor. Admins can suspend users (`is_active` plus an Auth ban). No shared default password.
- **Reset links** use the `token_hash` flow (`/auth/confirm`), not PKCE, so they work across devices. Admin-generated recovery links are deferred.
- **Kept the blog CMS** and adapted it as Insights → News (editors can manage it; old and new slugs are both revalidated) instead of deleting it (decision 1 above amended).
- **Kept typed English label modules**, removed locale routing (decision 2 above confirmed).
- **No experimental `forbidden()`:** a stable `AccessDenied` component is used instead (decision 9 amended).
- `not-found.tsx` no longer reads the session. Public pages stay static.

Deferred (tracked in `editor-portal-features.md` / `schema.dbml`): audit log, shared rate limiting, private draft-media bucket, revisions/concurrency, inquiry delivery retries/retention, restore testing.
