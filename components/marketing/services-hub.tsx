import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/marketing/cta-section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  SERVICE_PILLAR_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";
import { SERVICE_PILLARS } from "@/constants/service-pillars";
import type { PageBlueprintConfig } from "@/types/marketing-blueprint";

/**
 * Services hub: the five pillars as an editorial index. Each row shows its
 * code, positioning and the sub-services inside, so buyers can scan the whole
 * portfolio before choosing a pillar.
 */
export function ServicesHub({ config }: { config: PageBlueprintConfig }) {
  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          <Text variant="brand">{config.eyebrow}</Text>
          <Heading
            level="display"
            as="h1"
            className="mt-5 max-w-[20ch] text-balance"
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

      <section aria-labelledby="services-index">
        <Container className="py-14 lg:py-20">
          <h2 id="services-index" className="sr-only">
            Service pillars
          </h2>
          <ul className="border-t">
            {SERVICE_PILLAR_PAGES.map((page) => {
              const pillar = SERVICE_PILLARS[page.slug];
              return (
                <li key={page.slug} className="border-b">
                  <Link
                    href={marketingChildPath(ROUTES.services, page.slug)}
                    className="group grid gap-4 py-8 lg:grid-cols-12 lg:gap-6 lg:py-10"
                  >
                    <span className="font-mono text-xs tracking-wide text-muted-foreground lg:col-span-1 lg:pt-2">
                      {pillar.code}
                    </span>
                    <span className="lg:col-span-5">
                      <span className="flex items-start justify-between gap-4">
                        <span className="font-heading text-2xl leading-tight group-hover:text-brand sm:text-3xl">
                          {page.title}
                        </span>
                        <ArrowUpRightIcon
                          aria-hidden="true"
                          className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none motion-reduce:group-hover:translate-0 lg:hidden"
                        />
                      </span>
                      <span className="mt-3 block max-w-[52ch] text-muted-foreground">
                        {pillar.intro}
                      </span>
                    </span>
                    <span className="lg:col-span-4 lg:col-start-8">
                      <span className="sr-only">Includes: </span>
                      <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {pillar.subServices.map((service, index) => (
                          <span key={service.name}>
                            {service.name}
                            {index < pillar.subServices.length - 1 ? (
                              <span aria-hidden="true">,</span>
                            ) : null}
                          </span>
                        ))}
                      </span>
                    </span>
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className="hidden size-5 justify-self-end text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none motion-reduce:group-hover:translate-0 lg:col-span-1 lg:block lg:pt-2"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <CtaSection />
    </main>
  );
}
