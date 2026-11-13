import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { LEGAL_BLUEPRINTS } from "@/constants/page-blueprints";

const config = LEGAL_BLUEPRINTS.find((page) => page.path === "/terms")!;

export const metadata = blueprintMetadata(config);

export default function Page() {
  return <BlueprintPage config={config} />;
}
