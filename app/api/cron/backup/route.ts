import { NextResponse, type NextRequest } from "next/server";

import { recordActivity, recordAppError } from "@/actions/observability";
import { BACKUP_EXPORT_TABLES } from "@/constants/backup-tables";
import { fetchAllTables } from "@/lib/backup-data";
import { buildAllTablesFiles } from "@/lib/backup-export";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  isAuthorizedCronRequest,
  parseRetentionDays,
  SCHEDULED_BACKUP_PREFIX,
  selectExpiredBackups,
} from "@/lib/scheduled-backup";

export const maxDuration = 60;

const SOURCE = "api.cron.backup";

/**
 * Daily scheduled backup (Vercel Cron, see vercel.json). Dumps every
 * allowlisted table to one JSON file in the backup store, then prunes files
 * older than BACKUP_RETENTION_DAYS. Vercel sends `Authorization: Bearer
 * $CRON_SECRET` automatically when CRON_SECRET is set on the project.
 */
export async function GET(request: NextRequest) {
  if (
    !isAuthorizedCronRequest(
      request.headers.get("authorization"),
      process.env.CRON_SECRET,
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getBackupStorage();
  const retentionDays = parseRetentionDays(process.env.BACKUP_RETENTION_DAYS);

  let path: string;
  const rowCounts: Record<string, number> = {};
  try {
    const tables = await fetchAllTables();
    for (const tableName of BACKUP_EXPORT_TABLES) {
      rowCounts[tableName] = tables[tableName]?.length ?? 0;
    }
    const [file] = buildAllTablesFiles(tables, "json");
    path = `${SCHEDULED_BACKUP_PREFIX}/${file.filename}`;
    await storage.upload(path, file.content, "application/json");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await recordAppError({
      severity: "error",
      source: SOURCE,
      message: `Scheduled backup failed: ${message}`,
      context: { storage: storage.name },
    });
    await recordActivity({
      actorId: null,
      action: "export_failed",
      entityType: "scheduled_backup",
      summary: { storage: storage.name, error: message },
    });
    return NextResponse.json(
      { ok: false, error: "Backup failed" },
      { status: 500 },
    );
  }

  let deleted: string[] = [];
  try {
    const existing = await storage.list(SCHEDULED_BACKUP_PREFIX);
    deleted = selectExpiredBackups(existing, retentionDays).map((b) => b.path);
    await storage.remove(deleted);
  } catch (error) {
    // Backup itself succeeded; retention failure is a warning only.
    deleted = [];
    await recordAppError({
      severity: "warning",
      source: SOURCE,
      message: `Backup retention cleanup failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      context: { storage: storage.name, retentionDays },
    });
  }

  await recordActivity({
    actorId: null,
    action: "export",
    entityType: "scheduled_backup",
    entityId: path,
    summary: {
      storage: storage.name,
      rowCounts,
      retentionDays,
      deletedCount: deleted.length,
    },
  });

  return NextResponse.json({ ok: true, path, deleted: deleted.length });
}
