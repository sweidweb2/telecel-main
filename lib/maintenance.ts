import {
  DEFAULT_MAINTENANCE_MODE,
  MAINTENANCE_CACHE_TTL_SECONDS,
  MAINTENANCE_SETTING_KEY,
  type MaintenanceMode,
} from "@/types/site-settings";
import { parseMaintenanceMode } from "@/validations/site-settings";

type CacheEntry = {
  at: number;
  mode: MaintenanceMode;
};

let cache: CacheEntry | null = null;

/** Request header the proxy sets on its /maintenance rewrites. */
export const MAINTENANCE_REWRITE_HEADER = "x-maintenance-rewrite";

const FETCH_FAILURE_LOG_INTERVAL_MS = 5 * 60 * 1000;
let lastFetchFailureLogAt = 0;

/**
 * Records a maintenance-read failure to app_errors at most once per interval
 * (fail-open still applies). Lazy import keeps this module free of
 * server-only deps for the proxy/tests; never throws.
 */
export function reportMaintenanceFetchFailure(
  reason: string,
  now = Date.now(),
): boolean {
  if (now - lastFetchFailureLogAt < FETCH_FAILURE_LOG_INTERVAL_MS) return false;
  lastFetchFailureLogAt = now;
  void import("@/actions/observability")
    .then(({ recordAppError }) =>
      recordAppError({
        severity: "warning",
        source: "lib.maintenance.fetch",
        message: `Maintenance mode read failed (failing open): ${reason}`,
      }),
    )
    .catch(() => undefined);
  return true;
}

/**
 * Break-glass contract (single ops valve):
 * - `MAINTENANCE_FORCE_OFF` ignores the DB and treats maintenance as off.
 * - Missing env, failed REST, or bad JSON also fail **open** (off) so a
 *   Supabase outage cannot lock admins out of the CMS.
 * Do not add more valves — FORCE_OFF + fail-open are the whole story.
 */
export function isMaintenanceForceOff(): boolean {
  const raw = process.env.MAINTENANCE_FORCE_OFF?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/** Apply FORCE_OFF on top of a stored/raw mode. */
export function resolveMaintenanceMode(mode: MaintenanceMode): MaintenanceMode {
  if (isMaintenanceForceOff()) return DEFAULT_MAINTENANCE_MODE;
  return mode;
}

export function isMaintenanceActive(mode: MaintenanceMode): boolean {
  return resolveMaintenanceMode(mode) === "full";
}

/**
 * Optimistic admin check from JWT `app_metadata.app_role` (proxy login
 * redirect only). Page/action guards use the DB role via `get_session_context`.
 */
export function isAdminClaim(
  claims: { app_metadata?: Record<string, unknown> } | null | undefined,
): boolean {
  return claims?.app_metadata?.app_role === "admin";
}

/**
 * Uncached REST read of the stored mode (no FORCE_OFF). Shared by the proxy
 * memory cache and `data/site-settings` `unstable_cache` so both paths hit
 * the same wire format and fail-open behavior.
 */
export async function fetchMaintenanceModeFromRest(): Promise<MaintenanceMode> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return DEFAULT_MAINTENANCE_MODE;

  try {
    const endpoint = new URL(`${url.replace(/\/$/, "")}/rest/v1/site_settings`);
    endpoint.searchParams.set("select", "value");
    endpoint.searchParams.set("key", `eq.${MAINTENANCE_SETTING_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      reportMaintenanceFetchFailure(`HTTP ${response.status}`);
      return DEFAULT_MAINTENANCE_MODE;
    }

    const rows = (await response.json()) as Array<{ value: unknown }>;
    return parseMaintenanceMode(rows[0]?.value);
  } catch (error) {
    reportMaintenanceFetchFailure(
      error instanceof Error ? error.message : "unknown error",
    );
    return DEFAULT_MAINTENANCE_MODE;
  }
}

/**
 * Proxy-safe read with a short in-memory TTL matching
 * `MAINTENANCE_CACHE_TTL_SECONDS`. FORCE_OFF is applied on every read so the
 * env valve is immediate without waiting for cache expiry.
 */
export async function getMaintenanceModeForProxy(): Promise<MaintenanceMode> {
  const now = Date.now();
  if (cache && now - cache.at < MAINTENANCE_CACHE_TTL_SECONDS * 1000) {
    return resolveMaintenanceMode(cache.mode);
  }

  const mode = await fetchMaintenanceModeFromRest();
  cache = { at: now, mode };
  return resolveMaintenanceMode(mode);
}

/** Clears the proxy TTL cache after settings writes (and in tests). */
export function clearMaintenanceProxyCache(): void {
  cache = null;
  lastFetchFailureLogAt = 0;
}
