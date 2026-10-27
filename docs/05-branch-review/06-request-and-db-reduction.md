# 06 — Can requests / database statements be reduced to speed up the application?

**Short answer:** Yes, **modestly**. The admin log pages are already efficient (one query + join per load). The best reductions on this branch are: (1) stop selecting unused columns, (2) reconsider exact counts, (3) reduce sequential statements on user update / blog media paths, and (4) avoid creating unnecessary navigations. Removing `recordActivity` / `recordAppError` would save one insert per mutation but is **not** recommended — the cost is small and the product value is high.

**Question as asked:** *“Can the number of requests or database statements be reduced to speed up the application?”*

---

## 1. Inventory — statements on key paths

### 1.1 Activity log page load

| Step | Kind | Notes |
|------|------|-------|
| `requireSection` | Auth/session (+ profile/role as implemented in `data/auth`) | Necessary gate |
| `getActivityLogPage` | **1** SELECT with embed + exact count | Necessary data |

**Reduction potential:** Low on the data query itself. Possible: drop `summary` from select; soften count.

### 1.2 Error log page load

Same shape as activity, plus optional `.eq("severity", …)`.

**Reduction potential:** Drop `context` / `request_id` from list select; optionally `code` if not displayed (still searchable via filter when selected — if dropped from select but kept in `.or()`, PostgREST still filters server-side without returning the column).

### 1.3 Successful blog create (typical)

| Step | Statement / request |
|------|---------------------|
| Authorize staff | session |
| Maybe clear other featured | UPDATE(s) |
| INSERT blog | 1 |
| `recordActivity` | 1 INSERT via admin |

**Reduction:** Featured uniqueness might be expressible as a partial unique index + single insert retry — broader than observability. Logging insert should stay.

### 1.4 Blog update

| Step | Notes |
|------|-------|
| Authorize | |
| SELECT existing | needed for publish/unpublish detection & ownership |
| Maybe clear featured | |
| UPDATE blog | |
| `recordActivity` | |

**Reduction:** Sometimes “select existing” can be replaced by RETURNING from update — depends on how action/status diffs are computed.

### 1.5 Blog image upload (heavier)

Authorize → SELECT existing → storage upload → DB update → maybe storage remove previous → `recordActivity`.

**Reduction focus:** storage round-trips and conditional cleanup ordering — not logging.

### 1.6 `updateUser` (highest statement fan-out in this branch’s call sites)

1. Authorize  
2. SELECT `profiles` (`before`)  
3. Auth Admin `updateUserById` (external Auth API — not Postgres table, but a request)  
4. UPDATE `profiles` (session)  
5. UPDATE `profiles.email` (admin)  
6. INSERT `audit_log`

**Why so many:** Email lives in Auth and is mirrored; role/active must go through RLS-checked session path; ban_duration needs Auth Admin.

**Reduction options:**

1. **Postgres RPC / security definer function** that performs profile updates under controlled checks — may collapse steps 4–5, not Auth.  
2. **Skip `before` select** if the client sends previous values you trust only for labeling — weaker; better keep server read or use RETURNING.  
3. **Do not skip audit insert** for speed.

### 1.7 Auth paths

- `signIn` — no observability write (correct).  
- `signInWithGoogle` / `requestPasswordReset` — at most one `recordAppError` on unexpected failure.  
Negligible.

---

## 2. Concrete reduction opportunities (ranked)

### A. Trim list SELECT columns (easy, safe)

**Saves:** Bytes per admin page request; RSC serialization time.  
**Does not reduce:** Statement *count* (still one query), but speeds the request.  
**Change:** Remove `summary` from activity list; remove `context`, `request_id` (and maybe `code`) from error list until detail UI exists.

### B. Soften or defer exact counts (medium)

**Saves:** Often the most expensive part of large filtered lists.  
**UI tradeoff:** Lose precise “Showing 1–20 of N” or replace with estimate.  
**Change:** `{ count: "exact" }` → estimated / optional second query only when user opens “stats.”

### C. Collapse user email + profile updates (harder, higher value)

**Saves:** One Postgres round-trip on every user edit.  
**Requires:** Careful RLS/trigger design so role/active remain protected.  
**Out of band:** Auth Admin call remains.

### D. Reuse admin client when logging after an action that already has one (micro)

Example: `updateUser` already constructed `createAdminClient()` before `recordActivity`, which constructs another.

**Saves:** Client construction only (tiny). Optional overload `recordActivity(input, admin?)`.

### E. Batch logging (not recommended now)

Only relevant if one user action must emit many audit rows. Current design is 1:1 — fine.

### F. Client-side caching of log pages (not for first paint)

Project rules: no TanStack Query for initial Server Component reads. Optional later for back-forward cache feels — low priority.

### G. Debounce already reduces navigation requests

600ms search debounce is already a request-reduction feature. Do not lower it aggressively (wastes server) or raise it too high (feels laggy).

---

## 3. What not to cut

1. **Actor join** — removing it would force N+1 or a second query to resolve names.  
2. **`requireSection` before read** — security.  
3. **Audit/error inserts** — product requirement; cost is one statement.  
4. **Separate Auth Admin vs profile updates** without a redesigned security model.

---

## 4. Expected impact summary

| Change | Statement count | Latency | Risk |
|--------|-----------------|---------|------|
| Trim unused columns | Same | Small win | Very low |
| Estimated count | Same or fewer heavy scans | Medium win at scale | Low (UX) |
| Merge profile email update | −1 Postgres | Medium on user admin | Medium (RLS design) |
| Reuse admin client for log | Same network | Negligible | Very low |
| Remove logging | −1 per mutation | Small | **High product/regression** |

**Conclusion:** Yes — requests/statements can be reduced, but the **highest safe wins** are payload trimming and count strategy on log pages, then revisiting `updateUser`’s multi-write design. Logging itself is not the speed problem.
