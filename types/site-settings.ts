export type MaintenanceFlags = {
  level1: boolean;
  level2: boolean;
};

export const DEFAULT_MAINTENANCE_FLAGS: MaintenanceFlags = {
  level1: false,
  level2: false,
};

export const MAINTENANCE_SETTING_KEY = "maintenance" as const;
export const MAINTENANCE_CACHE_TAG = "site-settings-maintenance" as const;
