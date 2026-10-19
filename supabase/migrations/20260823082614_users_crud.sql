-- Users CRUD uses public.profiles for application data. Auth user creation and
-- deletion are performed by the server-only Auth Admin API; profile rows are
-- created by handle_new_user() and removed by the auth.users FK cascade.

create extension if not exists pg_trgm with schema extensions;

create index profiles_created_at_id_idx
  on public.profiles (created_at desc, id);

create index profiles_email_trgm_idx
  on public.profiles using gin (email extensions.gin_trgm_ops);

create index profiles_full_name_trgm_idx
  on public.profiles using gin (full_name extensions.gin_trgm_ops);

grant update on table public.profiles to authenticated;

create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public signups must never become administrators by default. Auth Admin user
-- creation can set app_metadata.app_role to one of the supported roles; public
-- clients cannot write app_metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := case new.raw_app_meta_data ->> 'app_role'
    when 'admin' then 'admin'::public.user_role
    when 'editor' then 'editor'::public.user_role
    when 'viewer' then 'viewer'::public.user_role
    else 'viewer'::public.user_role
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    requested_role
  );

  return new;
end;
$$;
