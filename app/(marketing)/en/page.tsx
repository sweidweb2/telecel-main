import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "en", path: "/", title: "ASIP — Africa Startup Initiative Program", description: "Helping African technology ventures grow through acceleration, ecosystem access, and market visibility." });
export default function Page() { return <MarketingContentPage locale="en" slug="" />; }
