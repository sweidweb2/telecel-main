import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { LeadershipPage } from "@/components/marketing/why-telecel-page";
import { LEADERSHIP_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(LEADERSHIP_BLUEPRINT);

export default function Page() {
  return <LeadershipPage config={LEADERSHIP_BLUEPRINT} />;
}
