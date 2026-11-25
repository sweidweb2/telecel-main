/** Tables admins may dump from /dashboard/backups. Keep in sync with the DB check. */
export const BACKUP_EXPORT_TABLES = [
  "profiles",
  "blogs",
  "inquiries",
  "audit_log",
  "app_errors",
  "site_settings",
  "backup_export_settings",
] as const;

export type BackupExportTable = (typeof BACKUP_EXPORT_TABLES)[number];

/**
 * Primary-key column per exportable table (see supabase/migrations). Backups
 * use keyset pagination ordered by this column so rows are never skipped or
 * duplicated while the table changes mid-export.
 */
export const BACKUP_TABLE_PRIMARY_KEYS: Record<BackupExportTable, string> = {
  profiles: "id",
  blogs: "id",
  inquiries: "id",
  audit_log: "id",
  app_errors: "id",
  site_settings: "key",
  backup_export_settings: "id",
};

export const BACKUP_EXPORT_FORMATS = ["csv", "json"] as const;
export type BackupExportFormat = (typeof BACKUP_EXPORT_FORMATS)[number];

export const BACKUP_EXPORT_SCOPES = ["all", "single", "multiple"] as const;
export type BackupExportScope = (typeof BACKUP_EXPORT_SCOPES)[number];

export const BACKUP_TABLE_LABELS: Record<BackupExportTable, string> = {
  profiles: "Profiles",
  blogs: "Blogs",
  inquiries: "Inquiries",
  audit_log: "Activity log",
  app_errors: "Error log",
  site_settings: "Site settings",
  backup_export_settings: "Export settings",
};

export function isBackupExportTable(value: string): value is BackupExportTable {
  return (BACKUP_EXPORT_TABLES as readonly string[]).includes(value);
}
