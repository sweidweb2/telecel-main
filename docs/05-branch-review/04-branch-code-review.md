# 04 — Code review (local branch only)

**Short answer:** The observability work on local `main` is **merge-quality**: layered correctly, tested (Vitest + Playwright), RLS-hardened, and aligned with `.cursor/rules/observability.mdc`. Review findings are mostly **maintainability and polish** (DRY UI, unused fields, dense actions), plus awareness of **uncommitted** Spinner/Sonner UI changes sitting on top of the same branch.

**Question as asked:** *“Code reviews, scope to the local branch only.”*

---

## 1. Review scope (explicit)

### Included

1. Commits `07ce2e0` … `2d6c464` on local `main` (~30 files, ~+1599 / −51).  
2. Uncommitted working-tree changes touching:
   - `components/ui/spinner.tsx` (new)  
   - `components/ui/sonner.tsx`, `app/globals.css`  
   - Auth forms, blog editor, user dialogs/filters, activity/error tables  
   - Minor docs README / foundation-plan edits  
3. Related migration, types, validations, e2e, cursor rule.

### Excluded

1. Pre-observability foundation history.  
2. Other remotes / feature branches.  
3. Marketing route redesigns unrelated to this series.

**Note:** Local branch name is `main` and tracks `origin/main` for commits; “local branch only” here means **this checkout’s observability series + dirty tree**, not “unpushed commits only.”

---

## 2. What shipped (commit narrative)

1. `07ce2e0` — `audit_log` + `app_errors` tables, RLS, indexes, grants.  
2. `3f96483` — `recordActivity` / `recordAppError` helpers + scrubbing.  
3. `9e135bc` — dashboard nav items (admin).  
4. `457584b` / `42f9aa4` / `6e50ce9` — wire blogs, users, auth.  
5. `c3ab6b4` / `e95ae8f` — admin Activity / Error log pages + tables.  
6. `f1e0237` / `d68bf9c` — adjacent UI/nav polish.  
7. `2977d0f` — observability rules/docs.  
8. `2d6c464` — unit tests + admin access denial coverage.

---

## 3. Strengths

1. **Layering matches project architecture** — pages do not touch Supabase; components do not import clients; writes vs reads split.  
2. **Security model is coherent** — service-role insert only; authenticated SELECT gated by `is_admin()`; no UPDATE/DELETE grants (append-only).  
3. **Helpers never break primary actions** — try/catch + `console.error` on log failure.  
4. **Secret scrubbing** — `SECRET_KEY_PATTERN` + key/value bounds in `scrubContext`.  
5. **Noise control** — expected validation / auth / authorize denials are not logged (per rules and call-site filters).  
6. **Narrow selects + actor join** — good data-layer hygiene.  
7. **Search input sanitized** — rejects characters that break PostgREST `.or()` filters.  
8. **Tests exist at unit and e2e levels** — including editor denied access to admin log routes.  
9. **Loading / error UX conventions** — `loading.tsx` + RouteSkeleton present for both log routes.

---

## 4. Findings (severity-ordered)

### High — none for this scope

No shipping blockers found in the branch-scoped review (authz, RLS, secret handling, architecture violations).

### Medium

1. **Unused selected fields on list pages**  
   - `summary`, `context`, `request_id` (and non-displayed `code`) inflate payloads.  
   - **Ask:** Trim now or add detail UI in a follow-up.

2. **High UI duplication between activity and error tables**  
   - Twin implementations will drift (already slightly different line counts / filters).  
   - **Ask:** Extract shared shell when touching either file next.

3. **`actions/blogs.ts` continues to accumulate concerns**  
   - Observability wiring is correct but adds to an already large module.  
   - **Ask:** Split media vs CRUD in a dedicated refactor PR (not mixed with feature work).

### Low

4. **`actions/observability.ts` naming location**  
   - Lives under `actions/` with `import "server-only"` but without `"use server"`. Correct, but easy to misread as a Server Action entry.  
   - **Ask:** Optional move to `lib/observability/` or add a one-line module comment (already partly documented in rules).

5. **`as unknown as ActivityLogRow` / `ErrorLogRow` casts** in data getters  
   - Common with Supabase embed typing; still a smell.  
   - **Ask:** Tighten types when regenerating or via helper mappers.

6. **Docs companion**  
   - `schema.dbml` updated; `Docs/supabase-functions.md` still missing as a project convention file (no new functions in this migration).  
   - **Ask:** Add stub documenting `is_admin()` or note N/A in PR template.

7. **Uncommitted UI should be reviewed/landed separately or with clear intent**  
   - Spinner/Sonner theming is good consistency work but is not part of the observability commits.  
   - **Ask:** Commit as `feat(ui): …` so review blame stays clean.

---

## 5. Checklist (branch review)

- [x] Architecture directionality respected  
- [x] RLS enabled in same migration as tables  
- [x] No secrets in logged context (pattern + tests)  
- [x] Admin-only UI + data gate + RLS (defense in depth)  
- [x] Vitest for helpers / parsers / access denial  
- [x] Playwright for admin UI + editor denial + write→audit path  
- [ ] Shared log table abstraction (optional follow-up)  
- [ ] Trim or display JSON detail fields (decide)  
- [ ] Land or discard uncommitted Spinner/Sonner changes deliberately  
- [ ] Retention/archival story for append-only tables (ops follow-up)

---

## 6. Reviewer recommendation

**Approve the observability feature as implemented.** Track Medium items as follow-up issues. Treat uncommitted UI as a separate small change set before or after this review narrative so “branch code” stays attributable.
