import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { SITE_CTAS, SITE_LEGAL_LINKS, SITE_NAV } from "@/constants/site-nav";

/**
 * Footer skeleton wired to the RFQ sitemap. Social links and final legal
 * wording come from Telecel (Site settings in the CMS) — none are invented here.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-7">
          <div className="col-span-2 space-y-4">
            <Logo />
            <div className="flex flex-col gap-1 text-sm">
              <Link href={SITE_CTAS.talkToSales.href} className="font-medium text-brand hover:underline">
                {SITE_CTAS.talkToSales.label}
              </Link>
              <Link href={SITE_CTAS.requestDemo.href} className="text-muted-foreground hover:text-foreground">
                {SITE_CTAS.requestDemo.label}
              </Link>
            </div>
          </div>
          {SITE_NAV.map((section) => (
            <div key={section.href} className="space-y-3">
              <h2 className="font-heading text-sm font-semibold">
                <Link href={section.href} className="hover:text-brand">
                  {section.label}
                </Link>
              </h2>
              {section.children ? (
                <ul className="space-y-1.5">
                  {section.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Telecel Global. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {SITE_LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
