# 03 — Are there potential performance problems using a broader view?

**Short answer:** No **critical** performance problems for the current admin-only volume. Taking a broader view does surface **several latent risks** that will matter as `audit_log` / `app_errors` grow, and a few **sequential statement patterns** on hot mutation paths (especially `updateUser` and blog image upload) that already cost more round-trips than the logging insert itself.

**Question as asked:** *“Are there any potential performance problems using a broader view?”*

**Scope:** Local branch observability feature + call sites in blogs/users/auth; admin list pages.

---

## 1. What looks healthy today

1. **Log list pages are not N+1.**  
   One PostgREST query with embedded actor join:
   - `actor:profiles!audit_log_actor_id_fkey(full_name, email)`  
   - same pattern on `app_errors`.

2. **No `select('*')`.**  
   Explicit `ACTIVITY_COLUMNS` / `ERROR_COLUMNS` in `data/audit-log.ts` and `data/app-errors.ts`.

3. **Pagination is bounded.**  
   Fixed page size 20; `.range(from, to)`; URL `page` capped via Zod (max 10_000).

4. **Indexes exist for primary access patterns.**  
   Migration `20261027120000_audit_and_app_errors.sql`:
   - `created_at desc` on both tables  
   - `(entity_type, entity_id, created_at desc)` and `(actor_id, created_at desc)` on audit  
   - `(source, created_at desc)` on errors  

5. **Search is debounced (600ms)** on the client, reducing navigation thrash.  

6. **Initial paint is Server Component + `loading.tsx` skeleton** — no client waterfall for first data.

7. **Logging helpers are fire-and-forget-safe** (awaited, but never throw into the primary action). One extra insert per successful CMS mutation is cheap relative to Auth Admin / storage work.

---

## 2. Potential performance problems (broader view)

### 2.1 Exact row counts on every list load

- Both getters use `.select(..., { count: "exact" })`.  
- Postgres must compute a precise count matching filters.  
- **Today:** Fine for small admin tables.  
- **Later:** As logs grow to hundreds of thousands of rows, exact count + `ilike` filters can dominate list latency.

**Mitigations (when measured):**

1. Use `count: "estimated"` / planned estimate for UI that only needs “about N”.  
2. Or show “20+” / hide total until needed.  
3. Keep exact count only when filters are empty and cache briefly (careful with admin freshness expectations).

### 2.2 `ilike '%term%'` search cannot use normal B-tree indexes

- Activity: `action`, `entity_type`, `entity_id`  
- Errors: `source`, `message`, `code`  
- Leading-wildcard `ilike` typically seq-scans as tables grow.

**Mitigations:**

1. Prefer prefix search (`term%`) if product allows.  
2. Add `pg_trgm` GIN indexes if full substring search is required.  
3. Cap search usage (already max 100 chars; good).

### 2.3 Unused JSON / text columns in the select list

- Activity selects `summary` (jsonb) though the table UI never renders it.  
- Error selects `context` (jsonb), `request_id`, and `code` (code unused in columns; still used in search filter server-side when present).  
- Broader cost: larger PostgREST payloads + Next RSC serialization for every admin page view.

**Mitigation:** Drop from list select until a detail view exists; fetch detail by id on expand if needed.

### 2.4 Sequential work in `updateUser` (broader mutation path)

`actions/users.ts` `updateUser` roughly does:

1. `authorizeAction`  
2. SELECT profile (`before`)  
3. Auth Admin `updateUserById`  
4. UPDATE `profiles` (session client)  
5. UPDATE `profiles.email` (admin client)  
6. `recordActivity` insert  

That is **multiple network round-trips** by design (Auth + RLS-sensitive profile fields + email mirror). Logging is only the last hop. Broader performance work should target **consolidating Auth/profile updates** (RPC or carefully ordered fewer writes), not removing audit.

### 2.5 Blog image upload / delete paths

`actions/blogs.ts` upload/remove flows can:

1. Authorize  
2. Load existing row  
3. Storage upload/remove  
4. DB update  
5. Sometimes secondary storage cleanup  
6. `recordActivity`

Again, observability is not the bottleneck; storage + sequential awaits are.

### 2.6 Per-call `createAdminClient()` inside every `record*`

- Each log creates a new admin client.  
- Cost is usually small (env + client construction) vs network insert.  
- Broader view: if a future action records many events in a loop, reuse one client.

### 2.7 Append-only growth with no retention policy

- Tables grant no UPDATE/DELETE to app roles — correct for integrity.  
- Broader operational performance: unbounded growth → larger indexes, slower counts/searches, higher backup cost.

**Mitigation:** Scheduled archival / purge job (service role) with documented retention (e.g. 90–180 days for `app_errors`, longer for `audit_log`).

### 2.8 Client navigations on every debounced search

- Each search change `router.push`s a new URL → full RSC refetch of the page.  
- Correct for Server Component architecture; 600ms debounce helps.  
- Broader alternative (only if lists feel sluggish): soft-nav with partial refresh patterns — do **not** switch first paint to TanStack Query (project rule).

### 2.9 Uncommitted Spinner/Sonner work

- Presentation-only; negligible runtime cost.  
- Watch bundle size if Sonner theming pulls heavy deps (it should not — already in stack).

---

## 3. Risk matrix

| Issue | Likelihood now | Impact now | Impact at scale | Action |
|-------|----------------|------------|-----------------|--------|
| Exact count on lists | High (always) | Low | Medium–High | Measure; then estimate/cache |
| `ilike %x%` search | Medium | Low | High | trgm or prefix |
| Unused JSON in select | High | Low | Medium | Trim selects |
| `updateUser` multi-hop | High on user edits | Medium | Medium | Optional RPC later |
| Log insert latency | High on mutations | Low | Low | Keep as-is |
| Unbounded table growth | Certain over time | Low | High | Retention job |
| N+1 on log pages | None observed | — | — | Keep join pattern |

---

## 4. Conclusion

From a broader view, performance is **sound for Phase-1 admin usage**. The real risks are **growth-shaped** (exact counts, substring search, retention) and **mutation fan-out** that predates or outweighs logging. Treat logging as a fixed small cost; invest measurement in list queries and multi-statement user/blog flows before optimizing architecture.
