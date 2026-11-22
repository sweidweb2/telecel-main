import "server-only";

import {
  BACKUP_EXPORT_TABLES,
  type BackupExportTable,
} from "@/constants/backup-tables";
import type { BackupRow } from "@/lib/backup-export";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 1000;

/**
 * Full-row dump of one allowlisted table via the service-role client.
 * Callers must authorize first (admin action or CRON_SECRET).
 */
export async function fetchTableRows(
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

/** Fetch the given tables (default: every allowlisted table) in parallel. */
export async function fetchAllTables(
  tableNames: readonly BackupExportTable[] = BACKUP_EXPORT_TABLES,
): Promise<Partial<Record<BackupExportTable, BackupRow[]>>> {
  const fetched = await Promise.all(
    tableNames.map(
      async (tableName) =>
        [tableName, await fetchTableRows(tableName)] as const,
    ),
  );
  return Object.fromEntries(fetched) as Partial<
    Record<BackupExportTable, BackupRow[]>
  >;
}
