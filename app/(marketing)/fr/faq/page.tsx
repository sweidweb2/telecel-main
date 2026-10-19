import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "fr", path: "/faq", title: "FAQ — ASIP", description: "Réponses sur le programme ASIP, les candidatures et les partenariats." });
export default function Page() { return <MarketingContentPage locale="fr" slug="faq" />; }
