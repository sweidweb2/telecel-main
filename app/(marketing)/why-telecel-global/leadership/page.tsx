import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { LeadershipPage } from "@/components/marketing/why-telecel-page";
import { LEADERSHIP_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(LEADERSHIP_BLUEPRINT);

export default function Page() {
  return <LeadershipPage config={LEADERSHIP_BLUEPRINT} />;
}
