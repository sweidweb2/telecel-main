import type { Metadata } from "next";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { AccessDenied } from "@/components/layout/access-denied";
import { MaintenanceSettingsForm } from "@/components/settings/maintenance-settings-form";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { getMaintenanceFlags } from "@/data/site-settings";

export const metadata: Metadata = {
  title: getPortalSection(ROUTES.settings)?.title ?? "Site settings",
};

export default async function SettingsPage() {
  const { section, allowed } = await requireSection(ROUTES.settings);
  if (!allowed) return <AccessDenied />;

  const flags = await getMaintenanceFlags();

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={section.title}
        description="Control site-wide maintenance modes. More settings (analytics, footer) will land here later."
      />
      <section
        aria-labelledby="maintenance-heading"
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3
          id="maintenance-heading"
          className="font-heading text-lg font-medium text-ink"
        >
          Maintenance
        </h3>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Level 1 blocks new sign-ins. Level 2 also replaces public pages with a
          branded maintenance screen.
        </p>
        <MaintenanceSettingsForm initialFlags={flags} />
      </section>
    </main>
  );
}
