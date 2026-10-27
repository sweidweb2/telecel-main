import { z } from "zod";

import {
  DEFAULT_MAINTENANCE_MODE,
  type MaintenanceMode,
} from "@/types/site-settings";

export const maintenanceModeSchema = z.enum(["off", "full"]);

/** Stored jsonb shape: `{ "mode": "off" | "full" }`. */
export const maintenanceSettingSchema = z.object({
  mode: maintenanceModeSchema,
});

export type MaintenanceModeInput = z.input<typeof maintenanceModeSchema>;

const legacyFlagsSchema = z.object({
  level1: z.boolean().optional(),
  level2: z.boolean().optional(),
});

/**
 * Parse a raw jsonb value from `site_settings`. Accepts the current
 * `{ mode }` shape and the legacy `{ level1, level2 }` shape (level2 ⇒ full).
 * Never throws — garbage becomes `"off"`.
 */
export function parseMaintenanceMode(value: unknown): MaintenanceMode {
  if (typeof value === "string") {
    const asEnum = maintenanceModeSchema.safeParse(value);
    if (asEnum.success) return asEnum.data;
  }

  const current = maintenanceSettingSchema.safeParse(value);
  if (current.success) return current.data.mode;

  const legacy = legacyFlagsSchema.safeParse(value);
  if (legacy.success && legacy.data.level2 === true) return "full";

  return DEFAULT_MAINTENANCE_MODE;
}

export function maintenanceModeToSetting(mode: MaintenanceMode) {
  return { mode };
}
