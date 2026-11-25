import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { WhyTelecelPage } from "@/components/marketing/why-telecel-page";
import { WHY_TELECEL_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(WHY_TELECEL_BLUEPRINT);

export default function Page() {
  return <WhyTelecelPage config={WHY_TELECEL_BLUEPRINT} />;
}
