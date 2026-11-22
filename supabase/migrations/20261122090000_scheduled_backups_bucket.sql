-- Private bucket for scheduled (cron) backups written by app/api/cron/backup.
-- No storage.objects policies on purpose: only the service-role client
-- (cron route, admin-gated dashboard signed URLs) can read or write.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('backups', 'backups', false, 52428800, array['application/json']::text[])
on conflict (id) do nothing;
