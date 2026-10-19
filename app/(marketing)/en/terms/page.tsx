import { LegalPageContent } from "@/components/marketing/legal-page-content";
import { legalCopyFor } from "@/constants/legal-copy";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "en",
  path: "/terms",
  title: "Terms of Service — ASIP",
  description:
    "Draft terms of service for the Africa Startup Initiative Program website.",
});

export default function Page() {
  return <LegalPageContent copy={legalCopyFor("en", "terms")} />;
}
