import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { WHY_TELECEL_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(WHY_TELECEL_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={WHY_TELECEL_BLUEPRINT} />;
}
