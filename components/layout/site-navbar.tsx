"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, MenuIcon } from "lucide-react";

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
 * 88px opaque header: logo · six groups · red "Talk to Sales". Below 1200px
 * the groups move into a menu rather than compressing the labels.
 */
export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container-site flex h-[72px] items-center gap-8 min-[75rem]:h-[88px]">
        <Link href={ROUTES.home} aria-label="Telecel Global home" className="shrink-0">
          <Logo size="md" priority />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-7 min-[75rem]:flex"
        >
          {SITE_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[15px] font-medium text-ink/80 transition-colors duration-150 hover:text-ink",
                  "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-150",
                  "hover:after:scale-x-100",
                  active && "text-ink after:scale-x-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

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

        <div className="ml-auto min-[75rem]:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ink-outline", size: "cta" }),
                "px-4"
              )}
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
              Menu
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
              <SheetHeader className="h-[72px] justify-center border-b px-5">
                <SheetTitle className="type-notation text-muted-foreground">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Primary" className="flex flex-1 flex-col overflow-y-auto px-5">
                {SITE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isNavActive(pathname, item.href) ? "page" : undefined}
                    className="flex min-h-16 items-center justify-between border-b font-heading text-xl font-medium text-ink aria-[current=page]:text-brand"
                  >
                    {item.label}
                    <ArrowRightIcon className="size-5 text-muted-foreground" />
                  </Link>
                ))}
              </nav>
              <div className="grid gap-3 border-t p-5">
                <Link
                  href={SITE_CTAS.talkToSales.href}
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ size: "cta" })}
                >
                  {SITE_CTAS.talkToSales.label}
                </Link>
                <Link
                  href={SITE_CTAS.requestDemo.href}
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ size: "cta", variant: "ink-outline" })}
                >
                  {SITE_CTAS.requestDemo.label}
                </Link>
                <Link
                  href={ROUTES.login}
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ size: "cta", variant: "ink-outline" })}
                >
                  Login
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
