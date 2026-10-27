# 05 — Security (and related performance) problems — broader view

**Short answer:** No **critical** security defects found in this branch’s observability design. Defense in depth is strong (service-role writes, admin-only RLS, app-level `requireSection`, context scrubbing, search sanitization). A broader view still surfaces **residual risks** — mostly about data sensitivity in summaries, retention, search-filter construction, and the performance side-effects of append-only growth — plus unrelated but adjacent mutation paths that already use the admin client.

**Question as asked:** *“Are there any security performance problems using a broader view?”*  
Interpreted as: security issues and security-adjacent performance issues, viewed beyond a single file.

---

## 1. Security controls already in place (baseline)

1. **Inserts bypass user JWT on purpose**  
   - `recordActivity` / `recordAppError` use `createAdminClient()`.  
   - Authenticated role has **SELECT only**; no INSERT policy for `authenticated`.  
   - Clients cannot forge audit/error rows via PostgREST.

2. **Reads are admin-only at two layers**  
   - App: `requireSection` / nav `minRole: "admin"`.  
   - DB: RLS `using ((select public.is_admin()))`.  
   - E2E covers editor denial (empty data / blocked UI).

3. **Append-only privilege model**  
   - No UPDATE/DELETE grants to `authenticated` or even broad service mutations in the migration (service_role gets SELECT, INSERT only on these tables).  
   - Tampering with historical rows is hard without elevated ops access.

4. **Context scrubbing**  
   - Keys matching password/secret/token/authorization/cookie/api key/recovery/reset link/service role are dropped.  
   - String length and key count bounded.

5. **Message truncation**  
   - Prevents huge payloads from being stored as “errors.”

6. **Search sanitization**  
   - Zod rejects `,` `%` `_` `(` `)` which are meaningful in PostgREST `.or()` / `ilike` patterns — reduces filter-injection style breakage.

7. **Auth anti-enumeration preserved**  
   - Password reset still returns generic success while logging unexpected provider failures server-side.

---

## 2. Residual security findings (broader view)

### 2.1 Summary / context may still hold sensitive business data

- Scrubbing is **key-name based**, not content-based.  
- A caller could still log PII under innocuous keys (`email` is intentionally logged on user activity; `note`, `body`, `raw` would not be scrubbed by name).  
- **Risk:** Admin-only today, but still a confidentiality boundary inside the org; backups and support exports inherit it.

**Recommendations:**

1. Keep call-site discipline (rules already say “small safe summary”).  
2. Consider an allowlist for `summary` keys per `entityType` if logs expand.  
3. Never pass request bodies or form objects wholesale into `context`.

### 2.2 `.or(\`…ilike.%${term}%\`)` string building

- Mitigated by Zod character class, but remains a careful surface.  
- If a future refactor weakens validation, filter injection / syntax errors return.

**Recommendations:**

1. Keep validation next to the only builders (`data/audit-log.ts`, `data/app-errors.ts`).  
2. Prefer parameterized filters if the Supabase client API offers safer helpers later.  
3. Add a regression test that rejects forbidden search characters (likely already in validations tests — keep them).

### 2.3 Service-role surface area

- Observability correctly uses admin client.  
- Broader view: `actions/users.ts` also uses admin for Auth Admin APIs and email mirror updates — necessary, but high privilege.  
- A bug in any admin-using action is higher impact than a user-scoped action.

**Recommendations:**

1. Keep admin imports only in `actions/` / server-only modules (already true).  
2. Continue returning generic messages to clients; log details server-side only.

### 2.4 Error messages stored in `app_errors.message`

- Provider error strings may occasionally include emails, URLs, or internal hints.  
- Truncation limits size, not sensitivity.  
- **Risk:** Low (admin-only), but worth scrubbing known patterns if Auth messages prove noisy/sensitive.

### 2.5 Missing retention = longer exposure window

- Append-only without purge means a compromised admin account can read **all historical** activity/errors.  
- Broader security+performance coupling: larger tables, richer blast radius.

**Recommendation:** Document retention; implement scheduled delete/archive with service role.

### 2.6 No INSERT policy for users is good — ensure it stays that way

- Future “client logging” features must not add authenticated INSERT policies without strong validation and rate limits.  
- Prefer server actions + scrubbing over browser→table writes.

### 2.7 Role checks depend on `is_admin()` correctness

- Both policies call `(select public.is_admin())`.  
- Broader system risk: if `is_admin()` is wrong, **all** admin tables fail open or closed together.  
- Not introduced by this branch, but this branch increases reliance on it.

**Recommendation:** Keep `is_admin()` covered by SQL/e2e tests whenever roles change.

---

## 3. Security-adjacent performance problems

These are listed here because they affect **availability** and **cost**, which are part of a broad security posture (DoS / resource exhaustion).

1. **Unbounded log growth** — storage, backup, index bloat; slower admin queries.  
2. **Expensive admin searches** — `ilike '%x%'` + exact count can become a cheap DoS against the DB if an admin account is abused or scripted.  
   - Mitigations: rate-limit dashboard routes (edge/middleware) if needed; keep page size fixed (already); consider stricter search rate.  
3. **Large JSON in `context`/`summary`** — bounded by scrubber, but list selects still pull JSON every page load → unnecessary bandwidth (see report 03 / 06).  
4. **Sequential admin Auth calls** — not a vuln, but amplify latency under load for user admin operations.

---

## 4. What is *not* a problem (explicit non-findings)

1. Components calling Supabase directly — **not found**.  
2. Logging passwords / recovery links in reviewed call sites — **not found**.  
3. Dual-writing the same failure to activity + errors — call sites follow “failure → error only.”  
4. Public access to log pages — gated; e2e for editors.  
5. `select('*')` on log tables — not used.

---

## 5. Priority actions

| Priority | Item |
|----------|------|
| Keep | Current RLS + service-role insert + scrubbing model |
| Soon | Decide retention for `app_errors` / `audit_log` |
| Soon | Trim list selects or gate JSON behind detail fetch |
| Later | Allowlist summary keys; optional rate limits on admin search |
| Monitor | Content of Auth/provider messages written to `app_errors` |

**Conclusion:** Broader view does **not** reveal a security meltdown; it reveals **good foundations** and **operational follow-through** (retention, payload hygiene, continued discipline at call sites) as the main remaining work.
