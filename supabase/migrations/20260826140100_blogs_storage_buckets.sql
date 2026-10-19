-- Public-read storage buckets for blog covers and author avatars.
-- Bucket ids match the plan: blogs + auther.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'blogs',
    'blogs',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'auther',
    'auther',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  )
on conflict (id) do nothing;

-- Public read
create policy "Public can read blog covers"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blogs');

create policy "Public can read author avatars"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'auther');

-- Admin write
create policy "Admins can upload blog covers"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blogs' and public.is_admin());

create policy "Admins can update blog covers"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blogs' and public.is_admin())
  with check (bucket_id = 'blogs' and public.is_admin());

create policy "Admins can delete blog covers"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blogs' and public.is_admin());

create policy "Admins can upload author avatars"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'auther' and public.is_admin());

create policy "Admins can update author avatars"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'auther' and public.is_admin())
  with check (bucket_id = 'auther' and public.is_admin());

create policy "Admins can delete author avatars"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'auther' and public.is_admin());
