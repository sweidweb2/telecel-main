import "server-only";

import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_MAINTENANCE_FLAGS,
  MAINTENANCE_CACHE_TAG,
  MAINTENANCE_SETTING_KEY,
  type MaintenanceFlags,
} from "@/types/site-settings";
import { parseMaintenanceFlags } from "@/validations/site-settings";

async function fetchMaintenanceFlags(): Promise<MaintenanceFlags> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", MAINTENANCE_SETTING_KEY)
    .maybeSingle();

  if (error) throw error;
  if (!data) return DEFAULT_MAINTENANCE_FLAGS;
  return parseMaintenanceFlags(data.value);
}

const cachedMaintenanceFlags = unstable_cache(
  fetchMaintenanceFlags,
  ["site-settings-maintenance"],
  { tags: [MAINTENANCE_CACHE_TAG], revalidate: 30 },
);

/** Cached public read of Level 1 / Level 2 maintenance flags. */
export async function getMaintenanceFlags(): Promise<MaintenanceFlags> {
  return cachedMaintenanceFlags();
}
