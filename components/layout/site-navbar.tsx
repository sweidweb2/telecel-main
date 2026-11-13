import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SiteNavDesktop } from "@/components/layout/site-nav-desktop";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE_CTAS, SITE_NAV } from "@/constants/site-nav";

/**
 * Marketing header shell (Server Component). Interactive pieces are islands:
 * desktop active state + mobile Sheet. Nav data comes from the slim
 * `site-nav` → `marketing-pages` catalog, never `page-blueprints`.
 */
export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex h-[72px] items-center gap-8 min-[75rem]:h-[88px]">
        <Link
          href={ROUTES.home}
          aria-label="Telecel Global home"
          className="shrink-0"
        >
          <Logo size="md" priority />
        </Link>

        <SiteNavDesktop items={SITE_NAV} />

        <div className="ml-auto hidden items-center gap-3 min-[75rem]:flex">
          <Link
            href={ROUTES.login}
            className={buttonVariants({ size: "cta", variant: "ink-outline" })}
          >
            Login
          </Link>
          <Link
            href={SITE_CTAS.talkToSales.href}
            className={buttonVariants({ size: "cta" })}
          >
            {SITE_CTAS.talkToSales.label}
          </Link>
        </div>

        <SiteMobileNav
          items={SITE_NAV}
          talkToSales={SITE_CTAS.talkToSales}
          requestDemo={SITE_CTAS.requestDemo}
        />
      </Container>
    </header>
  );
}
