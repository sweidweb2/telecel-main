import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "en", path: "/programme", title: "Programme — ASIP", description: "Discover the ASIP founder journey." });
export default function Page() { return <MarketingContentPage locale="en" slug="programme" />; }
