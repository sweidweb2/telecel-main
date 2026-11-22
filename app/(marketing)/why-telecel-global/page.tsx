import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { WhyTelecelPage } from "@/components/marketing/why-telecel-page";
import { WHY_TELECEL_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(WHY_TELECEL_BLUEPRINT);

export default function Page() {
  return <WhyTelecelPage config={WHY_TELECEL_BLUEPRINT} />;
}
