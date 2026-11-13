import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { SOLUTIONS_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(SOLUTIONS_HUB_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={SOLUTIONS_HUB_BLUEPRINT} />;
}
