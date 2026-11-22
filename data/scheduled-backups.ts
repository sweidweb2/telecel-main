import "server-only";

import type { StaffSession } from "@/data/auth";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  MANIFEST_FILENAME,
  parseRetentionDays,
  parseRunStamp,
  runFolderPath,
  SCHEDULED_BACKUP_PREFIX,
  sortBackupsNewestFirst,
  sortRunStampsNewestFirst,
  type StoredBackup,
} from "@/lib/scheduled-backup";

export type ScheduledBackupRun = {
  status: "success" | "failed";
  at: string;
};

/** One per-run folder: `scheduled/<stamp>/<table>.json` + manifest. */
export type StoredBackupRun = {
  stamp: string;
  createdAt: string;
  /** False while/if the run never wrote its manifest (incomplete). */
  complete: boolean;
  /** Table files; `relativePath` is `<stamp>/<file>` for downloads. */
  files: (StoredBackup & { relativePath: string })[];
};

export type ScheduledBackupsOverview = {
  lastRun: ScheduledBackupRun | null;
  runs: StoredBackupRun[];
  /** Pre-folder single-file backups directly under `scheduled/`. */
  legacyFiles: StoredBackup[];
  retentionDays: number;
  loadError: string | null;
};

/**
 * Scheduled backups for /dashboard/backups (admin only). Last run status comes
 * from audit_log (`entity_type = 'scheduled_backup'`, admin RLS); files from
 * the backup store via the service role. Caller must gate on admin first.
 */
export async function getScheduledBackupsOverview(
  session: StaffSession,
): Promise<ScheduledBackupsOverview> {
  const retentionDays = parseRetentionDays(process.env.BACKUP_RETENTION_DAYS);

  const { data: runRow } = await session.supabase
    .from("audit_log")
    .select("action, created_at")
    .eq("entity_type", "scheduled_backup")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastRun: ScheduledBackupRun | null = runRow
    ? {
        status: runRow.action === "export" ? "success" : "failed",
        at: runRow.created_at,
      }
    : null;

  try {
    const storage = getBackupStorage();
    const [legacy, folders] = await Promise.all([
      storage.list(SCHEDULED_BACKUP_PREFIX),
      storage.listFolders(SCHEDULED_BACKUP_PREFIX),
    ]);
    const runs = await Promise.all(
      sortRunStampsNewestFirst(folders).map(async (stamp) => {
        const files = await storage.list(runFolderPath(stamp));
        return {
          stamp,
          createdAt: parseRunStamp(stamp)!.toISOString(),
          complete: files.some((f) => f.name === MANIFEST_FILENAME),
          files: files
            .filter((f) => f.name !== MANIFEST_FILENAME)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((f) => ({ ...f, relativePath: `${stamp}/${f.name}` })),
        } satisfies StoredBackupRun;
      }),
    );
    return {
      lastRun,
      runs,
      legacyFiles: sortBackupsNewestFirst(legacy),
      retentionDays,
      loadError: null,
    };
  } catch (error) {
    return {
      lastRun,
      runs: [],
      legacyFiles: [],
      retentionDays,
      loadError: error instanceof Error ? error.message : String(error),
    };
  }
}
