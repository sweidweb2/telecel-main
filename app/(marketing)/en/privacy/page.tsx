import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { legalCopyFor } from "@/constants/legal-copy";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "en",
  path: "/privacy",
  title: "Privacy Policy — ASIP",
  description:
    "Draft privacy policy for the Africa Startup Initiative Program website.",
});

export default function Page() {
  return <LegalPageContent copy={legalCopyFor("en", "privacy")} />;
}
