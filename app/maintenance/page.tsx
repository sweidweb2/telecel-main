import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { MaintenanceScreen } from "@/components/layout/maintenance-screen";
import { ROUTES } from "@/constants/routes";
import { getMaintenanceMode } from "@/data/site-settings";
import {
  isMaintenanceActive,
  MAINTENANCE_REWRITE_HEADER,
} from "@/lib/maintenance";

export const metadata: Metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  // Direct visits when maintenance is off go home instead of a stale notice.
  // Proxy rewrites are trusted as-is to avoid a redirect loop between caches.
  const rewritten = (await headers()).get(MAINTENANCE_REWRITE_HEADER) === "1";
  if (!rewritten && !isMaintenanceActive(await getMaintenanceMode())) {
    redirect(ROUTES.home);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MaintenanceScreen />
    </div>
  );
}
