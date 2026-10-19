import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "en", path: "/faq", title: "FAQ — ASIP", description: "Answers about the ASIP programme, applications, and partnerships." });
export default function Page() { return <MarketingContentPage locale="en" slug="faq" />; }
