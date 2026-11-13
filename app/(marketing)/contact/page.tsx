import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { CONTACT_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(CONTACT_BLUEPRINT);

export default function Page() {
  return <BlueprintPage config={CONTACT_BLUEPRINT} />;
}
