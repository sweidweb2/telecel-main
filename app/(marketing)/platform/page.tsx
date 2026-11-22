import {
  MarketingPageHeader,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { PlatformLayers } from "@/components/marketing/platform-layers";
import { PlatformRailSection } from "@/components/marketing/platform-rail-section";
import { TalkToSalesSection } from "@/components/marketing/talk-to-sales-section";
import { PLATFORM_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(PLATFORM_BLUEPRINT);

export default function Page() {
  return (
    <main>
      <MarketingPageHeader
        eyebrow={PLATFORM_BLUEPRINT.eyebrow}
        title={PLATFORM_BLUEPRINT.title}
        description={PLATFORM_BLUEPRINT.description}
      />
      <PlatformLayers />
      <PlatformRailSection />
      <TalkToSalesSection />
    </main>
  );
}
