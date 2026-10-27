-- Baseline for Telecel Global (fresh start; no prior Telecel migration history).
--
-- Access model
-- - CMS is invite-only. Admins create users through the Auth Admin API and set
--   app_metadata.app_role; public signups are disabled in Auth settings.
-- - profiles.role is authoritative after creation. NULL role = no CMS access.
-- - Every staff check also requires an active profile and a session younger
--   than 24 hours, so the absolute session timeout holds for direct Supabase
--   API calls too, not only for requests that pass through the Next.js proxy.

create extension if not exists pg_trgm with schema extensions;

create type public.user_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.user_role,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index profiles_created_at_id_idx on public.profiles (created_at desc, id);
create index profiles_email_trgm_idx
  on public.profiles using gin (email extensions.gin_trgm_ops);
create index profiles_full_name_trgm_idx
  on public.profiles using gin (full_name extensions.gin_trgm_ops);

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Session + role helpers (security definer: they read auth.sessions and
-- profiles without recursing through profiles RLS).
-- ---------------------------------------------------------------------------

-- Absolute session lifetime. auth.sessions.created_at is fixed when the user
-- signs in and does not move on refresh-token rotation (unlike JWT iat/amr).
create or replace function public.current_session_is_fresh()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select s.created_at > now() - interval '24 hours'
      from auth.sessions s
      where s.id = nullif(auth.jwt() ->> 'session_id', '')::uuid
        and s.user_id = auth.uid()
    ),
    false
  );
$$;

-- Role of the caller, or NULL when they have no active CMS access.
create or replace function public.current_app_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active
    and public.current_session_is_fresh();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_app_role() = 'admin', false);
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_app_role() is not null;
$$;

-- One round trip for server-side guards in data/auth.ts.
create or replace function public.get_session_context()
returns table (
  user_id uuid,
  role public.user_role,
  is_active boolean,
  session_fresh boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid(),
    p.role,
    coalesce(p.is_active, false),
    public.current_session_is_fresh()
  from (select 1) as one
  left join public.profiles p on p.id = auth.uid();
$$;

revoke all on function public.current_session_is_fresh() from public, anon;
revoke all on function public.current_app_role() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_staff() from public, anon;
revoke all on function public.get_session_context() from public, anon;
grant execute on function public.current_session_is_fresh() to authenticated;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.get_session_context() to authenticated;

-- ---------------------------------------------------------------------------
-- Profiles RLS
-- ---------------------------------------------------------------------------

create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Admins can read all profiles"
  on public.profiles for select to authenticated
  using ((select public.is_admin()));

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Admins can update all profiles"
  on public.profiles for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant usage on schema public to anon, authenticated, service_role;
grant select, update on table public.profiles to authenticated;
grant select, update on table public.profiles to service_role;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Role comes only from app_metadata (writable by the Auth Admin API, never by
-- the user). Anything else, including OAuth sign-ins, gets no CMS access.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    ),
    case new.raw_app_meta_data ->> 'app_role'
      when 'admin' then 'admin'::public.user_role
      when 'editor' then 'editor'::public.user_role
      else null
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may edit their own name, never their role or active flag. The service
-- role (Auth Admin API / server actions using the admin client) is exempt.
create or replace function public.protect_profile_access_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role is distinct from old.role or new.is_active is distinct from old.is_active)
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_admin() then
    raise exception 'Only administrators can change roles or account status'
      using errcode = '42501';
  end if;

  if new.email is distinct from old.email
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Email is managed by Auth'
      using errcode = '42501';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.protect_profile_access_fields() from public, anon, authenticated;

create trigger profiles_protect_access_fields
  before update on public.profiles
  for each row execute function public.protect_profile_access_fields();

-- ---------------------------------------------------------------------------
-- Users portal stats (one round trip)
-- ---------------------------------------------------------------------------

create or replace function public.get_user_stats()
returns table (
  total bigint,
  admins bigint,
  editors bigint,
  no_access bigint,
  new_this_week bigint,
  new_this_month bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    count(*)::bigint,
    count(*) filter (where role = 'admin')::bigint,
    count(*) filter (where role = 'editor')::bigint,
    count(*) filter (where role is null or not is_active)::bigint,
    count(*) filter (
      where created_at >= date_trunc('week', timezone('utc', now()))
    )::bigint,
    count(*) filter (
      where created_at >= date_trunc('month', timezone('utc', now()))
    )::bigint
  from public.profiles;
$$;

revoke all on function public.get_user_stats() from public, anon;
grant execute on function public.get_user_stats() to authenticated;
