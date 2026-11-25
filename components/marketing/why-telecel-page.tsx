import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/marketing/cta-section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { approvedClaims } from "@/constants/evidence";
import { SERVICE_PILLAR_PAGES } from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";
import { DIFFERENTIATORS, LEADERS } from "@/constants/why-telecel";
import type { PageBlueprintConfig } from "@/types/marketing-blueprint";

function PageHeader({ config }: { config: PageBlueprintConfig }) {
  return (
    <header className="border-b bg-surface">
      <Container className="py-12 sm:py-14 lg:py-20">
        {config.eyebrow ? <Text variant="brand">{config.eyebrow}</Text> : null}
        <Heading
          level="display"
          as="h1"
          className="mt-5 max-w-[22ch] text-balance"
        >
          {config.title}
        </Heading>
        {config.description ? (
          <Text variant="lead" className="mt-5 max-w-[56ch]">
            {config.description}
          </Text>
        ) : null}
      </Container>
    </header>
  );
}

/** Why Telecel Global: approach, reach (approved evidence only), leadership. */
export function WhyTelecelPage({ config }: { config: PageBlueprintConfig }) {
  const claims = approvedClaims();
  return (
    <main>
      <PageHeader config={config} />

      <section
        id="approach"
        aria-labelledby="why-approach"
        className="scroll-mt-28 border-b"
      >
        <Container className="grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <Heading level="section" as="h2" id="why-approach">
              Our approach
            </Heading>
          </div>
          <ol className="border-t lg:col-span-8">
            {DIFFERENTIATORS.map((item) => (
              <li
                key={item.title}
                className="grid gap-1 border-b py-6 sm:grid-cols-12 sm:gap-6"
              >
                <h3 className="text-lg font-medium sm:col-span-5">
                  {item.title}
                </h3>
                <p className="text-muted-foreground sm:col-span-7">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        id="global-reach"
        aria-labelledby="why-reach"
        className="scroll-mt-28 border-b bg-neutral-950 text-white"
      >
        <Container className="py-16 lg:py-24">
          <p className="font-mono text-xs tracking-wide text-white/70 uppercase">
            Global reach
          </p>
          <h2
            id="why-reach"
            className="mt-6 max-w-[22ch] font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl"
          >
            One relationship for the services you run across borders.
          </h2>
          {claims.length > 0 ? (
            <dl className="mt-12 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {claims.map((claim) => (
                <div key={claim.id}>
                  <dt className="font-mono text-xs tracking-wide text-white/70 uppercase">
                    {claim.label}
                  </dt>
                  <dd className="mt-2 font-heading text-4xl">{claim.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <ul className="mt-12 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
              {SERVICE_PILLAR_PAGES.map((page) => (
                <li
                  key={page.slug}
                  className="border-b border-white/15 py-5 text-white/85 sm:pr-6 lg:border-b-0 lg:border-l lg:px-5 lg:first:border-l-0 lg:first:pl-0"
                >
                  {page.title}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {LEADERS.length > 0 ? (
        <section aria-labelledby="why-leadership">
          <Container className="grid gap-6 py-16 lg:grid-cols-12 lg:items-end lg:py-24">
            <div className="lg:col-span-8">
              <Heading level="section" as="h2" id="why-leadership">
                The people accountable for delivery
              </Heading>
              <Text variant="lead" className="mt-4 max-w-[52ch]">
                Meet the leadership team connecting customers, markets and
                operations.
              </Text>
            </div>
            <Link
              href={ROUTES.leadership}
              className="inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline lg:col-span-4 lg:justify-self-end"
            >
              View leadership
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </Container>
        </section>
      ) : null}

      <CtaSection />
    </main>
  );
}

/** Leadership: profile grid once supplied; an honest holding state before. */
export function LeadershipPage({ config }: { config: PageBlueprintConfig }) {
  return (
    <main>
      <PageHeader config={config} />
      <section aria-label="Leadership profiles">
        <Container className="py-16 lg:py-24">
          {LEADERS.length > 0 ? (
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {LEADERS.map((leader) => (
                <li key={leader.name} className="border-t pt-6">
                  <h2 className="text-xl font-medium">{leader.name}</h2>
                  <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {leader.role}
                  </p>
                  <p className="mt-4 text-muted-foreground">{leader.bio}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-[56ch] border-t pt-8">
              <Text variant="lead">
                Leadership profiles are being finalised. Our team can introduce
                the right people for your conversation.
              </Text>
              <Link
                href={`${ROUTES.contact}?intent=sales`}
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-brand-hover underline-offset-4 hover:underline"
              >
                Contact us
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            </div>
          )}
        </Container>
      </section>
      <CtaSection />
    </main>
  );
}
