import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
export const metadata = buildMarketingMetadata({ locale: "fr", path: "/", title: "ASIP — Programme africain d’initiative pour les startups", description: "Aider les entreprises technologiques africaines grâce à l’accélération, à l’écosystème et à la visibilité marché." });
export default function Page() { return <MarketingContentPage locale="fr" slug="" />; }
