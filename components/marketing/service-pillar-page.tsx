import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/marketing/cta-section";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";
import {
  SERVICE_PILLARS,
  pillarContactHref,
  type ServicePillar,
} from "@/constants/service-pillars";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Service pillar landing: hero, editorial index of sub-services, who it is
 * for, sibling pillars, and a CTA that pre-fills the inquiry form.
 */
export function ServicePillarPage({
  pillar,
  title,
  description,
}: {
  pillar: ServicePillar;
  title: string;
  description?: string;
}) {
  const contactHref = pillarContactHref(pillar.slug);
  const buyers = SOLUTION_PAGES.filter((page) =>
    pillar.buyers.includes(page.slug),
  );
  const siblings = SERVICE_PILLAR_PAGES.filter(
    (page) => page.slug !== pillar.slug,
  );

  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="grid gap-10 py-12 sm:py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                <li>
                  <Link
                    href={ROUTES.services}
                    className="hover:text-foreground"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">
                  {title}
                </li>
              </ol>
            </nav>
            <Heading level="display" as="h1" className="mt-5 max-w-[20ch]">
              {title}
            </Heading>
            {description ? (
              <Text variant="lead" className="mt-5 max-w-[52ch]">
                {description}
              </Text>
            ) : null}
          </div>
          <div className="grid content-end gap-6 border-t border-hairline pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <dl className="text-sm">
              <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                Built for
              </dt>
              <dd className="mt-1">{buyers.map((b) => b.title).join(", ")}</dd>
            </dl>
            <Link
              href={contactHref}
              className={cn(
                buttonVariants({ size: "cta" }),
                "w-full rounded-full sm:w-auto sm:justify-self-start",
              )}
            >
              {pillar.ctaLabel}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        </Container>
      </header>

      <section aria-labelledby="pillar-intro" className="border-b">
        <Container className="grid gap-6 py-14 lg:grid-cols-12 lg:py-20">
          <h2
            id="pillar-intro"
            className="font-mono text-xs tracking-wide text-muted-foreground uppercase lg:col-span-3"
          >
            Overview
          </h2>
          <p className="font-heading text-2xl leading-snug text-balance sm:text-3xl lg:col-span-9">
            {pillar.intro}
          </p>
        </Container>
      </section>

      <section aria-labelledby="pillar-index">
        <Container className="py-14 lg:py-20">
          <Heading level="section" as="h2" id="pillar-index">
            What&apos;s included
          </Heading>
          <ol className="mt-10 border-t">
            {pillar.subServices.map((service, index) => (
              <li
                key={service.name}
                className="grid gap-2 border-b py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="font-mono text-xs text-muted-foreground sm:col-span-2">
                  {pillar.code}-{pad(index + 1)}
                </span>
                <h3 className="text-lg font-medium sm:col-span-4">
                  {service.name}
                </h3>
                <p className="text-muted-foreground sm:col-span-6">
                  {service.summary}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="pillar-buyers" className="border-t bg-surface">
        <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <Heading level="section" as="h2" id="pillar-buyers">
              Who it&apos;s for
            </Heading>
          </div>
          <ul className="border-t lg:col-span-8">
            {buyers.map((buyer) => (
              <li key={buyer.slug} className="border-b">
                <Link
                  href={marketingChildPath(ROUTES.solutions, buyer.slug)}
                  className="group flex min-h-16 items-center justify-between gap-4 py-4 text-lg font-medium hover:text-brand"
                >
                  {buyer.title}
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none motion-reduce:group-hover:translate-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <nav aria-label="Other services" className="border-t">
        <Container className="py-10">
          <h2 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Other services
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            {siblings.map((page) => (
              <li key={page.slug}>
                <Link
                  href={marketingChildPath(ROUTES.services, page.slug)}
                  className="inline-flex min-h-11 items-center gap-2 hover:text-brand"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {SERVICE_PILLARS[page.slug].code}
                  </span>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <CtaSection
        title={`Talk to us about ${title}`}
        description="Tell us the markets and outcome you need, and we will follow up with the right next step."
        primary={{ label: pillar.ctaLabel, href: contactHref }}
        secondary={null}
      />
    </main>
  );
}
