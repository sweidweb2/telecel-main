import { NextResponse, type NextRequest } from "next/server";

import { recordActivity, recordAppError } from "@/actions/observability";
import { BACKUP_EXPORT_TABLES } from "@/constants/backup-tables";
import { iterateTablePages } from "@/lib/backup-data";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  type BackupPart,
  buildRunStamp,
  createTablePartWriter,
  isAuthorizedCronRequest,
  MANUAL_EXPORT_PREFIX,
  MANUAL_EXPORT_RETENTION_DAYS,
  parseRetentionDays,
  runFolderPath,
  runManifestPath,
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
 * JSON part per ~20k rows / ~20MB of each allowlisted table under
 * `scheduled/<stamp>/<table>.<NNNN>.json` (streamed from the keyset loop),
 * then `manifest.json` last (a run without a manifest is incomplete), and
 * prunes run folders (plus legacy single files) older than
 * BACKUP_RETENTION_DAYS, plus manual export folders older than 7 days. Vercel sends `Authorization: Bearer $CRON_SECRET`
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
      { rows: number; bytes: number; parts: BackupPart[] }
    > = {};
    // Sequential, streamed: only one part of one table is held in memory.
    for (const tableName of BACKUP_EXPORT_TABLES) {
      const writer = createTablePartWriter({
        stamp,
        table: tableName,
        upload: (path, content) => storage.upload(path, content, JSON_TYPE),
      });
      for await (const batch of iterateTablePages(tableName)) {
        await writer.write(batch);
      }
      const parts = await writer.finish();
      const rows = parts.reduce((sum, part) => sum + part.rows, 0);
      rowCounts[tableName] = rows;
      tables[tableName] = {
        rows,
        bytes: parts.reduce((sum, part) => sum + part.bytes, 0),
        parts,
      };
    }
    await storage.upload(
      runManifestPath(stamp),
      toCompactJson({
        version: 2,
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

    // Manual export folders (signed-URL handoff) are kept for 7 days.
    const expiredManual = selectExpiredRuns(
      await storage.listFolders(MANUAL_EXPORT_PREFIX),
      MANUAL_EXPORT_RETENTION_DAYS,
      startedAt,
    );
    for (const run of expiredManual) {
      const files = await storage.list(`${MANUAL_EXPORT_PREFIX}/${run}`);
      await storage.remove(files.map((f) => f.path));
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
