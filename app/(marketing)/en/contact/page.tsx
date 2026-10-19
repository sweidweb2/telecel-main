import { contactLabelsFor } from "@/components/marketing/contact-labels";
import { ContactSection } from "@/components/marketing/contact-section";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "en",
  path: "/contact",
  title: "Contact us — ASIP",
  description:
    "Get in touch with the Africa Startup Initiative Program team.",
});

export default function EnContactPage() {
  return (
    <MarketingPageShell
      title="Contact us"
      description="Questions about the programme, partnerships or press — reach the ASIP team using the details below or send a message."
    >
      <ContactSection locale="en" labels={contactLabelsFor("en")} />
    </MarketingPageShell>
  );
}
