"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { recordActivity, unexpectedActionError } from "@/actions/observability";
import { ROUTES } from "@/constants/routes";
import { authorizeAction } from "@/data/auth";
import { clearMaintenanceProxyCache } from "@/lib/maintenance";
import {
  MAINTENANCE_CACHE_TAG,
  MAINTENANCE_SETTING_KEY,
  type MaintenanceFlags,
} from "@/types/site-settings";
import {
  maintenanceFlagsSchema,
  type MaintenanceFlagsInput,
} from "@/validations/site-settings";

export type SiteSettingsActionResult =
  | { status: "success"; message: string; flags: MaintenanceFlags }
  | { status: "error"; message: string };

export async function updateMaintenanceFlags(
  input: MaintenanceFlagsInput,
): Promise<SiteSettingsActionResult> {
  const parsed = maintenanceFlagsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid maintenance settings.",
    };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  const { session } = auth;
  const flags = parsed.data;

  const { error } = await session.supabase.from("site_settings").upsert(
    {
      key: MAINTENANCE_SETTING_KEY,
      value: flags,
      updated_by: session.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    return unexpectedActionError({
      source: "actions.site-settings.updateMaintenanceFlags",
      actorId: session.userId,
      error,
      userMessage: "Maintenance settings could not be saved. Please try again.",
    });
  }

  await recordActivity({
    actorId: session.userId,
    action: "update",
    entityType: "site_settings",
    entityId: MAINTENANCE_SETTING_KEY,
    summary: { level1: flags.level1, level2: flags.level2 },
  });

  revalidateTag(MAINTENANCE_CACHE_TAG, "max");
  revalidatePath(ROUTES.settings);
  revalidatePath(ROUTES.maintenance);
  clearMaintenanceProxyCache();

  return {
    status: "success",
    message: "Maintenance settings saved.",
    flags,
  };
}
