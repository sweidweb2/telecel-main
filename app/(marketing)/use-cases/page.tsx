import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { USE_CASES_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(USE_CASES_HUB_BLUEPRINT);

export default function Page() {
  return <MarketingPageView config={USE_CASES_HUB_BLUEPRINT} />;
}
