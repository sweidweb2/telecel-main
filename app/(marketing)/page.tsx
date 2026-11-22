import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { HomePage } from "@/components/marketing/home-page";
import { HOME_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = blueprintMetadata(HOME_BLUEPRINT);

export default function Page() {
  return <HomePage />;
}
