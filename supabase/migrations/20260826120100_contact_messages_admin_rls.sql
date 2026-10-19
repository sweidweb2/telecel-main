-- Allow admins to manage contact messages via the session client.
-- Public contact still inserts only through the service-role Server Action.

grant select, update, delete on table public.contact_messages to authenticated;
grant update, delete on table public.contact_messages to service_role;

create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using (public.is_admin());
