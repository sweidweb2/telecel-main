-- Backup export settings: add the "multiple" scope (table_names[]) and allow
-- site_settings + backup_export_settings in exports. Keep the table list in
-- sync with constants/backup-tables.ts.

alter table public.backup_export_settings
  add column table_names text[];

alter table public.backup_export_settings
  drop constraint backup_export_settings_scope_chk,
  drop constraint backup_export_settings_table_name_chk,
  drop constraint backup_export_settings_scope_table_chk;

alter table public.backup_export_settings
  add constraint backup_export_settings_scope_chk
    check (scope in ('all', 'single', 'multiple')),
  add constraint backup_export_settings_table_name_chk check (
    table_name is null
    or table_name in (
      'profiles',
      'blogs',
      'inquiries',
      'audit_log',
      'app_errors',
      'site_settings',
      'backup_export_settings'
    )
  ),
  add constraint backup_export_settings_table_names_chk check (
    table_names is null
    or (
      cardinality(table_names) between 2 and 7
      and table_names <@ array[
        'profiles',
        'blogs',
        'inquiries',
        'audit_log',
        'app_errors',
        'site_settings',
        'backup_export_settings'
      ]::text[]
    )
  ),
  add constraint backup_export_settings_scope_table_chk check (
    (scope = 'all' and table_name is null and table_names is null)
    or (scope = 'single' and table_name is not null and table_names is null)
    or (scope = 'multiple' and table_name is null and table_names is not null)
  );
