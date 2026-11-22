-- Enforce maintenance mode at the data layer: while site_settings.maintenance
-- is {"mode":"full"}, only admins may write blogs or insight images.
-- Non-admin staff keep read access. Admins are unaffected.
--
-- save_blog() is SECURITY INVOKER, so its inserts/updates on public.blogs go
-- through the policies below and are blocked for non-admins as well.
-- Public inquiries are inserted by the service role (no insert policy), so
-- there is nothing to change there.

create or replace function public.maintenance_on()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select s.value ->> 'mode' = 'full'
      from public.site_settings s
      where s.key = 'maintenance'
    ),
    false
  );
$$;

revoke all on function public.maintenance_on() from public;
grant execute on function public.maintenance_on() to anon, authenticated, service_role;

-- Blogs -----------------------------------------------------------------------

drop policy if exists "Staff can insert blogs" on public.blogs;
create policy "Staff can insert blogs"
  on public.blogs for insert
  to authenticated
  with check (
    (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );

drop policy if exists "Staff can update blogs" on public.blogs;
create policy "Staff can update blogs"
  on public.blogs for update
  to authenticated
  using (
    (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  )
  with check (
    (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );

drop policy if exists "Staff can delete blogs" on public.blogs;
create policy "Staff can delete blogs"
  on public.blogs for delete
  to authenticated
  using (
    (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );

-- Insight images (blogs / authors buckets) ------------------------------------

drop policy if exists "Staff can upload insight images" on storage.objects;
create policy "Staff can upload insight images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('blogs', 'authors')
    and (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );

drop policy if exists "Staff can update insight images" on storage.objects;
create policy "Staff can update insight images"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('blogs', 'authors')
    and (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  )
  with check (
    bucket_id in ('blogs', 'authors')
    and (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );

drop policy if exists "Staff can delete insight images" on storage.objects;
create policy "Staff can delete insight images"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('blogs', 'authors')
    and (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );
