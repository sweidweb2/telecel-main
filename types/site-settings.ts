/** Site-wide maintenance: off, or full public outage (admin break-glass only). */
export type MaintenanceMode = "off" | "full";

export const DEFAULT_MAINTENANCE_MODE: MaintenanceMode = "off";

export const MAINTENANCE_SETTING_KEY = "maintenance" as const;
export const MAINTENANCE_CACHE_TAG = "site-settings-maintenance" as const;

/** Shared TTL for proxy in-memory cache and Next `unstable_cache` (seconds). */
export const MAINTENANCE_CACHE_TTL_SECONDS = 15;
