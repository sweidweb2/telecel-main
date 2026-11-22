import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { SignalMotif } from "@/components/brand/signal-motif";
import { Container } from "@/components/layout/container";
import { PlatformRail } from "@/components/marketing/platform-rail";
import { ServicePortfolioDiagram } from "@/components/marketing/service-portfolio-diagram";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { BUYER_ROUTES, HOME_HERO } from "@/constants/home-content";
import { ROUTES } from "@/constants/routes";
import { SITE_CTAS, SITE_NAV } from "@/constants/site-nav";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

export const metadata = buildMarketingMetadata({
  path: ROUTES.home,
  title: SITE_NAME,
  description: SITE_TAGLINE,
});

const useCases =
  SITE_NAV.find((section) => section.href === ROUTES.useCases)?.children ?? [];

/**
 * Foundation homepage in the "Connected Energies" system. The production
 * homepage (approved V11/V11.1 direction + hero film) replaces the hero
 * diagram slot; section order follows the RFQ: pillars, outcomes, buyer
 * routes, delivery model, proof, CTAs. All copy is provisional.
 */
export default function HomePage() {
  return (
    <main>
      <section>
        <Container className="grid gap-14 py-14 lg:grid-cols-12 lg:gap-6 lg:py-24">
          <div className="lg:col-span-7 lg:pr-12">
            <Text variant="brand">{HOME_HERO.eyebrow}</Text>
            <Heading
              level="display"
              as="h1"
              className="mt-5 max-w-[18ch] text-balance"
            >
              {HOME_HERO.title}
            </Heading>
            <Text variant="lead" className="mt-6 max-w-[56ch]">
              {HOME_HERO.body}
            </Text>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href={SITE_CTAS.talkToSales.href}
                className={cn(
                  buttonVariants({ size: "cta" }),
                  "w-full sm:w-auto",
                )}
              >
                {SITE_CTAS.talkToSales.label}
                <ArrowRightIcon />
              </Link>
              <Link
                href={SITE_CTAS.requestDemo.href}
                className={cn(
                  buttonVariants({ size: "cta", variant: "ink-outline" }),
                  "w-full sm:w-auto",
                )}
              >
                {SITE_CTAS.requestDemo.label}
              </Link>
            </div>
          </div>
          <ServicePortfolioDiagram className="lg:col-span-5 lg:pt-4" />
        </Container>
      </section>

      <section className="border-t bg-surface">
        <Container className="py-14 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-12">
            <Text variant="notation" className="lg:col-span-3">
              Platform
            </Text>
            <div className="lg:col-span-9">
              <Heading level="section" className="max-w-[20ch]">
                One Global B2B Platform, five stages
              </Heading>
            </div>
          </div>
          <PlatformRail className="mt-12" />
        </Container>
      </section>

      <section>
        <Container className="py-14 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-12">
            <Text variant="notation" className="lg:col-span-3">
              Solutions
            </Text>
            <Heading level="section" className="max-w-[18ch] lg:col-span-9">
              Built around the way you buy
            </Heading>
          </div>
          <div className="mt-12 grid lg:grid-cols-12">
            <ul className="border-t lg:col-span-9 lg:col-start-4">
              {BUYER_ROUTES.map((route, index) => (
                <li key={route.href} className="border-b">
                  <Link
                    href={route.href}
                    className="group grid min-h-24 grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 outline-none focus-visible:bg-surface md:grid-cols-[2.5rem_minmax(0,22rem)_1fr_auto]"
                  >
                    <span className="type-notation text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Heading
                      level="subtitle"
                      as="span"
                      className="text-xl md:text-2xl"
                    >
                      {route.title}
                    </Heading>
                    <span className="hidden text-sm leading-6 text-muted-foreground md:block">
                      {route.summary}
                    </span>
                    <span
                      aria-hidden
                      className="flex size-11 items-center justify-center rounded-full border border-hairline transition-colors duration-150 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground"
                    >
                      <ArrowUpRightIcon className="size-5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t">
        <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <Text variant="notation" className="lg:col-span-3">
            Use cases
          </Text>
          <div className="lg:col-span-9">
            <Heading level="section" className="max-w-[20ch]">
              Start from the outcome you need
            </Heading>
            <Text variant="lead" className="mt-4 max-w-[56ch]">
              Each use case brings together the services and solutions behind
              one business goal.
            </Text>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
            {useCases.map((useCase) => (
              <li key={useCase.href} className="border-b">
                <Link
                  href={useCase.href}
                  className="group flex min-h-16 items-center justify-between gap-4 py-3 text-lg text-ink outline-none"
                >
                  <span className="underline-offset-4 group-hover:underline group-focus-visible:underline">
                    {useCase.label}
                  </span>
                  <ArrowRightIcon className="size-4 text-muted-foreground transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t bg-surface">
        <Container className="flex items-stretch gap-8 py-14 lg:gap-16 lg:py-20">
          <SignalMotif rows={6} className="hidden h-48 w-auto sm:block" />
          <div className="flex flex-1 flex-col justify-center gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Heading level="section" className="max-w-[18ch]">
                Talk to the team behind the platform
              </Heading>
              <Text variant="lead" className="mt-4 max-w-[52ch]">
                Tell us what you need to connect, secure or launch. We route
                every request to the right specialists.
              </Text>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href={SITE_CTAS.talkToSales.href}
                className={cn(
                  buttonVariants({ size: "cta" }),
                  "w-full sm:w-auto",
                )}
              >
                {SITE_CTAS.talkToSales.label}
              </Link>
              <Link
                href={SITE_CTAS.requestDemo.href}
                className={cn(
                  buttonVariants({ size: "cta", variant: "ink-outline" }),
                  "w-full bg-background sm:w-auto",
                )}
              >
                {SITE_CTAS.requestDemo.label}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
