import Link from "next/link";

import { PageHero, Section, SectionHeading } from "@/components/marketing/page-elements";
import { PortfolioPagination } from "@/components/marketing/portfolio-pagination";
import { StartupCard } from "@/components/marketing/startup-card";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/constants/locales";
import { publicPath } from "@/constants/routes";
import { getPortfolioStartupsPage } from "@/data/portfolio-startups";
import type { MarketingPageCopy } from "@/types/marketing-page";
import { cn } from "@/lib/utils";

const PAGINATION_LABELS = {
  en: {
    showing: "Showing {from}–{to} of {total} startups",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    showing: "Affichage de {from} à {to} sur {total} startups",
    previous: "Précédent",
    next: "Suivant",
  },
} as const;

type PortfolioPageContentProps = {
  locale: Locale;
  copy: MarketingPageCopy;
  page: number;
};

export function PortfolioPageContent({
  locale,
  copy,
  page,
}: PortfolioPageContentProps) {
  const { items, total, totalPages, currentPage, pageSize } =
    getPortfolioStartupsPage(locale, page);
  const cta = copy.ctaSection;

  return (
    <main>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <Section className="border-t">
        <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {copy.notice}
        </p>

        <div className="mt-10 sm:mt-12">
          <SectionHeading
            title={copy.sectionTitle}
            description={copy.sectionDescription}
          />

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-8">
            {items.map((startup) => (
              <li key={startup.id} className="min-w-0">
                <StartupCard startup={startup} />
              </li>
            ))}
          </ul>

          <div className="mt-10 sm:mt-12">
            <PortfolioPagination
              locale={locale}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              labels={PAGINATION_LABELS[locale]}
            />
          </div>
        </div>
      </Section>

      {cta ? (
        <Section className="border-t pb-16 sm:pb-20 lg:pb-24">
          <section className="rounded-2xl border bg-muted/40 px-6 py-10 text-center sm:px-10 sm:py-12">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {cta.description}
            </p>
            <Link
              href={`${publicPath(locale, cta.slug)}${cta.hash ? `#${cta.hash}` : ""}`}
              className={cn(
                buttonVariants(),
                "mt-8 inline-flex min-h-11 w-full sm:w-auto",
              )}
            >
              {cta.label}
            </Link>
          </section>
        </Section>
      ) : null}
    </main>
  );
}
