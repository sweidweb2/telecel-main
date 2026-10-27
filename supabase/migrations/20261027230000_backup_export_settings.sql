-- Admin-saved DB export settings (CSV/JSON). Files are downloaded in the
-- browser; nothing is stored in Storage. Admin CRUD via is_admin() RLS.
-- Table dumps run through the service-role client in actions/backups.ts.

create table public.backup_export_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope text not null,
  table_name text,
  format text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_exported_at timestamptz,
  constraint backup_export_settings_name_len_chk check (
    char_length(name) between 1 and 120
  ),
  constraint backup_export_settings_scope_chk check (scope in ('all', 'single')),
  constraint backup_export_settings_format_chk check (format in ('csv', 'json')),
  constraint backup_export_settings_table_name_chk check (
    table_name is null
    or table_name in (
      'profiles',
      'blogs',
      'inquiries',
      'audit_log',
      'app_errors'
    )
  ),
  constraint backup_export_settings_scope_table_chk check (
    (scope = 'all' and table_name is null)
    or (scope = 'single' and table_name is not null)
  )
);

create index backup_export_settings_created_at_idx
  on public.backup_export_settings (created_at desc);
create index backup_export_settings_created_by_idx
  on public.backup_export_settings (created_by, created_at desc);

create trigger backup_export_settings_set_updated_at
  before update on public.backup_export_settings
  for each row execute function public.set_updated_at();

alter table public.backup_export_settings enable row level security;

grant select, insert, update, delete on table public.backup_export_settings
  to authenticated;
grant select, insert, update, delete on table public.backup_export_settings
  to service_role;

create policy "Admins can read backup_export_settings"
  on public.backup_export_settings for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can insert backup_export_settings"
  on public.backup_export_settings for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update backup_export_settings"
  on public.backup_export_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete backup_export_settings"
  on public.backup_export_settings for delete to authenticated
  using ((select public.is_admin()));
