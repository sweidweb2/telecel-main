import Link from "next/link";

import { ApplyForm } from "@/components/marketing/apply-form";
import { applyLabelsFor } from "@/components/marketing/apply-labels";
import {
  PageHero,
  Section,
  SectionHeading,
} from "@/components/marketing/page-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/constants/locales";
import { publicPath } from "@/constants/routes";
import type { MarketingPageCopy } from "@/types/marketing-page";
import { cn } from "@/lib/utils";

type ApplyPageContentProps = {
  locale: Locale;
  copy: MarketingPageCopy;
};

export function ApplyPageContent({ locale, copy }: ApplyPageContentProps) {
  const labels = applyLabelsFor(locale);

  return (
    <main>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <Section>
        {copy.notice ? (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {copy.notice}
          </p>
        ) : null}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{labels.formTitle}</CardTitle>
            <CardDescription>{labels.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplyForm locale={locale} labels={labels} />
          </CardContent>
        </Card>

        <div className="mt-10">
          <SectionHeading
            title={copy.sectionTitle}
            description={copy.sectionDescription}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                buttonVariants({ variant: "outline" }),
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
