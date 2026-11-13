import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { SOLUTION_BLUEPRINTS } from "@/constants/page-blueprints";

const config = SOLUTION_BLUEPRINTS.find(
  (page) => page.path === "/solutions/wholesale-aggregators",
)!;

export const metadata = blueprintMetadata(config);

export default function Page() {
  return <BlueprintPage config={config} />;
}
