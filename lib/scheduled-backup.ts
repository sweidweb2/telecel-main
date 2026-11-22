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
  /** Files directly under `prefix` (folders excluded). */
  list(prefix: string): Promise<StoredBackup[]>;
  /** Names of sub-folders directly under `prefix`. */
  listFolders(prefix: string): Promise<string[]>;
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

/* ---------- Per-run folders: scheduled/<stamp>/<table>.json + manifest ---------- */

export const MANIFEST_FILENAME = "manifest.json";

/** Folder-safe UTC stamp, e.g. `2026-11-22T02-00-00Z`. */
export function buildRunStamp(at: Date = new Date()): string {
  return at
    .toISOString()
    .replaceAll(":", "-")
    .replace(/\.\d{3}Z$/, "Z");
}

const RUN_STAMP = /^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})Z$/;

/** Inverse of buildRunStamp; null for anything that is not a run folder. */
export function parseRunStamp(stamp: string): Date | null {
  const match = RUN_STAMP.exec(stamp);
  if (!match) return null;
  const date = new Date(`${match[1]}T${match[2]}:${match[3]}:${match[4]}Z`);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function runFolderPath(stamp: string): string {
  return `${SCHEDULED_BACKUP_PREFIX}/${stamp}`;
}

export function runTablePath(stamp: string, table: string): string {
  return `${runFolderPath(stamp)}/${table}.json`;
}

export function runManifestPath(stamp: string): string {
  return `${runFolderPath(stamp)}/${MANIFEST_FILENAME}`;
}

/** Compact JSON (no indentation) for scheduled backup files. */
export function toCompactJson(value: unknown): string {
  return JSON.stringify(value);
}

/**
 * Run folders strictly older than `retentionDays`. Folder names that are not
 * run stamps are kept (never delete blindly).
 */
export function selectExpiredRuns(
  stamps: string[],
  retentionDays: number,
  now: Date = new Date(),
): string[] {
  const cutoff = now.getTime() - retentionDays * DAY_MS;
  return stamps.filter((stamp) => {
    const at = parseRunStamp(stamp);
    return at !== null && at.getTime() < cutoff;
  });
}

/** Run stamps newest first; unparseable names dropped. */
export function sortRunStampsNewestFirst(stamps: string[]): string[] {
  return stamps
    .filter((stamp) => parseRunStamp(stamp) !== null)
    .sort((a, b) => parseRunStamp(b)!.getTime() - parseRunStamp(a)!.getTime());
}

const SAFE_SEGMENT = /^[a-zA-Z0-9._-]+$/;

/**
 * Validates a download path relative to the scheduled prefix: either a legacy
 * single file (`all_tables_….json`) or `<stamp>/<file>.json` inside a run.
 */
export function isSafeScheduledBackupPath(relative: string): boolean {
  if (typeof relative !== "string") return false;
  const segments = relative.split("/");
  if (segments.length === 1) {
    return SAFE_SEGMENT.test(segments[0]) && !/^\.+$/.test(segments[0]);
  }
  if (segments.length !== 2) return false;
  const [stamp, file] = segments;
  return (
    parseRunStamp(stamp) !== null &&
    SAFE_SEGMENT.test(file) &&
    !/^\.+$/.test(file)
  );
}
