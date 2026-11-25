import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/marketing/cta-section";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { contactHref, type Journey } from "@/constants/journeys";
import {
  SERVICE_PILLAR_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";
import { SERVICE_PILLARS } from "@/constants/service-pillars";
import { SITE_CTAS } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

type RelatedLink = { href: string; title: string };

const arrowClass =
  "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none motion-reduce:group-hover:translate-0";

/**
 * Buyer (Solutions) and outcome (Use Cases) detail page: hero, narrative,
 * priority service routes, related pages and a pre-filled CTA.
 */
export function JourneyPage({
  hub,
  title,
  description,
  intro,
  journey,
  related,
  relatedLabel,
  showDemo = false,
}: {
  hub: { href: string; label: string };
  title: string;
  description?: string;
  intro: string;
  journey: Journey;
  related: readonly RelatedLink[];
  relatedLabel: string;
  showDemo?: boolean;
}) {
  const primaryHref = contactHref(journey.pillars[0]);
  const pillars = journey.pillars.map((slug) =>
    SERVICE_PILLAR_PAGES.find((page) => page.slug === slug)!,
  );

  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
              <li>
                <Link href={hub.href} className="hover:text-foreground">
                  {hub.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {title}
              </li>
            </ol>
          </nav>
          <Heading
            level="display"
            as="h1"
            className="mt-5 max-w-[20ch] text-balance"
          >
            {title}
          </Heading>
          {description ? (
            <Text variant="lead" className="mt-5 max-w-[52ch]">
              {description}
            </Text>
          ) : null}
          <Link
            href={primaryHref}
            className={cn(
              buttonVariants({ size: "cta" }),
              "mt-8 w-full rounded-full sm:w-auto",
            )}
          >
            {journey.ctaLabel}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Container>
      </header>

      <section aria-labelledby="journey-intro" className="border-b">
        <Container className="grid gap-6 py-14 lg:grid-cols-12 lg:py-20">
          <h2
            id="journey-intro"
            className="font-mono text-xs tracking-wide text-muted-foreground uppercase lg:col-span-3"
          >
            Overview
          </h2>
          <p className="font-heading text-2xl leading-snug text-balance sm:text-3xl lg:col-span-9">
            {intro}
          </p>
        </Container>
      </section>

      <section aria-labelledby="journey-services">
        <Container className="py-14 lg:py-20">
          <Heading level="section" as="h2" id="journey-services">
            Where to start
          </Heading>
          <ol className="mt-10 border-t">
            {pillars.map((page) => (
              <li key={page.slug} className="border-b">
                <Link
                  href={marketingChildPath(ROUTES.services, page.slug)}
                  className="group grid gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <span className="font-mono text-xs text-muted-foreground sm:col-span-1">
                    {SERVICE_PILLARS[page.slug].code}
                  </span>
                  <span className="text-xl font-medium group-hover:text-brand sm:col-span-4">
                    {page.title}
                  </span>
                  <span className="text-muted-foreground sm:col-span-6">
                    {SERVICE_PILLARS[page.slug].intro}
                  </span>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className={cn(
                      arrowClass,
                      "size-5 sm:col-span-1 sm:justify-self-end",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="journey-related" className="border-t">
          <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
            <div className="lg:col-span-4">
              <Heading level="section" as="h2" id="journey-related">
                {relatedLabel}
              </Heading>
            </div>
            <ul className="border-t lg:col-span-8">
              {related.map((item) => (
                <li key={item.href} className="border-b">
                  <Link
                    href={item.href}
                    className="group flex min-h-16 items-center justify-between gap-4 py-4 text-lg font-medium hover:text-brand"
                  >
                    {item.title}
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className={arrowClass}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CtaSection
        title="Tell us the outcome you need."
        description="Share your markets and goals, and we will follow up with the right next step."
        primary={{ label: journey.ctaLabel, href: primaryHref }}
        secondary={
          showDemo
            ? {
                label: SITE_CTAS.requestDemo.label,
                href: contactHref(journey.pillars[0], "demo"),
              }
            : null
        }
      />
    </main>
  );
}

/** Hub index (Solutions / Use Cases): an editorial list of child pages. */
export function JourneyIndex({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  items: readonly { href: string; title: string; summary?: string }[];
}) {
  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          <Text variant="brand">{eyebrow}</Text>
          <Heading
            level="display"
            as="h1"
            className="mt-5 max-w-[20ch] text-balance"
          >
            {title}
          </Heading>
          {description ? (
            <Text variant="lead" className="mt-5 max-w-[52ch]">
              {description}
            </Text>
          ) : null}
        </Container>
      </header>
      <section aria-label={`${eyebrow} index`}>
        <Container className="py-14 lg:py-20">
          <ul className="border-t">
            {items.map((item) => (
              <li key={item.href} className="border-b">
                <Link
                  href={item.href}
                  className="group grid gap-2 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <span className="font-heading text-2xl group-hover:text-brand sm:col-span-5 sm:text-3xl">
                    {item.title}
                  </span>
                  <span className="text-muted-foreground sm:col-span-6">
                    {item.summary}
                  </span>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className={cn(
                      arrowClass,
                      "size-5 sm:col-span-1 sm:justify-self-end",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaSection />
    </main>
  );
}
