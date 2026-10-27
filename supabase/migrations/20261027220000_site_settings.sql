-- Site-wide key/value settings. First key: maintenance Level 1 / Level 2.
-- Public (anon) may read whitelisted keys; only admins write.

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint site_settings_key_len_chk check (char_length(key) between 1 and 64)
);

alter table public.site_settings enable row level security;

grant select on table public.site_settings to anon, authenticated;
grant select, insert, update on table public.site_settings to service_role;

-- Whitelist public-readable keys (start with maintenance). Expand later for
-- analytics / footer once those settings ship.
create policy "Anyone can read whitelisted site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (key in ('maintenance'));

create policy "Admins can insert site_settings"
  on public.site_settings for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update site_settings"
  on public.site_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

insert into public.site_settings (key, value)
values ('maintenance', '{"level1": false, "level2": false}'::jsonb);
