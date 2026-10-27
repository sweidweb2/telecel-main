import type { Metadata } from "next";

import { CreateBackupSettingDialog } from "@/components/backups/backup-setting-dialogs";
import { BackupsTable } from "@/components/backups/backups-table";
import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { AccessDenied } from "@/components/layout/access-denied";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { listBackupExportSettings } from "@/data/backups";

export const metadata: Metadata = {
  title: getPortalSection(ROUTES.backups)?.title ?? "Backups",
};

export default async function BackupsPage() {
  const { session, section, allowed } = await requireSection(ROUTES.backups);
  if (!allowed) return <AccessDenied />;

  const settings = await listBackupExportSettings(session);

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={section.title}
        description={section.description}
        actions={<CreateBackupSettingDialog />}
      />
      <BackupsTable settings={settings} />
    </main>
  );
}
