"use server";

import { revalidatePath } from "next/cache";

import {
  recordActivity,
  recordAppError,
  unexpectedActionError,
} from "@/actions/observability";
import { ACTION_GENERIC_ERROR } from "@/constants/action-messages";
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
} from "@/lib/backup-export";
import { fetchAllTables, fetchTableRows } from "@/lib/backup-data";
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
  { status: "success"; message: string } | { status: "error"; message: string };

export type BackupExportResult =
  | { status: "success"; message: string; files: BackupExportFile[] }
  | { status: "error"; message: string };

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
    userMessage: ACTION_GENERIC_ERROR,
  });
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
      table_names: parsed.data.tableNames,
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
      tableNames: parsed.data.tableNames,
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
      table_names: parsed.data.tableNames,
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
      tableNames: parsed.data.tableNames,
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
      const selected =
        setting.scope === "multiple"
          ? setting.tableNames
          : BACKUP_EXPORT_TABLES;
      const tables = await fetchAllTables(selected);
      for (const tableName of selected) {
        rowCounts[tableName] = tables[tableName]?.length ?? 0;
      }
      files = buildAllTablesFiles(tables, setting.format);
    }

    const { error: stampError } = await auth.session.supabase
      .from("backup_export_settings")
      .update({ last_exported_at: new Date().toISOString() })
      .eq("id", setting.id);

    if (stampError) {
      // The export itself succeeded; log and still hand the files back.
      await recordAppError({
        severity: "warning",
        source: "actions.backups.runBackupExport",
        code: stampError.code ?? null,
        message: `Could not update last_exported_at: ${stampError.message}`,
        actorId: auth.session.userId,
        context: { settingId: setting.id },
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
        tableNames: setting.tableNames,
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
