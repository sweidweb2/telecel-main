import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { HomePage } from "@/components/marketing/home-page";
import { HOME_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(HOME_BLUEPRINT);

export default function Page() {
  return <HomePage />;
}
