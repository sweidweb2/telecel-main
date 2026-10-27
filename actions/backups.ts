"use server";

import { revalidatePath } from "next/cache";

import {
  recordActivity,
  unexpectedActionError,
} from "@/actions/observability";
import {
  BACKUP_EXPORT_TABLES,
  type BackupExportTable,
} from "@/constants/backup-tables";
import { ROUTES } from "@/constants/routes";
import { authorizeAction } from "@/data/auth";
import { getBackupExportSetting } from "@/data/backups";
import {
  buildAllTablesFiles,
  buildSingleTableFile,
  type BackupExportFile,
  type BackupRow,
} from "@/lib/backup-export";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createBackupSettingSchema,
  deleteBackupSettingSchema,
  runBackupExportSchema,
  updateBackupSettingSchema,
  type CreateBackupSettingInput,
  type DeleteBackupSettingInput,
  type RunBackupExportInput,
  type UpdateBackupSettingInput,
} from "@/validations/backups";

export type BackupActionResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export type BackupExportResult =
  | { status: "success"; message: string; files: BackupExportFile[] }
  | { status: "error"; message: string };

const PAGE_SIZE = 1000;

function validationMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Check the submitted backup details.";
}

function refreshBackupsRoute() {
  revalidatePath(ROUTES.backups);
}

async function backupUnexpectedError(
  source: string,
  actorId: string,
  error: { code?: string; message?: string },
): Promise<BackupActionResult> {
  return unexpectedActionError({
    source,
    actorId,
    error,
    isExpected: false,
    userMessage: error.message || "The backup operation failed.",
  });
}

async function fetchTableRows(
  tableName: BackupExportTable,
): Promise<BackupRow[]> {
  const admin = createAdminClient();
  const rows: BackupRow[] = [];
  let from = 0;

  for (;;) {
    const to = from + PAGE_SIZE - 1;
    // Full-row dump: select all columns intentionally for admin backups.
    const { data, error } = await admin
      .from(tableName)
      .select("*")
      .range(from, to);

    if (error) throw error;

    const batch = (data ?? []) as BackupRow[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

export async function createBackupSetting(
  input: CreateBackupSettingInput,
): Promise<BackupActionResult> {
  const parsed = createBackupSettingSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  const { data, error } = await auth.session.supabase
    .from("backup_export_settings")
    .insert({
      name: parsed.data.name,
      scope: parsed.data.scope,
      table_name: parsed.data.tableName,
      format: parsed.data.format,
      created_by: auth.session.userId,
    })
    .select("id")
    .single();

  if (error) {
    return backupUnexpectedError(
      "actions.backups.createBackupSetting",
      auth.session.userId,
      error,
    );
  }

  await recordActivity({
    actorId: auth.session.userId,
    action: "create",
    entityType: "backup_export_setting",
    entityId: data.id,
    summary: {
      scope: parsed.data.scope,
      format: parsed.data.format,
      tableName: parsed.data.tableName,
    },
  });

  refreshBackupsRoute();
  return { status: "success", message: "Export setting saved." };
}

export async function updateBackupSetting(
  input: UpdateBackupSettingInput,
): Promise<BackupActionResult> {
  const parsed = updateBackupSettingSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  const { error } = await auth.session.supabase
    .from("backup_export_settings")
    .update({
      name: parsed.data.name,
      scope: parsed.data.scope,
      table_name: parsed.data.tableName,
      format: parsed.data.format,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return backupUnexpectedError(
      "actions.backups.updateBackupSetting",
      auth.session.userId,
      error,
    );
  }

  await recordActivity({
    actorId: auth.session.userId,
    action: "update",
    entityType: "backup_export_setting",
    entityId: parsed.data.id,
    summary: {
      scope: parsed.data.scope,
      format: parsed.data.format,
      tableName: parsed.data.tableName,
    },
  });

  refreshBackupsRoute();
  return { status: "success", message: "Export setting updated." };
}

export async function deleteBackupSetting(
  input: DeleteBackupSettingInput,
): Promise<BackupActionResult> {
  const parsed = deleteBackupSettingSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  const { error } = await auth.session.supabase
    .from("backup_export_settings")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return backupUnexpectedError(
      "actions.backups.deleteBackupSetting",
      auth.session.userId,
      error,
    );
  }

  await recordActivity({
    actorId: auth.session.userId,
    action: "delete",
    entityType: "backup_export_setting",
    entityId: parsed.data.id,
  });

  refreshBackupsRoute();
  return { status: "success", message: "Export setting deleted." };
}

export async function runBackupExport(
  input: RunBackupExportInput,
): Promise<BackupExportResult> {
  const parsed = runBackupExportSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  let setting;
  try {
    setting = await getBackupExportSetting(auth.session, parsed.data.id);
  } catch (error) {
    return unexpectedActionError({
      source: "actions.backups.runBackupExport",
      actorId: auth.session.userId,
      error: error instanceof Error ? error : { message: String(error) },
      isExpected: false,
      userMessage: "Could not load the export setting.",
    });
  }

  if (!setting) {
    return { status: "error", message: "Export setting not found." };
  }

  try {
    const rowCounts: Partial<Record<BackupExportTable, number>> = {};
    let files: BackupExportFile[];

    if (setting.scope === "single") {
      if (!setting.tableName) {
        return {
          status: "error",
          message: "Single-table export is missing a table name.",
        };
      }
      const rows = await fetchTableRows(setting.tableName);
      rowCounts[setting.tableName] = rows.length;
      files = [buildSingleTableFile(setting.tableName, rows, setting.format)];
    } else {
      const tables: Partial<Record<BackupExportTable, BackupRow[]>> = {};
      for (const tableName of BACKUP_EXPORT_TABLES) {
        const rows = await fetchTableRows(tableName);
        tables[tableName] = rows;
        rowCounts[tableName] = rows.length;
      }
      files = buildAllTablesFiles(tables, setting.format);
    }

    const { error: stampError } = await auth.session.supabase
      .from("backup_export_settings")
      .update({ last_exported_at: new Date().toISOString() })
      .eq("id", setting.id);

    if (stampError) {
      return unexpectedActionError({
        source: "actions.backups.runBackupExport",
        actorId: auth.session.userId,
        error: stampError,
        isExpected: false,
        userMessage: "Export built but could not update last-exported time.",
      });
    }

    await recordActivity({
      actorId: auth.session.userId,
      action: "export",
      entityType: "backup_export_setting",
      entityId: setting.id,
      summary: {
        scope: setting.scope,
        format: setting.format,
        tableName: setting.tableName,
        fileCount: files.length,
        rowCounts,
      },
    });

    refreshBackupsRoute();
    return {
      status: "success",
      message:
        files.length === 1
          ? "Download started."
          : `${files.length} downloads started.`,
      files,
    };
  } catch (error) {
    return unexpectedActionError({
      source: "actions.backups.runBackupExport",
      actorId: auth.session.userId,
      error: error instanceof Error ? error : { message: String(error) },
      isExpected: false,
      userMessage: "Could not build the export.",
    });
  }
}
