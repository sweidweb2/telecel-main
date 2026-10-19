import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { legalCopyFor } from "@/constants/legal-copy";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "fr",
  path: "/privacy",
  title: "Politique de confidentialité — ASIP",
  description:
    "Politique de confidentialité provisoire du site du Programme africain d’initiative pour les startups.",
});

export default function Page() {
  return <LegalPageContent copy={legalCopyFor("fr", "privacy")} />;
}
