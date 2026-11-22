import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { PRIVACY_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(PRIVACY_BLUEPRINT);

export default function PrivacyPage() {
  return <MarketingPageView config={PRIVACY_BLUEPRINT} />;
}
