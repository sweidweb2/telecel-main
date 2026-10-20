import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { SITE_CTAS, SITE_NAV } from "@/constants/site-nav";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

export const metadata = buildMarketingMetadata({
  path: "/",
  title: SITE_NAME,
  description: SITE_TAGLINE,
});

/**
 * Temporary home. The conversion-led homepage (hero film, service pillars,
 * buyer routes, proof, CTAs) is built in the Public Pages front-end task from
 * the approved V11/V11.1 direction and Telecel text pack.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-10 px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm font-medium tracking-wide text-brand uppercase">
          {SITE_NAME}
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {SITE_TAGLINE}
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link href={SITE_CTAS.talkToSales.href} className={cn(buttonVariants({ size: "lg" }))}>
            {SITE_CTAS.talkToSales.label}
          </Link>
          <Link
            href={SITE_CTAS.requestDemo.href}
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {SITE_CTAS.requestDemo.label}
          </Link>
        </div>
      </div>
      <nav aria-label="Sections" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SITE_NAV.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border p-5 transition-colors hover:border-brand/40 hover:bg-muted/40"
          >
            <span className="font-heading font-semibold">{section.label}</span>
            {section.children ? (
              <span className="mt-1 block text-sm text-muted-foreground">
                {section.children.map((child) => child.label).join(" · ")}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </main>
  );
}
