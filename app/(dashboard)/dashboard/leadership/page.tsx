import { PortalPlaceholder } from "@/components/dashboard/portal-placeholder";
import { AccessDenied } from "@/components/layout/access-denied";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";

export const metadata = { title: getPortalSection(ROUTES.leadership)?.title };

export default async function LeadershipPage() {
  const { section, allowed } = await requireSection(ROUTES.leadership);
  if (!allowed) return <AccessDenied />;
  return <PortalPlaceholder section={section} />;
}
