import type { Metadata } from "next";

import { CreateBackupSettingDialog } from "@/components/backups/backup-setting-dialogs";
import { BackupsTable } from "@/components/backups/backups-table";
import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { AccessDenied } from "@/components/layout/access-denied";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import {
  ScheduledBackupsSection,
  StorageExportComingSoon,
} from "@/components/backups/scheduled-backups-section";
import { requireSection } from "@/data/auth";
import { listBackupExportSettings } from "@/data/backups";
import { getScheduledBackupsOverview } from "@/data/scheduled-backups";

export const metadata: Metadata = {
  title: getPortalSection(ROUTES.backups)?.title ?? "Backups",
};

export default async function BackupsPage() {
  const { session, section, allowed } = await requireSection(ROUTES.backups);
  if (!allowed) return <AccessDenied />;

  const [settings, scheduled] = await Promise.all([
    listBackupExportSettings(session),
    session.role === "admin" ? getScheduledBackupsOverview(session) : null,
  ]);

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={section.title}
        description={section.description}
        actions={<CreateBackupSettingDialog />}
      />
      <BackupsTable settings={settings} />
      {scheduled ? <ScheduledBackupsSection overview={scheduled} /> : null}
      <StorageExportComingSoon />
    </main>
  );
}
