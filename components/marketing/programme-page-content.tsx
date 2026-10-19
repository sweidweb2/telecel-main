import Link from "next/link";

import { PageHero, Section, SectionHeading } from "@/components/marketing/page-elements";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/constants/locales";
import { publicPath } from "@/constants/routes";
import type { MarketingPageCopy } from "@/types/marketing-page";
import { cn } from "@/lib/utils";

type ProgrammePageContentProps = {
  locale: Locale;
  copy: MarketingPageCopy;
};

export function ProgrammePageContent({
  locale,
  copy,
}: ProgrammePageContentProps) {
  const impact = copy.impactSection;

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border p-5 sm:p-6"
              >
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  {card.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {card.description}
                </p>
              </article>
            ))}
          </div>

          {copy.cta ? (
            <Link
              href={publicPath(locale, copy.cta.slug)}
              className={cn(
                buttonVariants(),
                "mt-8 min-h-11 w-full sm:w-auto",
              )}
            >
              {copy.cta.label}
            </Link>
          ) : null}
        </div>
      </Section>

      {impact ? (
        <Section id="impact" className="scroll-mt-20 border-t pb-16 sm:pb-20">
          <SectionHeading
            eyebrow={impact.eyebrow}
            title={impact.title}
            description={impact.description}
          />
          {impact.notice ? (
            <p className="mb-8 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              {impact.notice}
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {impact.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border p-5 sm:p-6"
              >
                <h3 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}
    </main>
  );
}
