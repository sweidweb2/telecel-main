import "server-only";

import {
  BACKUP_EXPORT_TABLES,
  BACKUP_TABLE_PRIMARY_KEYS,
  type BackupExportTable,
} from "@/constants/backup-tables";
import type { BackupRow } from "@/lib/backup-export";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 1000;

/**
 * Full-row dump of one allowlisted table via the service-role client.
 * Callers must authorize first (admin action or CRON_SECRET).
 * Keyset pagination on the table's primary key keeps pages stable while rows
 * are inserted/deleted mid-export.
 */
export async function fetchTableRows(
  tableName: BackupExportTable,
): Promise<BackupRow[]> {
  const admin = createAdminClient();
  const pk = BACKUP_TABLE_PRIMARY_KEYS[tableName];
  const rows: BackupRow[] = [];
  let cursor: string | number | null = null;

  for (;;) {
    // Full-row dump: select all columns intentionally for admin backups.
    let query = admin
      .from(tableName)
      .select("*")
      .order(pk, { ascending: true })
      .limit(PAGE_SIZE);
    if (cursor !== null) query = query.gt(pk, cursor);

    const { data, error } = await query;
    if (error) throw error;

    const batch = (data ?? []) as BackupRow[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    cursor = batch[batch.length - 1][pk] as string | number;
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
