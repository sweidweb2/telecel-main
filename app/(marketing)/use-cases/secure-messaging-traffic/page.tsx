import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import { USE_CASE_BLUEPRINTS } from "@/constants/page-blueprints";

const config = USE_CASE_BLUEPRINTS.find(
  (page) => page.path === "/use-cases/secure-messaging-traffic",
)!;

export const metadata = blueprintMetadata(config);

export default function Page() {
  return <BlueprintPage config={config} />;
}
