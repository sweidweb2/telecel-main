"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";
import { SITE_CTAS, SITE_NAV } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Public header skeleton wired to the RFQ sitemap. Mega-menu / sub-navigation
 * styling belongs to the Public Pages front-end task.
 */
export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={ROUTES.home} aria-label="Telecel Global home" className="shrink-0">
          <Logo />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isNavActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                isNavActive(pathname, item.href) && "text-brand"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            href={SITE_CTAS.requestDemo.href}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {SITE_CTAS.requestDemo.label}
          </Link>
          <Link href={SITE_CTAS.talkToSales.href} className={buttonVariants({ size: "sm" })}>
            {SITE_CTAS.talkToSales.label}
          </Link>
        </div>

        <div className="ml-auto lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "min-h-11 min-w-11")}
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-sm">
              <SheetHeader className="border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Primary">
                {SITE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-11 justify-start",
                      isNavActive(pathname, item.href) && "text-brand"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <Link
                  href={SITE_CTAS.talkToSales.href}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "h-11")}
                >
                  {SITE_CTAS.talkToSales.label}
                </Link>
                <Link
                  href={SITE_CTAS.requestDemo.href}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "h-11")}
                >
                  {SITE_CTAS.requestDemo.label}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
