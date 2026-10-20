import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { SignalMotif } from "@/components/brand/signal-motif";
import { SITE_CTAS, SITE_LEGAL_LINKS, SITE_NAV } from "@/constants/site-nav";

/**
 * Charcoal footer: reversed logo, sales routes, full sitemap, one narrow
 * motif strip at the far edge. Social links and legal wording come from
 * Telecel (CMS Site settings); none are invented here.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-charcoal text-charcoal-foreground">
      <div className="container-site relative flex gap-10 py-16 lg:py-20">
        <div className="min-w-0 flex-1">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-4">
              <Logo variant="reversed" size="lg" />
              <div className="grid gap-1">
                <p className="type-notation text-charcoal-muted">Work with us</p>
                <Link
                  href={SITE_CTAS.talkToSales.href}
                  className="group flex min-h-11 items-center gap-2 font-heading text-2xl font-medium text-white"
                >
                  <span className="size-2 rounded-full bg-brand" aria-hidden />
                  <span className="underline-offset-[6px] group-hover:underline">
                    {SITE_CTAS.talkToSales.label}
                  </span>
                </Link>
                <Link
                  href={SITE_CTAS.requestDemo.href}
                  className="flex min-h-11 items-center pl-4 font-heading text-2xl font-medium text-charcoal-foreground/80 underline-offset-[6px] hover:text-white hover:underline"
                >
                  {SITE_CTAS.requestDemo.label}
                </Link>
              </div>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8"
            >
              {SITE_NAV.map((section) => (
                <div key={section.href} className="space-y-4">
                  <h2 className="font-sans text-sm font-semibold text-white">
                    <Link href={section.href} className="hover:underline">
                      {section.label}
                    </Link>
                  </h2>
                  {section.children ? (
                    <ul className="space-y-2.5">
                      {section.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="text-sm leading-5 text-charcoal-muted transition-colors duration-150 hover:text-white"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal-muted">
              © {new Date().getFullYear()} Telecel Global. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-6">
              {SITE_LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-charcoal-muted hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <SignalMotif tone="dark" rows={8} className="hidden h-auto w-16 self-start lg:block" />
      </div>
    </footer>
  );
}
