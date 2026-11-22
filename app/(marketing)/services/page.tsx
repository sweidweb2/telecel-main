import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { ServicesHub } from "@/components/marketing/services-hub";
import { SERVICES_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(SERVICES_HUB_BLUEPRINT);

export default function Page() {
  return <ServicesHub config={SERVICES_HUB_BLUEPRINT} />;
}
