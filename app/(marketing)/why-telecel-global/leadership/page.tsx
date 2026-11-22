import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { LEADERSHIP_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(LEADERSHIP_BLUEPRINT);

export default function Page() {
  return <MarketingPageView config={LEADERSHIP_BLUEPRINT} />;
}
