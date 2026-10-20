import type { ReactNode } from "react";
import type { Metadata } from "next";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireStaff } from "@/data/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Telecel Global CMS" },
  robots: { index: false, follow: false },
};

/**
 * Every CMS page also calls its own guard (requireSection / authorizeAction):
 * layouts are not re-run on every navigation, so they are not the only check.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireStaff();
  const user = { email: session.email, role: session.role };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <DashboardHeader user={user} />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
