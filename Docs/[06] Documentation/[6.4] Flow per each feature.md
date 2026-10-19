Phase 1: Authentication (Foundation)
- Create `profiles` table migration with trigger for `auth.users`
- Implement signup, login, and logout flows (`actions/auth.ts`)
- Add password reset support
- Protect routes via middleware (redirect unauthenticated users)
- Ensure session handling works end-to-end (refresh, expiration, logout clears cookies)
- Write Playwright E2E test covering signup → login → protected route access → logout

*Rationale:* Every other feature relies on user IDs and robust RLS policies tied to `auth.uid()`. Lay a strong foundation first.

Phase 2: Core Domain Modeling
- Design main database schema for your product (entities like projects, teams, etc.)
- Write migrations for each table, bundled with RLS + indexes
- Generate and commit `types/database.ts`
- Implement data/ (read) functions per entity
- Implement actions/ (write) functions per entity
- Add Zod schemas for validation per entity

*Rationale:* These are your critical business objects—build each on the solid auth base.

Phase 3: Core UI Flows
- Build app shell: navbar, sidebar, basic layout in `components/layout/`
- Implement list and detail pages per entity using data/ and Server Components
- Add create/edit forms (react-hook-form + zod + Server Actions)
- Wire up empty states, loading skeletons, and route error boundaries
- Provide toast feedback on mutation success/error

*Rationale:* Connect the backend to a usable interface—this is your MVP delivery loop.

Phase 4: Testing Pass
- Write unit tests (Vitest) for validation, utilities, and pure logic
- Create Playwright E2E tests for core user flows (create → view → edit → delete)
- Test RLS: ensure user A cannot access user B’s data

*Rationale:* Cover your core thoroughly before expanding—bugs in the foundation multiply later.

Phase 5: Performance Optimization
- Apply caching (unstable_cache, revalidateTag) to data/ functions
- Remove fetch waterfalls using `Promise.all` where safe
- Monitor bundle size (`next build` output; trim large client bundles)
- Run Lighthouse/Vercel Speed Insights for performance baseline
- Confirm database indexes are used via `EXPLAIN ANALYZE`

*Rationale:* Only optimize when you have real features and data to measure; avoid premature tweaks.

Phase 6: Observability & Polish
- Integrate Sentry and verify it captures real errors (throw a test error)
- Add rate limiting on sensitive routes
- Implement SEO metadata & OG images per page
- Ensure staging environment fully mirrors production; test deploy flow

Phase 7: Launch Readiness
- Test full staging-to-production migration flow
- Set up and verify Supabase backups (Point-in-Time Recovery if applicable)
- Check and confirm monitoring dashboards (Sentry, Vercel Analytics)
- Complete a final RLS policy audit—review every table and policy against a checklist