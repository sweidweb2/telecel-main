import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { INSIGHTS_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(INSIGHTS_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={INSIGHTS_BLUEPRINT} />;
}
