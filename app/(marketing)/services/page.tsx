import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { SERVICES_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(SERVICES_HUB_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={SERVICES_HUB_BLUEPRINT} />;
}
