"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, MenuIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";
import type { SiteNavSection } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Cta = { label: string; href: string };

type SiteMobileNavProps = {
  items: readonly SiteNavSection[];
  talkToSales: Cta;
  requestDemo: Cta;
};

/**
 * Mobile menu island — Sheet + pathname only.
 * Prefetch off: sheet lists every hub; avoid warming all static routes on open.
 */
export function SiteMobileNav({
  items,
  talkToSales,
  requestDemo,
}: SiteMobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="ml-auto min-[75rem]:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className={cn(
            buttonVariants({ variant: "ink-outline", size: "cta" }),
            "px-4",
          )}
          aria-label="Open menu"
        >
          <MenuIcon className="size-5" />
          Menu
        </SheetTrigger>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="h-[72px] justify-center border-b px-5">
            <SheetTitle className="type-notation text-muted-foreground">
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col overflow-y-auto px-5"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                aria-current={
                  isNavActive(pathname, item.href) ? "page" : undefined
                }
                className="flex min-h-16 items-center justify-between border-b text-ink aria-[current=page]:text-brand"
              >
                <Heading level="subtitle" as="span" className="text-xl">
                  {item.label}
                </Heading>
                <ArrowRightIcon className="size-5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 border-t p-5">
            <Link
              href={talkToSales.href}
              prefetch={false}
              onClick={() => setOpen(false)}
              className={buttonVariants({ size: "cta" })}
            >
              {talkToSales.label}
            </Link>
            <Link
              href={requestDemo.href}
              prefetch={false}
              onClick={() => setOpen(false)}
              className={buttonVariants({
                size: "cta",
                variant: "ink-outline",
              })}
            >
              {requestDemo.label}
            </Link>
            <Link
              href={ROUTES.login}
              prefetch={false}
              onClick={() => setOpen(false)}
              className={buttonVariants({
                size: "cta",
                variant: "ink-outline",
              })}
            >
              Login
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
