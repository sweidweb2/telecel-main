import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { USE_CASES_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(USE_CASES_HUB_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={USE_CASES_HUB_BLUEPRINT} />;
}
