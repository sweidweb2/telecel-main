import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { CASE_STUDIES_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(CASE_STUDIES_BLUEPRINT);

export default function Page() {
  return <MarketingPageView config={CASE_STUDIES_BLUEPRINT} />;
}
