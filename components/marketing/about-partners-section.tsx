import Link from "next/link";

import { SectionHeading } from "@/components/marketing/page-elements";
import { LogoCloudGrid } from "@/components/ui/logo-cloud";
import { buttonVariants } from "@/components/ui/button";
import { PARTNER_LOGOS } from "@/constants/partner-logos";
import type { Locale } from "@/constants/locales";
import type { PublicPageSlug } from "@/constants/public-pages";
import { publicPath } from "@/constants/routes";
import { cn } from "@/lib/utils";

type AboutPartnersSectionProps = {
  locale: Locale;
  section: {
    eyebrow?: string;
    title: string;
    description?: string;
  };
  cta?: {
    slug: PublicPageSlug;
    label: string;
    hash?: string;
  };
};

function partnerCtaHref(
  locale: Locale,
  cta: NonNullable<AboutPartnersSectionProps["cta"]>,
) {
  const base = publicPath(locale, cta.slug);
  return cta.hash ? `${base}#${cta.hash}` : base;
}

export function AboutPartnersSection({
  locale,
  section,
  cta,
}: AboutPartnersSectionProps) {
  return (
    <section
      id="partners"
      className="scroll-mt-20 border-t bg-background py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
        />

        <LogoCloudGrid logos={PARTNER_LOGOS} />

        {cta ? (
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              href={partnerCtaHref(locale, cta)}
              className={cn(buttonVariants(), "min-h-11 w-full sm:w-auto")}
            >
              {cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
