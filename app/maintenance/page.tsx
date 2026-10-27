import type { Metadata } from "next";

import { MaintenanceScreen } from "@/components/layout/maintenance-screen";

export const metadata: Metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MaintenanceScreen />
    </div>
  );
}