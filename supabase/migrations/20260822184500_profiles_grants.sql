-- Expose profiles to the Data API roles (project does not auto-expose new tables).

grant usage on schema public to anon, authenticated, service_role;

grant select, update on table public.profiles to authenticated;
grant select on table public.profiles to service_role;

grant execute on function public.is_admin() to authenticated;
