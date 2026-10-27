import "server-only";

import { unstable_cache } from "next/cache";

import {
  fetchMaintenanceModeFromRest,
  resolveMaintenanceMode,
} from "@/lib/maintenance";
import {
  MAINTENANCE_CACHE_TAG,
  MAINTENANCE_CACHE_TTL_SECONDS,
  type MaintenanceMode,
} from "@/types/site-settings";

const cachedMaintenanceMode = unstable_cache(
  fetchMaintenanceModeFromRest,
  ["site-settings-maintenance"],
  {
    tags: [MAINTENANCE_CACHE_TAG],
    revalidate: MAINTENANCE_CACHE_TTL_SECONDS,
  },
);

/**
 * Cached public read of maintenance mode. Same REST source + TTL as the
 * proxy; FORCE_OFF is applied here so the env valve does not wait on cache.
 */
export async function getMaintenanceMode(): Promise<MaintenanceMode> {
  return resolveMaintenanceMode(await cachedMaintenanceMode());
}
