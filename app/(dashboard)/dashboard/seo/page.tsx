import { PortalPlaceholder } from "@/components/dashboard/portal-placeholder";
import { AccessDenied } from "@/components/layout/access-denied";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";

export const metadata = { title: getPortalSection(ROUTES.seo)?.title };

export default async function SeoPage() {
  const { section, allowed } = await requireSection(ROUTES.seo);
  if (!allowed) return <AccessDenied />;
  return <PortalPlaceholder section={section} />;
}
