import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { CASE_STUDIES_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(CASE_STUDIES_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={CASE_STUDIES_BLUEPRINT} />;
}
