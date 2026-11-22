# Backlog status — foundation setup (2026-10-20)

Branch `feat/foundation-setup`. Status of each board card after this branch.

| Card | Status | Where |
| --- | --- | --- |
| Clean leftovers from prior copy | ✅ Done | Unused pages, features, tables, copy, `/en` and `/fr` routing and seed credentials removed. Blog CMS kept and adapted as Insights → News. |
| Collect all documents | 👤 Team | Store in `docs/client/` (git-ignored). Still needed: text pack and sitemap, brand guide, logo files, V11/V11.1 design. |
| Prepare the theme + logo + font | ✅ Done (provisional values) | "Connected Energies" system: `docs/02-architecture/design-system.md`. Real wordmark extracted locally (git-ignored). Swap in the official SVGs, red and font when received. |
| Prepare central error handling pages | ✅ Done | `ErrorScreen` used by `error.tsx`, `global-error.tsx`, `not-found.tsx` (static), `AccessDenied` (403), segment boundaries. |
| Decide libraries + package.json | ✅ Done | `docs/02-architecture/libraries.md`. Package renamed `telecel-global`. |
| Get Supabase project credentials → env | 👤 Team | Create staging and prod projects, then follow `docs/04-runbooks/environment.md`. |
| Prepare the env files + send to each other | 🟡 Template ready | `.env.example` lists every variable. Share real values through the password manager only. |
| Define editor portal features | 🟡 Draft | `docs/02-architecture/editor-portal-features.md`. Four questions for the team at the end. |
| Draft of tables + dbml | 🟡 Draft | `docs/03-database/schema.dbml` (migrated tables plus proposed ones). |
| Users and profile table + migrate to Supabase | ✅ Migration ready | `supabase/migrations/20261020090000_baseline_profiles_and_access.sql`. Runs on the first `db push`. |
| Login-only UI + CRUD + navigation to empty portals | ✅ Done | `/login` (no signup), Users CRUD with roles/suspend, role-aware sidebar, 17 portal sections with placeholders. |
| Prepare all shared components | ✅ Base | shadcn primitives, `AuthShell`, `PortalPageHeader`, `PortalPlaceholder`, `AccessDenied`, `Logo`. More come with each feature. |
| Handle logout + protect portal URL with middleware | ✅ Done | `proxy.ts` (Next 16 rename of middleware) plus server guards in `data/auth.ts` plus RLS. Logout clears the session. |
| Handle Google login | 🟡 Code done | Needs a Google Cloud OAuth client and the provider enabled: `docs/04-runbooks/auth-setup.md` §4. |
| Handle reset password (research: without own domain email?) | ✅ Deferred to Contact | Login → Contact us → inquiries portal / admin temp password. See `auth-setup.md` §5. |
| Handle session timeout — 1 day | ✅ Done | Absolute 24h enforced in the DB and the app: `auth-setup.md` §3. |
| Prepare portals (library or manual) | ✅ Done (manual) | Built on the existing shadcn sidebar. No admin-template library needed. |
| Public Pages Front-end (AS) | ➡️ Ready to start | Clean slate: `constants/site-nav.ts` holds the RFQ sitemap. Navbar, footer and placeholder home are wired. |
