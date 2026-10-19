import { contactLabelsFor } from "@/components/marketing/contact-labels";
import { ContactSection } from "@/components/marketing/contact-section";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "fr",
  path: "/contact",
  title: "Nous contacter — ASIP",
  description:
    "Contactez l’équipe du Programme africain d’initiative pour les startups.",
});

export default function FrContactPage() {
  return (
    <MarketingPageShell
      title="Nous contacter"
      description="Questions sur le programme, les partenariats ou la presse — écrivez à l’équipe ASIP via les coordonnées ci-dessous ou envoyez un message."
    >
      <ContactSection locale="fr" labels={contactLabelsFor("fr")} />
    </MarketingPageShell>
  );
}
