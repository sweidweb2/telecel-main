-- Allow admins to manage interest registrations via the session client.
-- Public apply still inserts only through the service-role Server Action.

grant select, update, delete on table public.interest_registrations to authenticated;
grant update, delete on table public.interest_registrations to service_role;

create policy "Admins can read interest registrations"
  on public.interest_registrations
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update interest registrations"
  on public.interest_registrations
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete interest registrations"
  on public.interest_registrations
  for delete
  to authenticated
  using (public.is_admin());
