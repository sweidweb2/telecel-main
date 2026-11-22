import Link from "next/link";

import { ServicesHeroDashboard } from "@/components/marketing/services-hero-dashboard";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { SERVICES_HERO } from "@/constants/services-hero";
import { cn } from "@/lib/utils";

/**
 * Services hub hero — full-bleed sky, centered headline, and a product
 * dashboard rising out of a cloud bank. Site chrome stays in `SiteNavbar`.
 *
 * Decorative layers use CSS blur only (no SVG feGaussianBlur) and
 * `contain-paint` so continuous cloud motion stays cheap on mobile GPUs.
 */
export function ServicesHero() {
  const [lineOne, lineTwo] = SERVICES_HERO.headline.split("\n");

  return (
    <section
      aria-labelledby="services-hero-heading"
      className="services-sky-hero relative isolate overflow-hidden"
    >
      <SkyBackdrop />
      <MidClouds />

      <div className="relative z-10 flex flex-col pt-10 sm:pt-12 lg:pt-14">
        <div className="mx-auto max-w-[720px] px-4 text-center">
          <Heading
            id="services-hero-heading"
            level="display"
            as="h1"
            className="services-hero-fade-up text-brand-foreground drop-shadow-[0_2px_24px_color-mix(in_oklch,var(--ink)_28%,transparent)] sm:text-[2.75rem] sm:leading-[1.05] lg:text-[3.75rem] lg:leading-[1.05] lg:tracking-[-0.03em]"
          >
            <span className="block">{lineOne}</span>
            <span className="block">{lineTwo}</span>
          </Heading>
          <Text
            variant="lead"
            className="services-hero-fade-up services-hero-fade-up-delay mx-auto mt-5 max-w-[600px] text-pretty text-brand-foreground/80"
          >
            {SERVICES_HERO.subtext}
          </Text>
          <div className="services-hero-fade-up services-hero-fade-up-delay-2 mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={SERVICES_HERO.primaryCta.href}
              className={cn(
                buttonVariants({ size: "cta" }),
                "w-full rounded-full bg-charcoal text-charcoal-foreground hover:bg-ink sm:w-auto",
              )}
            >
              {SERVICES_HERO.primaryCta.label}
            </Link>
            <Link
              href={SERVICES_HERO.secondaryCta.href}
              className={cn(
                buttonVariants({ size: "cta", variant: "ghost" }),
                "w-full rounded-full border border-brand-foreground/35 bg-brand-foreground/10 text-brand-foreground backdrop-blur-sm hover:bg-brand-foreground/18 hover:text-brand-foreground sm:w-auto",
              )}
            >
              {SERVICES_HERO.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-10 w-full max-w-[1140px] px-3 pb-12 sm:mt-12 sm:px-6 sm:pb-14 lg:mt-14 lg:pb-16">
          <ServicesHeroDashboard className="services-hero-dashboard-rise" />
        </div>
      </div>

      <BottomCloudBank />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-linear-to-b from-transparent via-background/80 to-background sm:h-14"
        aria-hidden
      />
    </section>
  );
}

function SkyBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,var(--brand-hover)_0%,var(--brand)_28%,color-mix(in_oklch,var(--brand)_28%,var(--surface))_62%,var(--surface)_82%,var(--background)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--brand-foreground)_18%,transparent),transparent_55%)]"
        aria-hidden
      />
    </>
  );
}

/** Soft painterly wisps behind the headline — CSS-only, paint-contained. */
function MidClouds() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[18%] z-[1] h-[42%] overflow-hidden contain-paint"
      aria-hidden
    >
      <div className="services-cloud-drift absolute -left-[8%] top-[10%] h-40 w-[55%] rounded-[100%] bg-brand-foreground/25 blur-2xl sm:h-52 sm:blur-3xl" />
      <div className="services-cloud-drift-slow absolute left-[35%] top-[28%] h-36 w-[50%] rounded-[100%] bg-brand-foreground/20 blur-2xl sm:h-44 sm:blur-[40px]" />
      <div className="services-cloud-drift absolute right-[-10%] top-[8%] h-44 w-[48%] rounded-[100%] bg-background/35 blur-2xl sm:h-56 sm:blur-3xl" />
    </div>
  );
}

/** Thick fluffy bank covering the lower third of the dashboard. */
function BottomCloudBank() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[240px] contain-paint sm:h-[270px] lg:h-[300px]"
      aria-hidden
    >
      <div className="absolute inset-x-0 bottom-0 h-full">
        <div className="services-cloud-bank absolute -left-[12%] bottom-[18%] h-36 w-[72%] rounded-[100%] bg-background/80 blur-xl sm:h-44 sm:blur-2xl md:blur-3xl" />
        <div className="services-cloud-bank-alt absolute left-[16%] bottom-[8%] h-40 w-[78%] rounded-[100%] bg-background/85 blur-xl sm:h-52 sm:blur-2xl md:blur-3xl" />
        <div className="services-cloud-bank absolute -right-[14%] bottom-[20%] h-36 w-[68%] rounded-[100%] bg-background/80 blur-xl sm:h-48 sm:blur-2xl md:blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-background via-background/88 to-transparent" />
      </div>
      {/* Hard silhouette — no SVG filter; soft edges come from the CSS blobs above. */}
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-background"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cloudFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="35%" stopColor="currentColor" stopOpacity="0.75" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g fill="url(#cloudFade)">
          <ellipse cx="120" cy="175" rx="230" ry="88" />
          <ellipse cx="360" cy="150" rx="210" ry="98" />
          <ellipse cx="580" cy="180" rx="250" ry="92" />
          <ellipse cx="820" cy="145" rx="220" ry="104" />
          <ellipse cx="1060" cy="170" rx="240" ry="95" />
          <ellipse cx="1300" cy="160" rx="210" ry="90" />
          <ellipse cx="200" cy="228" rx="190" ry="70" />
          <ellipse cx="700" cy="238" rx="300" ry="76" />
          <ellipse cx="1180" cy="222" rx="230" ry="72" />
          <rect x="0" y="222" width="1440" height="110" />
        </g>
      </svg>
    </div>
  );
}
