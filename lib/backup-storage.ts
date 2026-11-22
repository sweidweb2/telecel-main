import "server-only";

import type {
  BackupStorageAdapter,
  StoredBackup,
} from "@/lib/scheduled-backup";
import { createAdminClient } from "@/lib/supabase/admin";

/** Private bucket created in 20261122090000_scheduled_backups_bucket.sql. */
export const BACKUP_BUCKET = "backups";

/** Supabase Storage implementation (service role; bucket has no RLS policies). */
export function createSupabaseBackupStorage(
  bucket = BACKUP_BUCKET,
): BackupStorageAdapter {
  const storage = () => createAdminClient().storage.from(bucket);

  return {
    name: `supabase:${bucket}`,

    async upload(path, content, contentType) {
      const { error } = await storage().upload(
        path,
        new Blob([content], { type: contentType }),
        { contentType, upsert: false },
      );
      if (error) throw error;
    },

    async list(prefix) {
      const out: StoredBackup[] = [];
      const limit = 1000;
      for (let offset = 0; ; offset += limit) {
        const { data, error } = await storage().list(prefix, {
          limit,
          offset,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) throw error;
        const batch = (data ?? []).filter((item) => item.id !== null);
        for (const item of batch) {
          const size = (item.metadata as { size?: unknown } | null)?.size;
          out.push({
            path: prefix ? `${prefix}/${item.name}` : item.name,
            name: item.name,
            createdAt: item.created_at ?? null,
            size: typeof size === "number" ? size : null,
          });
        }
        if ((data ?? []).length < limit) break;
      }
      return out;
    },

    async remove(paths) {
      if (paths.length === 0) return;
      const { error } = await storage().remove(paths);
      if (error) throw error;
    },

    async signedUrl(path, expiresInSeconds) {
      const { data, error } = await storage().createSignedUrl(
        path,
        expiresInSeconds,
        { download: true },
      );
      if (error) throw error;
      return data.signedUrl;
    },
  };
}

/** Swap point for other providers (S3, R2, …). */
export function getBackupStorage(): BackupStorageAdapter {
  return createSupabaseBackupStorage();
}
