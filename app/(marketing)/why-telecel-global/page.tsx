import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { WHY_TELECEL_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(WHY_TELECEL_BLUEPRINT);

export default function Page() {
  return <MarketingPageView config={WHY_TELECEL_BLUEPRINT} />;
}
