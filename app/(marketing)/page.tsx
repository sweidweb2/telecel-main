import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { HOME_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(HOME_BLUEPRINT);

export default function HomePage() {
  return <BlueprintPage config={HOME_BLUEPRINT} />;
}
