import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "fr", path: "/apply", title: "Manifester votre intérêt — ASIP", description: "Préparez et présentez le profil de votre entreprise à ASIP." });
export default function Page() { return <MarketingContentPage locale="fr" slug="apply" />; }
