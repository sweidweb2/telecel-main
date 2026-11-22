import { ServicesHero } from "@/components/marketing/services-hero";
import { ServicesProvideSection } from "@/components/marketing/services-provide-section";
import { TalkToSalesSection } from "@/components/marketing/talk-to-sales-section";
import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { SERVICES_HUB_BLUEPRINT } from "@/constants/page-blueprints";

export const metadata = marketingPageMetadata(SERVICES_HUB_BLUEPRINT);

export default function Page() {
  return (
    <main>
      <ServicesHero />
      <ServicesProvideSection />
      <TalkToSalesSection />
    </main>
  );
}
