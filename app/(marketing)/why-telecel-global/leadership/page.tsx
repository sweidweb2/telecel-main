import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { LEADERSHIP_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(LEADERSHIP_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={LEADERSHIP_BLUEPRINT} />;
}
