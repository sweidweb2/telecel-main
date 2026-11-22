import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { LegalPage } from "@/components/marketing/legal-page";
import { PRIVACY_POLICY } from "@/constants/legal-content";
import { requireBlueprint } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export const metadata = blueprintMetadata(requireBlueprint(ROUTES.privacy));

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
