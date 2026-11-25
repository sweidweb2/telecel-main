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
import { iterateTablePages } from "@/lib/backup-data";
import { rowsToCsv, type BackupRow } from "@/lib/backup-export";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  buildRunStamp,
  createTablePartWriter,
  manualExportFolder,
  manualPartFilename,
} from "@/lib/scheduled-backup";
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

/** Short-lived signed URL for one uploaded export file. */
export type BackupDownload = { filename: string; url: string };

const MANUAL_EXPORT_URL_TTL_SECONDS = 300;
const JSON_MIME_TYPE = "application/json;charset=utf-8";
const CSV_MIME_TYPE = "text/csv;charset=utf-8";

export type BackupExportResult =
  | { status: "success"; message: string; downloads: BackupDownload[] }
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
    let tablesToExport: readonly BackupExportTable[];
    if (setting.scope === "single") {
      if (!setting.tableName) {
        return {
          status: "error",
          message: "Single-table export is missing a table name.",
        };
      }
      tablesToExport = [setting.tableName];
    } else {
      tablesToExport =
        setting.scope === "multiple"
          ? setting.tableNames
          : BACKUP_EXPORT_TABLES;
    }

    // Stream each table into compact per-table part files under
    // manual/<stamp>/ (pruned after 7 days by the backup cron) and hand back
    // one signed URL per part instead of building whole files in memory.
    const storage = getBackupStorage();
    const stamp = buildRunStamp();
    const folder = manualExportFolder(stamp);
    const runId = crypto.randomUUID().slice(0, 8);
    const format = setting.format;
    const contentType = (
      format === "csv" ? CSV_MIME_TYPE : JSON_MIME_TYPE
    ).split(";")[0];
    const downloads: BackupDownload[] = [];

    for (const tableName of tablesToExport) {
      const writer = createTablePartWriter({
        stamp,
        table: tableName,
        pathFor: (part) =>
          `${folder}/${runId}_${manualPartFilename(tableName, part, format)}`,
        serialize:
          format === "csv"
            ? (rows) => rowsToCsv(rows as BackupRow[])
            : undefined,
        upload: (path, content) => storage.upload(path, content, contentType),
      });
      for await (const batch of iterateTablePages(tableName)) {
        await writer.write(batch);
      }
      const parts = await writer.finish();
      rowCounts[tableName] = parts.reduce((sum, part) => sum + part.rows, 0);
      for (const [index, part] of parts.entries()) {
        const filename = manualPartFilename(tableName, index + 1, format);
        downloads.push({
          filename,
          url: await storage.signedUrl(
            part.path,
            MANUAL_EXPORT_URL_TTL_SECONDS,
            filename,
          ),
        });
      }
    }
    const files = downloads;

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
        folder,
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
      downloads,
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
