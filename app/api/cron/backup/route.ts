import { NextResponse, type NextRequest } from "next/server";

import { recordActivity, recordAppError } from "@/actions/observability";
import { BACKUP_EXPORT_TABLES } from "@/constants/backup-tables";
import { fetchTableRows } from "@/lib/backup-data";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  buildRunStamp,
  isAuthorizedCronRequest,
  parseRetentionDays,
  runFolderPath,
  runManifestPath,
  runTablePath,
  SCHEDULED_BACKUP_PREFIX,
  selectExpiredBackups,
  selectExpiredRuns,
  toCompactJson,
} from "@/lib/scheduled-backup";

// Large tables are fetched and uploaded one by one; allow up to 5 minutes.
export const maxDuration = 300;

const SOURCE = "api.cron.backup";
const JSON_TYPE = "application/json";

/**
 * Daily scheduled backup (Vercel Cron, see vercel.json). Writes one compact
 * JSON file per allowlisted table under `scheduled/<stamp>/<table>.json`,
 * then `manifest.json` last (a run without a manifest is incomplete), and
 * prunes run folders (plus legacy single files) older than
 * BACKUP_RETENTION_DAYS. Vercel sends `Authorization: Bearer $CRON_SECRET`
 * automatically when CRON_SECRET is set on the project.
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
  const startedAt = new Date();
  const stamp = buildRunStamp(startedAt);
  const folder = runFolderPath(stamp);

  const rowCounts: Record<string, number> = {};
  try {
    const tables: Record<
      string,
      { path: string; rows: number; bytes: number }
    > = {};
    // Sequential: keeps only one table in memory at a time.
    for (const tableName of BACKUP_EXPORT_TABLES) {
      const rows = await fetchTableRows(tableName);
      const content = toCompactJson(rows);
      const path = runTablePath(stamp, tableName);
      await storage.upload(path, content, JSON_TYPE);
      rowCounts[tableName] = rows.length;
      tables[tableName] = {
        path,
        rows: rows.length,
        bytes: new TextEncoder().encode(content).length,
      };
    }
    await storage.upload(
      runManifestPath(stamp),
      toCompactJson({
        version: 1,
        stamp,
        startedAt: startedAt.toISOString(),
        completedAt: new Date().toISOString(),
        storage: storage.name,
        tables,
      }),
      JSON_TYPE,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await recordAppError({
      severity: "error",
      source: SOURCE,
      message: `Scheduled backup failed: ${message}`,
      context: { storage: storage.name, folder },
    });
    await recordActivity({
      actorId: null,
      action: "export_failed",
      entityType: "scheduled_backup",
      entityId: folder,
      summary: { storage: storage.name, error: message },
    });
    return NextResponse.json(
      { ok: false, error: "Backup failed" },
      { status: 500 },
    );
  }

  let deletedRuns = 0;
  let deletedLegacy = 0;
  try {
    // Legacy single-file backups directly under scheduled/.
    const legacy = selectExpiredBackups(
      await storage.list(SCHEDULED_BACKUP_PREFIX),
      retentionDays,
      startedAt,
    ).map((b) => b.path);
    await storage.remove(legacy);
    deletedLegacy = legacy.length;

    // Whole run folders.
    const expiredRuns = selectExpiredRuns(
      await storage.listFolders(SCHEDULED_BACKUP_PREFIX),
      retentionDays,
      startedAt,
    );
    for (const run of expiredRuns) {
      const files = await storage.list(runFolderPath(run));
      await storage.remove(files.map((f) => f.path));
      deletedRuns += 1;
    }
  } catch (error) {
    // Backup itself succeeded; retention failure is a warning only.
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
    entityId: folder,
    summary: {
      storage: storage.name,
      rowCounts,
      retentionDays,
      deletedRuns,
      deletedLegacy,
    },
  });

  return NextResponse.json({
    ok: true,
    path: folder,
    deletedRuns,
    deletedLegacy,
  });
}
