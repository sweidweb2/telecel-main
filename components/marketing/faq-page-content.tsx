import { FaqCtaSection } from "@/components/marketing/faq-cta-section";
import { FaqTabsSection } from "@/components/marketing/faq-tabs-section";
import FaqSection from "@/components/ui/habit-faq-scroller";
import { Section } from "@/components/marketing/page-elements";
import type { Locale } from "@/constants/locales";
import { buildFaqScrollerData } from "@/lib/marketing/build-faq-scroller-data";
import type { MarketingPageCopy } from "@/types/marketing-page";

type FaqPageContentProps = {
  locale: Locale;
  copy: MarketingPageCopy;
};

export function FaqPageContent({ locale, copy }: FaqPageContentProps) {
  return (
    <>
      <Section className="pt-10 pb-8 sm:pt-12 sm:pb-10">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {copy.description}
          </p>
        </header>
        <FaqSection data={buildFaqScrollerData(copy)} />
      </Section>

      <Section className="border-t py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:items-start md:gap-8 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0 md:sticky md:top-20">
            <h2 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
              {copy.tabsSectionTitle ?? "Browse by topic"}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {copy.tabsSectionDescription}
            </p>
          </div>
          <div className="min-w-0">
            <FaqTabsSection copy={copy} />
          </div>
        </div>
      </Section>

      <Section className="border-t pb-16 sm:pb-20 lg:pb-24">
        <FaqCtaSection locale={locale} copy={copy} />
      </Section>
    </>
  );
}
