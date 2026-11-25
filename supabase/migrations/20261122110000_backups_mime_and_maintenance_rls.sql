-- 1) Manual exports upload JSON and CSV parts to the private backups bucket.
update storage.buckets
set allowed_mime_types = array['application/json', 'text/csv']::text[]
where id = 'backups';

-- 2) Maintenance gate on the remaining staff/self update policies
--    (recreated from 20261027210000_inquiries.sql and
--    20261020090000_baseline_profiles_and_access.sql).
drop policy if exists "Staff can update inquiries" on public.inquiries;
create policy "Staff can update inquiries"
  on public.inquiries for update to authenticated
  using (
    (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  )
  with check (
    (select public.is_staff())
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (
    (select auth.uid()) = id
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  )
  with check (
    (select auth.uid()) = id
    and (not (select public.maintenance_on()) or (select public.is_admin()))
  );
