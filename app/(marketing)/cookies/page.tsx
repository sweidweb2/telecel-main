import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { COOKIES_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(COOKIES_BLUEPRINT);

export default function CookiesPage() {
  return <MarketingPageView config={COOKIES_BLUEPRINT} />;
}
