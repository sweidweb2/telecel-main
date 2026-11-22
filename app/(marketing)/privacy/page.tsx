import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { LegalPage } from "@/components/marketing/legal-page";
import { PRIVACY_POLICY } from "@/constants/legal-content";
import { PRIVACY_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(PRIVACY_BLUEPRINT);

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
