import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { SERVICE_PILLAR_BLUEPRINTS } from "@/constants/page-blueprints";

const config = SERVICE_PILLAR_BLUEPRINTS.find(
  (page) => page.path === "/services/interactions-voice-messaging",
)!;

export const metadata = blueprintMetadata(config);

export default function Page() {
  return <BlueprintPage config={config} />;
}
