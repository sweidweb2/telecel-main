# Supabase functions, RPCs & triggers

Derived from `supabase/migrations/`. Schema tables live in `Docs/schema.dbml`.

---

## Functions / RPCs

### `public.is_admin()`

| | |
| --- | --- |
| **Role** | RLS / authorization helper |
| **Returns** | `boolean` |
| **Security** | `SECURITY DEFINER`, `STABLE`, `search_path = public` |
| **Granted to** | `authenticated` |

**Details:** Checks whether the current session user (`auth.uid()`) has a `profiles` row with `role = 'admin'`.

**How it works:** Runs a single `EXISTS` query on `public.profiles`. Used by RLS policies so non-admins never see or edit other users’ profiles. Definer + fixed `search_path` avoids search-path hijacking while still reading profiles under elevated rights for the check.

---

### `public.get_user_stats()`

| | |
| --- | --- |
| **Role** | RPC (admin Users page stats) |
| **Returns** | One row: `total`, `admins`, `editors`, `viewers`, `new_this_week`, `new_this_month` (all `bigint`) |
| **Security** | `SECURITY INVOKER`, `STABLE`, `search_path = public` |
| **Granted to** | `authenticated` |

**Details:** Replaces multiple head-count queries with one round-trip for dashboard stats.

**How it works:** Single `SELECT` over `public.profiles` with `COUNT(*)` and filtered counts by role and by `created_at` vs UTC week/month truncations. Invoker means RLS still applies — callers only see counts for rows they can `SELECT` (admins see all; others effectively see their own row).

---

### `public.handle_new_user()`

| | |
| --- | --- |
| **Role** | Trigger function (auth signup → profile) |
| **Returns** | `trigger` |
| **Security** | `SECURITY DEFINER`, `search_path = public` |

**Details:** Creates the matching `public.profiles` row when a row is inserted into `auth.users`.

**How it works:** Reads `raw_app_meta_data.app_role` (`admin` / `editor` / `viewer`); anything else (including public signup) becomes `viewer`. Copies `id`, `email`, and `raw_user_meta_data.full_name`. Public clients cannot write `app_metadata`, so only Admin API–created users can get elevated roles at insert time.

---

### `public.set_profiles_updated_at()`

| | |
| --- | --- |
| **Role** | Trigger function (timestamp maintenance) |
| **Returns** | `trigger` |
| **Security** | Plain `plpgsql` (invoker) |

**Details:** Keeps `profiles.updated_at` accurate on every update.

**How it works:** On `BEFORE UPDATE`, sets `NEW.updated_at = now()` and returns `NEW`.

---

### `public.prevent_unauthorized_profile_role_change()`

| | |
| --- | --- |
| **Role** | Trigger function (authorization / safety) |
| **Returns** | `trigger` |
| **Security** | `SECURITY DEFINER`, `search_path = public` |
| **Execute** | Revoked from `public`, `anon`, `authenticated` (trigger-only) |

**Details:** Stops non-admins from promoting or changing their own `role` via the own-profile UPDATE policy.

**How it works:** On `BEFORE UPDATE OF role`, if `NEW.role` differs from `OLD.role` and `is_admin()` is false, raises SQLSTATE `42501`. Admins pass because `is_admin()` evaluates the authenticated actor.

---

## Triggers

### `on_auth_user_created`

| | |
| --- | --- |
| **Role** | Auth → profile provisioning |
| **Table** | `auth.users` |
| **Timing** | `AFTER INSERT`, `FOR EACH ROW` |
| **Calls** | `public.handle_new_user()` |

**How it works:** Every new auth user gets a linked `profiles` row automatically (role from `app_metadata.app_role` or default `viewer`).

---

### `profiles_set_updated_at`

| | |
| --- | --- |
| **Role** | Column maintenance |
| **Table** | `public.profiles` |
| **Timing** | `BEFORE UPDATE`, `FOR EACH ROW` |
| **Calls** | `public.set_profiles_updated_at()` |

**How it works:** Refreshes `updated_at` before the row is written.

---

### `profiles_protect_role`

| | |
| --- | --- |
| **Role** | Privilege escalation guard |
| **Table** | `public.profiles` |
| **Timing** | `BEFORE UPDATE OF role`, `FOR EACH ROW` |
| **Calls** | `public.prevent_unauthorized_profile_role_change()` |

**How it works:** Blocks role column changes unless the current user is an admin, even when the own-profile UPDATE policy would otherwise allow the row update.

---

## Tables without functions / triggers

### `public.interest_registrations`

No RPCs, functions, or triggers. Public rows are inserted from a Server Action via the service-role client after Zod validation, Cloudflare Turnstile siteverify (`action=apply`), and in-memory rate limits (hits recorded only after a successful insert). Admins list/update/delete via the session client under `is_admin()` RLS policies.

### `public.contact_messages`

No RPCs, functions, or triggers. Public rows are inserted from a Server Action via the service-role client after Zod validation, Cloudflare Turnstile siteverify (`action=contact`), and in-memory rate limits (hits recorded only after a successful insert). Admins list/update/delete via the session client under `is_admin()` RLS policies. Length CHECKs mirror the Zod schema; there is no unique constraint on email/subject (follow-ups allowed).

### `public.blogs`

| Field | Value |
| --- | --- |
| **Name** | `public.set_blogs_updated_at` |
| **Kind** | Trigger function |
| **Role** | Invoked by trigger only |
| **Details** | Sets `updated_at = now()` on every UPDATE |

| Field | Value |
| --- | --- |
| **Name** | `public.blogs_set_updated_at` |
| **Kind** | Trigger |
| **Table** | `public.blogs` |
| **Timing** | `BEFORE UPDATE`, `FOR EACH ROW` |
| **Calls** | `public.set_blogs_updated_at()` |

**How it works:** Keeps `updated_at` current. Published rows are readable by anon/authenticated via RLS; admins CRUD via `is_admin()`. Cover images live in Storage bucket `blogs`; author avatars in `auther`. Featured exclusivity is enforced by a partial unique index plus app-level clear-on-feature.