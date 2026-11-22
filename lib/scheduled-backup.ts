/**
 * Pure helpers for scheduled backups (no server-only imports, so they are
 * unit-testable). The storage adapter interface lives here so Supabase
 * Storage can be swapped for S3 etc. without touching the cron route.
 */

export const SCHEDULED_BACKUP_PREFIX = "scheduled";
export const DEFAULT_RETENTION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type StoredBackup = {
  /** Object path inside the backup store, e.g. `scheduled/all_tables_….json`. */
  path: string;
  name: string;
  createdAt: string | null;
  size: number | null;
};

export interface BackupStorageAdapter {
  readonly name: string;
  upload(path: string, content: string, contentType: string): Promise<void>;
  list(prefix: string): Promise<StoredBackup[]>;
  remove(paths: string[]): Promise<void>;
  signedUrl(path: string, expiresInSeconds: number): Promise<string>;
}

/** Constant-time string compare (avoids leaking the secret length/prefix). */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * True only when CRON_SECRET is configured and the header is exactly
 * `Bearer <secret>`. An unset/empty secret always denies.
 */
export function isAuthorizedCronRequest(
  authorizationHeader: string | null | undefined,
  secret: string | null | undefined,
): boolean {
  if (!secret || secret.trim().length === 0) return false;
  if (!authorizationHeader) return false;
  return safeEqual(authorizationHeader, `Bearer ${secret}`);
}

/** Parse BACKUP_RETENTION_DAYS; invalid or < 1 falls back to the default. */
export function parseRetentionDays(value: string | null | undefined): number {
  if (!value) return DEFAULT_RETENTION_DAYS;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1 || String(n) !== value.trim()) {
    return DEFAULT_RETENTION_DAYS;
  }
  return n;
}

/**
 * Backups strictly older than `retentionDays` relative to `now`.
 * Objects without a parseable timestamp are kept (never delete blindly).
 */
export function selectExpiredBackups(
  backups: StoredBackup[],
  retentionDays: number,
  now: Date = new Date(),
): StoredBackup[] {
  const cutoff = now.getTime() - retentionDays * DAY_MS;
  return backups.filter((backup) => {
    if (!backup.createdAt) return false;
    const t = Date.parse(backup.createdAt);
    return Number.isFinite(t) && t < cutoff;
  });
}

/** Newest first; undated objects last. */
export function sortBackupsNewestFirst(
  backups: StoredBackup[],
): StoredBackup[] {
  return [...backups].sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : -Infinity;
    const tb = b.createdAt ? Date.parse(b.createdAt) : -Infinity;
    return tb - ta;
  });
}
