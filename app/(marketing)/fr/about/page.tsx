import { AboutPageContent } from "@/components/marketing/about-page-content";
import { marketingCopyFor } from "@/constants/marketing-copy";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "fr",
  path: "/about",
  title: "À propos d’ASIP",
  description:
    "Découvrez la mission, l’orientation et les partenaires de l’écosystème ASIP.",
});

export default function Page() {
  return <AboutPageContent locale="fr" copy={marketingCopyFor("fr", "about")} />;
}
