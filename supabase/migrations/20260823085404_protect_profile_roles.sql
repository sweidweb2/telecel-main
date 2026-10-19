-- The own-profile UPDATE policy intentionally lets users maintain their own
-- profile, but it must not let them promote their own role. Admin updates still
-- pass because is_admin() evaluates the authenticated actor.

create or replace function public.prevent_unauthorized_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only administrators can change profile roles'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_unauthorized_profile_role_change()
  from public, anon, authenticated;

create trigger profiles_protect_role
  before update of role on public.profiles
  for each row
  execute function public.prevent_unauthorized_profile_role_change();
