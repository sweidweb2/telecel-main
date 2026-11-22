import "server-only";

import type { StaffSession } from "@/data/auth";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  parseRetentionDays,
  SCHEDULED_BACKUP_PREFIX,
  sortBackupsNewestFirst,
  type StoredBackup,
} from "@/lib/scheduled-backup";

export type ScheduledBackupRun = {
  status: "success" | "failed";
  at: string;
};

export type ScheduledBackupsOverview = {
  lastRun: ScheduledBackupRun | null;
  files: StoredBackup[];
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
    const files = sortBackupsNewestFirst(
      await getBackupStorage().list(SCHEDULED_BACKUP_PREFIX),
    );
    return { lastRun, files, retentionDays, loadError: null };
  } catch (error) {
    return {
      lastRun,
      files: [],
      retentionDays,
      loadError: error instanceof Error ? error.message : String(error),
    };
  }
}
