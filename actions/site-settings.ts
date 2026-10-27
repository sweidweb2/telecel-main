"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { recordActivity, unexpectedActionError } from "@/actions/observability";
import { ROUTES } from "@/constants/routes";
import { authorizeAction } from "@/data/auth";
import { clearMaintenanceProxyCache } from "@/lib/maintenance";
import {
  MAINTENANCE_CACHE_TAG,
  MAINTENANCE_SETTING_KEY,
  type MaintenanceMode,
} from "@/types/site-settings";
import {
  maintenanceModeSchema,
  maintenanceModeToSetting,
  type MaintenanceModeInput,
} from "@/validations/site-settings";

export type SiteSettingsActionResult =
  | { status: "success"; message: string; mode: MaintenanceMode }
  | { status: "error"; message: string };

export async function updateMaintenanceMode(
  input: MaintenanceModeInput,
): Promise<SiteSettingsActionResult> {
  const parsed = maintenanceModeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid maintenance settings.",
    };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  const { session } = auth;
  const mode = parsed.data;

  const { error } = await session.supabase.from("site_settings").upsert(
    {
      key: MAINTENANCE_SETTING_KEY,
      value: maintenanceModeToSetting(mode),
      updated_by: session.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    return unexpectedActionError({
      source: "actions.site-settings.updateMaintenanceMode",
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
    summary: { mode },
  });

  revalidateTag(MAINTENANCE_CACHE_TAG, "max");
  revalidatePath(ROUTES.settings);
  revalidatePath(ROUTES.maintenance);
  clearMaintenanceProxyCache();

  return {
    status: "success",
    message: "Maintenance settings saved.",
    mode,
  };
}
