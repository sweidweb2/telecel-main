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

/** Soft painterly wisps behind the headline. */
function MidClouds() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[18%] z-[1] h-[42%] overflow-hidden"
      aria-hidden
    >
      <div className="services-cloud-drift absolute -left-[8%] top-[10%] h-40 w-[55%] rounded-[100%] bg-brand-foreground/25 blur-3xl sm:h-52" />
      <div className="services-cloud-drift-slow absolute left-[35%] top-[28%] h-36 w-[50%] rounded-[100%] bg-brand-foreground/20 blur-[40px] sm:h-44" />
      <div className="services-cloud-drift absolute right-[-10%] top-[8%] h-44 w-[48%] rounded-[100%] bg-background/35 blur-3xl sm:h-56" />
      <svg
        className="absolute inset-0 size-full text-brand-foreground opacity-70"
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id="wispBlur" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <g
          filter="url(#wispBlur)"
          className="services-cloud-drift"
          fill="currentColor"
          fillOpacity="0.45"
        >
          <ellipse cx="220" cy="160" rx="180" ry="48" />
          <ellipse cx="320" cy="140" rx="120" ry="36" />
          <ellipse cx="160" cy="180" rx="100" ry="30" />
        </g>
        <g
          filter="url(#wispBlur)"
          className="services-cloud-drift-slow"
          fill="currentColor"
          fillOpacity="0.35"
        >
          <ellipse cx="900" cy="120" rx="200" ry="52" />
          <ellipse cx="1040" cy="150" rx="140" ry="40" />
          <ellipse cx="780" cy="160" rx="110" ry="34" />
        </g>
        <g filter="url(#wispBlur)" fill="currentColor" fillOpacity="0.28">
          <ellipse cx="1280" cy="200" rx="160" ry="44" />
          <ellipse cx="1180" cy="220" rx="100" ry="28" />
        </g>
      </svg>
    </div>
  );
}

/** Thick fluffy bank covering the lower third of the dashboard. */
function BottomCloudBank() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[240px] sm:h-[270px] lg:h-[300px]"
      aria-hidden
    >
      <div className="absolute inset-x-0 bottom-0 h-full">
        <div className="services-cloud-bank absolute -left-[12%] bottom-[18%] h-36 w-[72%] rounded-[100%] bg-background/80 blur-2xl sm:h-44 sm:blur-3xl" />
        <div className="services-cloud-bank-alt absolute left-[16%] bottom-[8%] h-40 w-[78%] rounded-[100%] bg-background/85 blur-2xl sm:h-52 sm:blur-3xl" />
        <div className="services-cloud-bank absolute -right-[14%] bottom-[20%] h-36 w-[68%] rounded-[100%] bg-background/80 blur-2xl sm:h-48 sm:blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-background via-background/88 to-transparent" />
      </div>
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-background"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="fluffBlur" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
          <linearGradient id="cloudFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
            <stop offset="18%" stopColor="currentColor" stopOpacity="0.38" />
            <stop offset="40%" stopColor="currentColor" stopOpacity="0.72" />
            <stop offset="65%" stopColor="currentColor" stopOpacity="0.94" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g filter="url(#fluffBlur)" fill="url(#cloudFade)">
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
