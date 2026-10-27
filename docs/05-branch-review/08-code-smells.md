# 08 — Code smells related to this branch

**Short answer:** Yes — there are **several mild-to-moderate code smells**, none catastrophic. The dominant smells are **duplication** (activity vs error admin UIs/validations), **fetched-but-unused data**, **large action modules**, and **type-escape hatches** (`as unknown as`). Security and layering smells are largely absent.

**Question as asked:** *“Are there any code smells in the code related to this branch?”*

---

## 1. Smell catalog

### 1.1 Duplicated code (Dry violation) — **Moderate**

**Where:**

- `components/activity-log/activity-log-table.tsx` ↔ `components/error-log/error-log-table.tsx`  
- `app/.../activity-log/page.tsx` ↔ `app/.../error-log/page.tsx`  
- `validations/audit-log.ts` ↔ `validations/app-errors.ts` (`first()`, page size, search rules)  
- `data/audit-log.ts` ↔ `data/app-errors.ts` (pagination skeleton)

**Why it smells:** Twin features shipped together; future fixes will be applied twice or drift.

**Fix direction:** Shared hooks / `AdminFilterTable` / shared `parseListQuery`. Keep domain columns separate.

---

### 1.2 Speculative generality / dead weight in payloads — **Moderate**

**Where:** List selects include `summary`, `context`, `request_id`, and non-rendered `code` while tables do not show them.

**Why it smells:** YAGNI middle ground — data prepared “for later” without a consumer, costing bytes and confusion (“is summary broken or hidden?”).

**Fix direction:** Remove from list query **or** add detail UI in the same change set.

---

### 1.3 Large module / multiple responsibilities — **Moderate**

**Where:** `actions/blogs.ts` (~512 lines) — CRUD + featured + storage + logging.

**Why it smells:** Harder reviews, higher merge conflict rate, observability calls buried among storage logic.

**Fix direction:** `actions/blog-media.ts` (or folder split); keep public action names stable.

---

### 1.4 Type assertion escape hatch — **Low–Moderate**

**Where:**

```ts
rows: (data ?? []) as unknown as ActivityLogRow[]
```

in both `data/audit-log.ts` and `data/app-errors.ts`.

**Why it smells:** Bypass compiler; embed/`profiles` typing friction with Supabase client.

**Fix direction:** Mapper function from DB row → DTO; or generated relationship types when available.

---

### 1.5 Misleading folder signal — **Low**

**Where:** `actions/observability.ts` uses `import "server-only"` but is not a `"use server"` actions entry file.

**Why it smells:** New contributors may think every file under `actions/` is a Server Action boundary.

**Fix direction:** Module docstring (partially covered by rules) or move to `lib/observability/`.

---

### 1.6 Stringly `.or()` filters — **Low** (mitigated)

**Where:** `request.or(\`action.ilike.%${term}%,...\`)`

**Why it smells:** Manual filter DSL is brittle; historically a injection/syntax footgun.

**Mitigation already present:** Zod strips `, % _ ( )`.  
**Fix direction:** Keep validation colocated; add comment linking validation ↔ builder.

---

### 1.7 Magic numbers without shared constants across twins — **Low**

**Where:** `SEARCH_DEBOUNCE_MS = 600` duplicated in both tables; page size `20` duplicated across validations.

**Why it smells:** Twin constants will diverge (e.g. 600 vs 400).

**Fix direction:** `constants/admin-list.ts`.

---

### 1.8 Copy-paste `*UnexpectedError` helpers — **Low**

**Where:** `blogUnexpectedError` vs `userUnexpectedError`.

**Why it smells:** Same control flow with different expected-error predicates.

**Fix direction:** Shared helper with injected `isExpected` predicate.

---

### 1.9 Append-only tables with no lifecycle story in code — **Low (ops smell)**

**Where:** Migration creates indexes and grants but app has no retention job.

**Why it smells:** Operational incomplete feature — works in Phase 1, bitrots in production.

**Fix direction:** Document retention in runbook; add scheduled purge later.

---

### 1.10 Uncommitted mixed with feature narrative — **Process smell**

**Where:** Dirty tree Spinner/Sonner/form polish alongside finished observability commits.

**Why it smells:** Reviewers cannot tell shipped vs WIP; bisect/blame muddies.

**Fix direction:** Separate commit(s) for UI polish.

---

## 2. Smells notably *not* found

1. **Layer violations** (components → Supabase)  
2. **`select('*')`** on new queries  
3. **Logging secrets** at reviewed call sites  
4. **God class** spanning unrelated domains (blogs is large but still “blogs”)  
5. **Commented-out dead code blocks** in the new log feature  
6. **Client `useEffect` data fetching** for initial log lists  
7. **Duplicate writes** of the same event to both tables on failure paths  

---

## 3. Priority to clean up

| Priority | Smell | Effort |
|----------|-------|--------|
| 1 | Unused select fields | Small |
| 2 | Table/validation duplication | Medium |
| 3 | Split blog actions | Medium |
| 4 | Replace `as unknown as` with mapper | Small–medium |
| 5 | Shared debounce/page-size constants | Tiny |
| 6 | Observability module location/comment | Tiny |
| 7 | Retention runbook | Small docs/ops |
| 8 | Commit uncommitted UI separately | Process |

---

## 4. Conclusion

This branch’s code smells are **classic “feature shipped as twins + growing action file”** smells, not architectural rot. Cleaning them up will improve maintainability and slight performance; it is not required to trust the security model. Treat items 1–3 as the practical follow-up backlog after the observability feature.
