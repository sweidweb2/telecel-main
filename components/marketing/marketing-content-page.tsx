import Link from "next/link";

import { AboutPageContent } from "@/components/marketing/about-page-content";
import { ApplyPageContent } from "@/components/marketing/apply-page-content";
import { FaqPageContent } from "@/components/marketing/faq-page-content";
import { ProgrammePageContent } from "@/components/marketing/programme-page-content";
import { PageHero, Section, SectionHeading } from "@/components/marketing/page-elements";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/constants/locales";
import { marketingCopyFor } from "@/constants/marketing-copy";
import { publicPath } from "@/constants/routes";
import type { MarketingContentSlug } from "@/types/marketing-page";
import { localeUrl } from "@/lib/seo/alternates";
import { cn } from "@/lib/utils";

export function MarketingContentPage({ locale, slug }: { locale: Locale; slug: MarketingContentSlug }) {
  const copy = marketingCopyFor(locale, slug);
  const structuredData =
    slug === ""
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Africa Startup Initiative Program",
          alternateName: "ASIP",
          url: localeUrl(locale),
          description: copy.description,
          parentOrganization: {
            "@type": "Organization",
            name: "Telecel Group",
          },
        }
      : slug === "faq"
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: copy.cards.map((card) => ({
              "@type": "Question",
              name: card.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: card.description,
              },
            })),
          }
        : null;

  if (slug === "faq") {
    return (
      <main>
        {structuredData ? <JsonLd data={structuredData} /> : null}
        <FaqPageContent locale={locale} copy={copy} />
      </main>
    );
  }

  if (slug === "about") {
    return <AboutPageContent locale={locale} copy={copy} />;
  }

  if (slug === "programme") {
    return <ProgrammePageContent locale={locale} copy={copy} />;
  }

  if (slug === "apply") {
    return <ApplyPageContent locale={locale} copy={copy} />;
  }

  return (
    <main>
      {structuredData ? <JsonLd data={structuredData} /> : null}
      <PageHero eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <Section>
        <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">{copy.notice}</p>
        <div className="mt-10">
          <SectionHeading
            title={copy.sectionTitle}
            description={copy.sectionDescription}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.cards.map((card) => (
              <article key={card.title} className="rounded-xl border p-5 sm:p-6">
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
    </main>
  );
}
