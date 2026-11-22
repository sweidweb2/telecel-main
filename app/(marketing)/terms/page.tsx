import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { LegalPage } from "@/components/marketing/legal-page";
import { TERMS_OF_USE } from "@/constants/legal-content";
import { requireBlueprint } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export const metadata = blueprintMetadata(requireBlueprint(ROUTES.terms));

export default function TermsPage() {
  return <LegalPage doc={TERMS_OF_USE} />;
}
