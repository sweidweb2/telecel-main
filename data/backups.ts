import "server-only";

import { match } from "ts-pattern";

import {
  BACKUP_EXPORT_FORMATS,
  BACKUP_EXPORT_SCOPES,
  isBackupExportTable,
  type BackupExportFormat,
  type BackupExportScope,
  type BackupExportTable,
} from "@/constants/backup-tables";
import type { StaffSession } from "@/data/auth";
import type { BackupExportSetting } from "@/types/backups";

const SETTING_COLUMNS =
  "id, name, scope, table_name, format, created_by, created_at, updated_at, last_exported_at" as const;

type SettingRow = {
  id: string;
  name: string;
  scope: string;
  table_name: string | null;
  format: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_exported_at: string | null;
};

function asScope(value: string): BackupExportScope | null {
  return (BACKUP_EXPORT_SCOPES as readonly string[]).includes(value)
    ? (value as BackupExportScope)
    : null;
}

function asFormat(value: string): BackupExportFormat | null {
  return (BACKUP_EXPORT_FORMATS as readonly string[]).includes(value)
    ? (value as BackupExportFormat)
    : null;
}

function mapSetting(row: SettingRow): BackupExportSetting | null {
  const scope = asScope(row.scope);
  const format = asFormat(row.format);
  if (!scope || !format) return null;

  const tableName = match(scope)
    .with("all", () => null)
    .with("single", () => {
      if (!row.table_name || !isBackupExportTable(row.table_name)) return undefined;
      return row.table_name as BackupExportTable;
    })
    .exhaustive();

  if (tableName === undefined) return null;

  return {
    id: row.id,
    name: row.name,
    scope,
    tableName,
    format,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastExportedAt: row.last_exported_at,
  };
}

/**
 * List saved export settings for the admin Backups page.
 * Caller must already pass requireSection / admin gate; RLS re-checks is_admin.
 */
export async function listBackupExportSettings(
  session: StaffSession,
): Promise<BackupExportSetting[]> {
  const { data, error } = await session.supabase
    .from("backup_export_settings")
    .select(SETTING_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as SettingRow[])
    .map(mapSetting)
    .filter((row): row is BackupExportSetting => row !== null);
}

/**
 * Load one setting by id (session client + RLS).
 */
export async function getBackupExportSetting(
  session: StaffSession,
  id: string,
): Promise<BackupExportSetting | null> {
  const { data, error } = await session.supabase
    .from("backup_export_settings")
    .select(SETTING_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapSetting(data as SettingRow);
}
