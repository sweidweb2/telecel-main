/**
 * In-memory sliding-window rate limiter.
 * Multi-instance serverless does not share this Map — fine for launch; upgrade later if needed.
 */

const windows = new Map<string, number[]>();

function prune(key: string, cutoff: number): number[] {
  const prior = (windows.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
  windows.set(key, prior);
  return prior;
}

/** True when the key is already at or over the limit (does not record). */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  const prior = prune(key, now - windowMs);
  return prior.length >= limit;
}

/** Records one attempt for the key (call only after all checks pass). */
export function recordRateLimitHit(
  key: string,
  windowMs: number,
  now = Date.now(),
): void {
  const prior = prune(key, now - windowMs);
  prior.push(now);
  windows.set(key, prior);
}

/**
 * @returns true if the action is allowed (and records this attempt)
 */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  if (isRateLimited(key, limit, windowMs, now)) return false;
  recordRateLimitHit(key, windowMs, now);
  return true;
}

/** Test helper — clears all buckets. */
export function resetRateLimitBuckets(): void {
  windows.clear();
}
