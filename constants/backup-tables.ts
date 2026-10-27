/** Tables admins may dump from /dashboard/backups. Keep in sync with the DB check. */
export const BACKUP_EXPORT_TABLES = [
  "profiles",
  "blogs",
  "inquiries",
  "audit_log",
  "app_errors",
] as const;

export type BackupExportTable = (typeof BACKUP_EXPORT_TABLES)[number];

export const BACKUP_EXPORT_FORMATS = ["csv", "json"] as const;
export type BackupExportFormat = (typeof BACKUP_EXPORT_FORMATS)[number];

export const BACKUP_EXPORT_SCOPES = ["all", "single"] as const;
export type BackupExportScope = (typeof BACKUP_EXPORT_SCOPES)[number];

export const BACKUP_TABLE_LABELS: Record<BackupExportTable, string> = {
  profiles: "Profiles",
  blogs: "Blogs",
  inquiries: "Inquiries",
  audit_log: "Activity log",
  app_errors: "Error log",
};

export function isBackupExportTable(value: string): value is BackupExportTable {
  return (BACKUP_EXPORT_TABLES as readonly string[]).includes(value);
}
