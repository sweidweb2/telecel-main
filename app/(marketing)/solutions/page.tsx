import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { SOLUTIONS_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(SOLUTIONS_HUB_BLUEPRINT);

export default function Page() {
  return <MarketingPageView config={SOLUTIONS_HUB_BLUEPRINT} />;
}
