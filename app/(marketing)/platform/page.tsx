import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { PLATFORM_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(PLATFORM_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={PLATFORM_BLUEPRINT} />;
}
