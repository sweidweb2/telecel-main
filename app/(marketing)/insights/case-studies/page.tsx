import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { CtaSection } from "@/components/marketing/cta-section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { CASE_STUDIES_BLUEPRINT } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export const metadata = blueprintMetadata(CASE_STUDIES_BLUEPRINT);

/** Case studies publish only once a customer clears them (RFQ §4.3). */
export default function Page() {
  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          <Text variant="brand">{CASE_STUDIES_BLUEPRINT.eyebrow}</Text>
          <Heading level="display" as="h1" className="mt-5 max-w-[20ch]">
            {CASE_STUDIES_BLUEPRINT.title}
          </Heading>
          <Text variant="lead" className="mt-5 max-w-[56ch]">
            {CASE_STUDIES_BLUEPRINT.description}
          </Text>
        </Container>
      </header>
      <section aria-label="Case studies">
        <Container className="py-16 lg:py-24">
          <div className="max-w-[56ch] border-t pt-8">
            <Text variant="lead">
              We publish case studies once our customers approve them. Until
              then, the latest news and perspectives are on Insights.
            </Text>
            <Link
              href={ROUTES.insights}
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-brand-hover underline-offset-4 hover:underline"
            >
              Read Insights
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </Container>
      </section>
      <CtaSection />
    </main>
  );
}
