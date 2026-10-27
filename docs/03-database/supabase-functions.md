# Supabase functions, RPCs, and triggers

Companion to `schema.dbml` and `supabase/migrations/`. Update this file whenever a migration adds or changes a function, RPC, procedure, or trigger.

The observability migration (`20261027120000_audit_and_app_errors`) adds **tables and RLS only** — it reuses existing `is_admin()` and introduces **no new RPCs**.

## Role / session helpers

| Name | Role | Details |
| --- | --- | --- |
| `current_session_is_fresh()` | `security definer` SQL | True when the Auth session is within the 24h window (`auth.sessions.created_at`). |
| `current_app_role()` | `security definer` SQL | Active profile role for `auth.uid()` only if the session is fresh; else null. |
| `is_admin()` | `security definer` SQL | `current_app_role() = 'admin'`. Used by admin-only RLS (profiles admin policies, `audit_log`, `app_errors`). |
| `is_staff()` | `security definer` SQL | Any non-null `current_app_role()` (admin or editor). Used by CMS/blog staff policies. |
| `get_session_context()` | `security definer` SQL | One round trip for `data/auth.ts`: `user_id`, `role`, `is_active`, `session_fresh`. |

Granted to `authenticated` only (revoked from `public` / `anon`).

## Profile lifecycle

| Name | Role | Details |
| --- | --- | --- |
| `handle_new_user()` | trigger on `auth.users` INSERT | Creates `profiles` row; default role `editor` unless `app_metadata.app_role = admin`. |
| `protect_profile_access_fields()` | BEFORE UPDATE on `profiles` | Non-admins (and non-service-role) cannot change `role` / `is_active`; email changes blocked except service role. |

## Stats / utilities

| Name | Role | Details |
| --- | --- | --- |
| `get_user_stats()` | `security invoker` SQL RPC | Aggregates for the users portal (totals, roles, new this week/month). Execute granted to `authenticated`; RLS still applies. |
| `set_updated_at()` | trigger helper | Sets `blogs.updated_at = now()` on UPDATE. |

## How it works (access path)

1. Client/session hits PostgREST or a Server Component via the user-scoped Supabase client.
2. RLS policies call `(select public.is_admin())` or `(select public.is_staff())` so role + 24h freshness are enforced in the database, not only in Next middleware.
3. Service-role inserts (e.g. `actions/observability.ts`) bypass RLS by design; never expose that client to the browser.
