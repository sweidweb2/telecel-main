import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { requireBlueprint } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

const config = requireBlueprint(ROUTES.terms);

export const metadata = blueprintMetadata(config);

export default function TermsPage() {
  return <BlueprintPage config={config} />;
}
