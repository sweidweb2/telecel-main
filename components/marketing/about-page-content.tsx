import { AboutNarrativeSections } from "@/components/marketing/about-narrative-sections";
import { AboutPartnersSection } from "@/components/marketing/about-partners-section";
import { PageHero, Section } from "@/components/marketing/page-elements";
import type { Locale } from "@/constants/locales";
import type { MarketingPageCopy } from "@/types/marketing-page";

type AboutPageContentProps = {
  locale: Locale;
  copy: MarketingPageCopy;
};

export function AboutPageContent({ locale, copy }: AboutPageContentProps) {
  return (
    <main>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      {copy.aboutNarrative ? (
        <Section className="border-t py-14 sm:py-16 lg:py-20">
          <AboutNarrativeSections locale={locale} narrative={copy.aboutNarrative} />
        </Section>
      ) : null}

      {copy.partnersSection ? (
        <AboutPartnersSection
          locale={locale}
          section={copy.partnersSection}
          cta={copy.cta}
        />
      ) : null}
    </main>
  );
}
