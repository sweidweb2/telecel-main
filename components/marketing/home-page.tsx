import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { SignalMotif } from "@/components/brand/signal-motif";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/marketing/contact-form";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { approvedClaims } from "@/constants/evidence";
import { DIFFERENTIATORS } from "@/constants/why-telecel";
import {
  BUYER_ROUTES,
  HOME_HERO,
  PLATFORM_STAGES,
} from "@/constants/home-content";
import {
  SERVICE_PILLAR_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";
import { SERVICE_PILLARS } from "@/constants/service-pillars";
import { SITE_CTAS } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

/**
 * PROVISIONAL outcome and differentiator lines — section headings follow the
 * RFQ text pack; these bodies must be replaced by approved copy.
 */
const OUTCOMES = [
  {
    title: "Enter new markets",
    body: "Reach customers and partners abroad without building every link yourself.",
  },
  {
    title: "Launch new services",
    body: "Add cloud, security, IoT or messaging to what you already sell.",
  },
  {
    title: "Protect operations",
    body: "Keep networks, data and traffic secure as you connect more of them.",
  },
  {
    title: "Simplify suppliers",
    body: "Replace a stack of vendors with one accountable relationship.",
  },
  {
    title: "Grow revenue from connectivity",
    body: "Turn network assets into digital products and wholesale income.",
  },
] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function HomePage() {
  const claims = approvedClaims();

  return (
    <main>
      {/* Hero — headline left, the five-pillar service line as an index right. */}
      <section aria-labelledby="home-title" className="border-b bg-surface">
        <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="lg:col-span-7">
            <Text variant="brand">{HOME_HERO.eyebrow}</Text>
            <Heading
              id="home-title"
              level="display"
              as="h1"
              className="mt-5 max-w-[18ch] text-balance"
            >
              {HOME_HERO.title}
            </Heading>
            <Text variant="lead" className="mt-6 max-w-[52ch]">
              {HOME_HERO.body}
            </Text>
            <p className="mt-6 font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Cloud · Security · IoT · Connectivity · Voice &amp; Messaging
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.services}
                className={cn(buttonVariants({ size: "cta" }), "rounded-full")}
              >
                Explore Services
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <Link
                href={SITE_CTAS.talkToSales.href}
                className={cn(
                  buttonVariants({ variant: "ink-outline", size: "cta" }),
                  "rounded-full",
                )}
              >
                {SITE_CTAS.talkToSales.label}
              </Link>
            </div>
          </div>
          <SignalMotif className="hidden self-center text-ink/25 lg:col-span-4 lg:col-start-9 lg:block" />
        </Container>
      </section>

      {/* 01 Customer challenge */}
      <section aria-labelledby="home-challenge" className="border-b">
        <Container className="grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-3">
            <SectionLabel>The challenge</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <h2
              id="home-challenge"
              className="font-heading text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl"
            >
              Move faster with one accountable technology partner.
            </h2>
            <Text variant="lead" className="mt-6 max-w-[60ch]">
              Growing across markets usually means a different supplier for
              every network, cloud, security and messaging need. We bring them
              under one relationship, so there is one team to call and one plan
              to follow.
            </Text>
          </div>
        </Container>
      </section>
      {/* Service pillar module */}
      <section aria-labelledby="home-pillars" className="border-b">
        <Container className="py-16 lg:py-24">
          <SectionLabel>Services</SectionLabel>
          <h2
            id="home-pillars"
            className="mt-6 max-w-[24ch] font-heading text-3xl leading-tight sm:text-4xl"
          >
            International capability. One managed experience.
          </h2>
          <ul className="mt-10 border-t">
            {SERVICE_PILLAR_PAGES.map((page) => (
              <li key={page.slug} className="border-b">
                <Link
                  href={marketingChildPath(ROUTES.services, page.slug)}
                  className="group grid gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <span className="text-xl font-medium group-hover:text-brand sm:col-span-5">
                    {page.title}
                  </span>
                  <span className="text-muted-foreground sm:col-span-6">
                    {SERVICE_PILLARS[page.slug].intro}
                  </span>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="size-5 justify-self-end text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none motion-reduce:group-hover:translate-0 sm:col-span-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Outcomes */}
      <section aria-labelledby="home-outcomes" className="border-b">
        <Container className="grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <SectionLabel>Outcomes</SectionLabel>
            <h2
              id="home-outcomes"
              className="mt-6 font-heading text-3xl leading-tight sm:text-4xl"
            >
              Built around how your business grows.
            </h2>
          </div>
          <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {OUTCOMES.map((outcome) => (
              <div
                key={outcome.title}
                className="border-t py-6 sm:last:col-span-2"
              >
                <dt className="text-lg font-medium">{outcome.title}</dt>
                <dd className="mt-2 text-muted-foreground">{outcome.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 03 Solutions by customer */}
      <section aria-labelledby="home-buyers" className="border-b bg-surface">
        <Container className="py-16 lg:py-24">
          <SectionLabel>Solutions by customer</SectionLabel>
          <h2
            id="home-buyers"
            className="mt-6 max-w-[24ch] font-heading text-3xl leading-tight sm:text-4xl"
          >
            Designed for the decisions you need to make.
          </h2>
          <ul className="mt-10 grid border-t sm:grid-cols-2">
            {BUYER_ROUTES.map((route) => (
              <li
                key={route.href}
                className="border-b sm:odd:border-r sm:odd:pr-8 sm:even:pl-8"
              >
                <Link
                  href={route.href}
                  className="group flex h-full flex-col gap-3 py-8"
                >
                  <span className="flex items-center justify-between gap-4 text-2xl font-medium group-hover:text-brand">
                    {route.title}
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none motion-reduce:group-hover:translate-0"
                    />
                  </span>
                  <span className="max-w-[44ch] text-muted-foreground">
                    {route.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 04 Delivery model — the page's signature: a five-step operating sequence. */}
      <section
        aria-labelledby="home-delivery"
        className="border-b bg-neutral-950 text-white"
      >
        <Container className="py-16 lg:py-24">
          <p className="flex items-center gap-3 font-mono text-xs tracking-wide text-white/70 uppercase">
            Delivery model
          </p>
          <h2
            id="home-delivery"
            className="mt-6 max-w-[20ch] font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl"
          >
            From complexity to execution.
          </h2>
          <ol className="mt-12 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
            {PLATFORM_STAGES.map((stage, index) => (
              <li
                key={stage.key}
                className="border-b border-white/15 py-6 sm:pr-6 lg:border-b-0 lg:border-l lg:px-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="font-mono text-xs text-white/70">
                  {pad(index + 1)}
                </span>
                <h3 className="mt-3 text-xl font-medium">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {stage.blueprintNote}
                </p>
              </li>
            ))}
          </ol>
          <Link
            href={ROUTES.platform}
            className="mt-10 inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            See how the platform works
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </Container>
      </section>

      {/* 05 Proof — approved claims only (RFQ §4.3). */}
      <section aria-labelledby="home-proof" className="border-b">
        <Container className="grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <SectionLabel>Proof</SectionLabel>
            <h2
              id="home-proof"
              className="mt-6 font-heading text-3xl leading-tight sm:text-4xl"
            >
              Built on operator experience. Designed for international growth.
            </h2>
            {claims.length > 0 ? (
              <dl className="mt-10 grid grid-cols-2 gap-6">
                {claims.map((claim) => (
                  <div key={claim.id}>
                    <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                      {claim.label}
                    </dt>
                    <dd className="mt-1 font-heading text-4xl">
                      {claim.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <Text variant="lead" className="max-w-[56ch] self-end lg:col-span-7">
            Telecel Global grew out of operator businesses. We design services
            the way carriers and enterprises buy and run them: clear scope,
            named owners and one commercial relationship.
          </Text>
        </Container>
      </section>

      {/* Why Telecel Global */}
      <section aria-labelledby="home-why" className="border-b">
        <Container className="grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <SectionLabel>Why Telecel Global</SectionLabel>
            <h2
              id="home-why"
              className="mt-6 font-heading text-3xl leading-tight sm:text-4xl"
            >
              What working with us looks like.
            </h2>
          </div>
          <ol className="border-t lg:col-span-7">
            {DIFFERENTIATORS.map((item) => (
              <li key={item.title} className="border-b py-5">
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-1 text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="home-inquiry" className="border-t bg-surface">
        <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="lg:col-span-5">
            <SectionLabel>Get started</SectionLabel>
            <h2
              id="home-inquiry"
              className="mt-6 max-w-[16ch] font-heading text-3xl leading-tight sm:text-4xl"
            >
              Ready to connect the next opportunity?
            </h2>
            <Text variant="lead" className="mt-6 max-w-[42ch]">
              Tell us what you need and we will follow up with the right next
              step. Prefer a walkthrough? Choose “Request a Demo” in the form.
            </Text>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm sm:p-8 lg:col-span-7">
            <ContactForm sourcePath={ROUTES.home} />
          </div>
        </Container>
      </section>
    </main>
  );
}
