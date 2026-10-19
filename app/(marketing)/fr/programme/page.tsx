import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "fr", path: "/programme", title: "Programme — ASIP", description: "Découvrez le parcours ASIP conçu pour les fondateurs." });
export default function Page() { return <MarketingContentPage locale="fr" slug="programme" />; }
