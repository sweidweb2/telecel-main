import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { ServicesHub } from "@/components/marketing/services-hub";
import { SERVICES_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(SERVICES_HUB_BLUEPRINT);

export default function Page() {
  return <ServicesHub config={SERVICES_HUB_BLUEPRINT} />;
}
