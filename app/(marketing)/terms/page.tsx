import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { TERMS_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(TERMS_BLUEPRINT);

export default function TermsPage() {
  return <MarketingPageView config={TERMS_BLUEPRINT} />;
}
