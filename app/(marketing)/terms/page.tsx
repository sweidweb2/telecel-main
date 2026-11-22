import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { LegalPage } from "@/components/marketing/legal-page";
import { TERMS_OF_USE } from "@/constants/legal-content";
import { TERMS_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(TERMS_BLUEPRINT);

export default function TermsPage() {
  return <LegalPage doc={TERMS_OF_USE} />;
}
