import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/constants/locales";
import { publicPath } from "@/constants/routes";
import type { MarketingPageCopy } from "@/types/marketing-page";
import { cn } from "@/lib/utils";

type FaqCtaSectionProps = {
  locale: Locale;
  copy: MarketingPageCopy;
};

export function FaqCtaSection({ locale, copy }: FaqCtaSectionProps) {
  const cta = copy.ctaSection;
  if (!cta) return null;

  return (
    <section className="rounded-2xl border bg-muted/40 px-6 py-10 text-center sm:px-10 sm:py-12">
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {cta.title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
        {cta.description}
      </p>
      <Link
        href={publicPath(locale, cta.slug)}
        className={cn(
          buttonVariants(),
          "mt-8 inline-flex min-h-11 w-full sm:w-auto",
        )}
      >
        {cta.label}
      </Link>
    </section>
  );
}
