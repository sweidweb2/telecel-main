import { PortalPlaceholder } from "@/components/dashboard/portal-placeholder";
import { AccessDenied } from "@/components/layout/access-denied";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";

export const metadata = { title: getPortalSection(ROUTES.formRouting)?.title };

export default async function FormRoutingPage() {
  const { section, allowed } = await requireSection(ROUTES.formRouting);
  if (!allowed) return <AccessDenied />;
  return <PortalPlaceholder section={section} />;
}
