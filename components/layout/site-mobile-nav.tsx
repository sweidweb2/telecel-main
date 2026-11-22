"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, MenuIcon } from "lucide-react";

import { Logo } from "@/components/brand/logo";
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
import { isNavActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

type Cta = { label: string; href: string };

type SiteMobileNavProps = {
  items: readonly SiteNavSection[];
  talkToSales: Cta;
  requestDemo: Cta;
};

/**
 * Mobile menu island — Sheet + pathname only.
 * Prefetch off: sheet lists hubs and children; avoid warming every static route.
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
          <SheetHeader className="h-[72px] flex-row items-center justify-between gap-3 border-b px-5 pr-14">
            <Link
              href={ROUTES.home}
              aria-label="Telecel Global Services home"
              onClick={() => setOpen(false)}
              className="inline-flex shrink-0 items-center"
            >
              <Logo size="sm" />
            </Link>
            <SheetTitle className="type-notation text-muted-foreground">
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col overflow-y-auto px-5"
          >
            {items.map((item) => (
              <div key={item.href} className="border-b">
                <Link
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  aria-current={
                    isNavActive(pathname, item.href) ? "page" : undefined
                  }
                  className="flex min-h-16 items-center justify-between text-ink aria-[current=page]:text-brand"
                >
                  <Heading level="subtitle" as="span" className="text-xl">
                    {item.label}
                  </Heading>
                  <ArrowRightIcon className="size-5 text-muted-foreground" />
                </Link>
                {item.children?.length ? (
                  <ul className="mb-4 space-y-1 pb-2 pl-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          prefetch={false}
                          onClick={() => setOpen(false)}
                          aria-current={
                            isNavActive(pathname, child.href)
                              ? "page"
                              : undefined
                          }
                          className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-brand"
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
