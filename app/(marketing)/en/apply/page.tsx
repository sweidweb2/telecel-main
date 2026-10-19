import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "en", path: "/apply", title: "Register interest — ASIP", description: "Prepare and share your ASIP venture profile." });
export default function Page() { return <MarketingContentPage locale="en" slug="apply" />; }
