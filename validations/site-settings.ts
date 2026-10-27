import { z } from "zod";

export const maintenanceFlagsSchema = z
  .object({
    level1: z.boolean(),
    level2: z.boolean(),
  })
  .transform((flags) =>
    flags.level2 ? { level1: true, level2: true } : flags,
  );

export type MaintenanceFlagsInput = z.input<typeof maintenanceFlagsSchema>;
export type MaintenanceFlagsParsed = z.output<typeof maintenanceFlagsSchema>;

/** Parse a raw jsonb value from `site_settings`; never throws. */
export function parseMaintenanceFlags(value: unknown): MaintenanceFlagsParsed {
  const parsed = maintenanceFlagsSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  return { level1: false, level2: false };
}
