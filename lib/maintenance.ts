import {
  DEFAULT_MAINTENANCE_FLAGS,
  MAINTENANCE_SETTING_KEY,
  type MaintenanceFlags,
} from "@/types/site-settings";
import { parseMaintenanceFlags } from "@/validations/site-settings";

const CACHE_TTL_MS = 15_000;

type CacheEntry = {
  at: number;
  flags: MaintenanceFlags;
};

let cache: CacheEntry | null = null;

/** Ops safety valve — when set, both maintenance levels are ignored. */
export function isMaintenanceForceOff(): boolean {
  const raw = process.env.MAINTENANCE_FORCE_OFF?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/** Effective flags after force-off and Level 2 ⇒ Level 1. */
export function resolveMaintenanceFlags(
  flags: MaintenanceFlags,
): MaintenanceFlags {
  if (isMaintenanceForceOff()) return DEFAULT_MAINTENANCE_FLAGS;
  if (flags.level2) return { level1: true, level2: true };
  return { level1: flags.level1, level2: false };
}

export function isLoginBlocked(flags: MaintenanceFlags): boolean {
  const resolved = resolveMaintenanceFlags(flags);
  return resolved.level1 || resolved.level2;
}

export function isPublicBlocked(flags: MaintenanceFlags): boolean {
  return resolveMaintenanceFlags(flags).level2;
}

/**
 * Proxy-safe fetch with a short in-memory TTL. Uses the anon REST API so it
 * works in the request proxy without importing `server-only` modules.
 */
export async function getMaintenanceFlagsForProxy(): Promise<MaintenanceFlags> {
  if (isMaintenanceForceOff()) return DEFAULT_MAINTENANCE_FLAGS;

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.flags;

  const flags = await fetchMaintenanceFlagsFromRest();
  cache = { at: now, flags };
  return flags;
}

/** Clears the proxy TTL cache (useful in tests). */
export function clearMaintenanceProxyCache(): void {
  cache = null;
}

async function fetchMaintenanceFlagsFromRest(): Promise<MaintenanceFlags> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return DEFAULT_MAINTENANCE_FLAGS;

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
      // Avoid Next Data Cache sticking to a stale maintenance state in proxy.
      cache: "no-store",
    });

    if (!response.ok) return DEFAULT_MAINTENANCE_FLAGS;

    const rows = (await response.json()) as Array<{ value: unknown }>;
    const value = rows[0]?.value;
    return resolveMaintenanceFlags(parseMaintenanceFlags(value));
  } catch {
    return DEFAULT_MAINTENANCE_FLAGS;
  }
}
