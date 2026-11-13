import Link from "next/link";

import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { ServicesHero } from "@/components/marketing/services-hero";
import { ServicesProvideSection } from "@/components/marketing/services-provide-section";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { buttonVariants } from "@/components/ui/button";
import { SERVICES_HUB_BLUEPRINT } from "@/constants/page-blueprints";
import { SITE_CTAS } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

export const metadata = blueprintMetadata(SERVICES_HUB_BLUEPRINT);

export default function Page() {
  return (
    <>
      <ServicesHero />

      <ServicesProvideSection />

      <Section id="cta" tone="surface">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading level="title" as="h2">
              Talk to Sales
            </Heading>
            <Text variant="muted" className="mt-2 max-w-[42ch]">
              Route serious buyers into the inquiry flow for wholesale,
              messaging and platform conversations.
            </Text>
          </div>
          <Link
            href={SITE_CTAS.talkToSales.href}
            className={cn(
              buttonVariants({ size: "cta" }),
              "w-full rounded-full sm:w-auto",
            )}
          >
            {SITE_CTAS.talkToSales.label}
          </Link>
        </div>
      </Section>
    </>
  );
}
