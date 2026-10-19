"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import type { SiteNavLabels } from "@/components/layout/site-nav-labels";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LOCALES, type Locale } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";
import { swapLocaleInPath } from "@/lib/i18n/path";
import { cn } from "@/lib/utils";

type SiteNavbarProps = {
  locale: Locale;
  labels: SiteNavLabels;
  /** When true, show Dashboard; otherwise the primary Apply CTA. */
  isAuthenticated?: boolean;
};

function isNavActive(pathname: string, href: string, locale: Locale) {
  return (
    pathname === href ||
    (href !== `/${locale}` && pathname.startsWith(`${href}/`))
  );
}

function LanguageToggle({
  locale,
  pathname,
  groupLabel,
  className,
  onLinkClick,
}: {
  locale: Locale;
  pathname: string;
  groupLabel: string;
  className?: string;
  onLinkClick?: () => void;
}) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={groupLabel}
    >
      {LOCALES.map((loc) => {
        const href = swapLocaleInPath(pathname || `/${locale}`, loc);
        const isActive = loc === locale;
        return (
          <Link
            key={loc}
            href={href}
            hrefLang={loc}
            onClick={onLinkClick}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center px-1.5 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",
              isActive &&
                "font-bold text-foreground underline underline-offset-4",
            )}
            aria-current={isActive ? "true" : undefined}
          >
            {loc}
          </Link>
        );
      })}
    </div>
  );
}

export function SiteNavbar({
  locale,
  labels,
  isAuthenticated = false,
}: SiteNavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dashboardHref = labels.dashboard?.href ?? ROUTES.dashboard;
  const applyHref = labels.apply.href;
  const dashboardLabel = labels.dashboard?.label ?? "Dashboard";
  const applyLabel = labels.apply.label;
  const menuLabel = labels.menuLabel ?? (locale === "fr" ? "Menu" : "Menu");

  const isCtaActive = isAuthenticated
    ? pathname.startsWith(dashboardHref)
    : isNavActive(pathname, applyHref, locale);

  const ctaLink = (
    <Link
      href={isAuthenticated ? dashboardHref : applyHref}
      onClick={() => setOpen(false)}
      aria-current={isCtaActive ? "page" : undefined}
      className={cn(
        buttonVariants({ size: "sm" }),
        "min-h-11 w-full justify-center lg:min-h-8 lg:w-auto",
        // Keep primary colors when selected — `bg-muted` washed out the CTA.
        isCtaActive &&
          "bg-primary font-semibold text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background hover:bg-primary/90",
      )}
    >
      {isAuthenticated ? dashboardLabel : applyLabel}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto grid h-14 w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        {labels.brand ? (
          <Link
            href={labels.items[0]?.href ?? `/${locale}`}
            className="font-heading shrink-0 text-sm font-semibold tracking-tight"
          >
            {labels.brand}
          </Link>
        ) : (
          <div className="hidden lg:block" aria-hidden />
        )}

        {/* Desktop navigation — centered link group */}
        <nav
          className="hidden min-w-0 items-center justify-center gap-3 lg:flex xl:gap-4"
          aria-label="Primary"
        >
          {labels.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                isNavActive(pathname, item.href, locale) &&
                  "bg-muted font-semibold",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          <LanguageToggle
            locale={locale}
            pathname={pathname}
            groupLabel={labels.languageGroupLabel}
          />
          <div className="flex shrink-0 items-center border-l pl-2">
            {ctaLink}
          </div>
        </div>

        {/* Mobile / tablet: menu only — language lives in the sheet */}
        <div className="col-start-3 flex items-center justify-end lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "min-h-11 min-w-11",
              )}
              aria-label={menuLabel}
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-sm">
              <SheetHeader className="border-b">
                <SheetTitle>{menuLabel}</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
                aria-label="Primary"
              >
                {labels.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-11 justify-start",
                      isNavActive(pathname, item.href, locale) &&
                        "bg-muted font-semibold",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <div className="flex flex-col gap-2 px-1 py-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {labels.languageGroupLabel}
                  </p>
                  <LanguageToggle
                    locale={locale}
                    pathname={pathname}
                    groupLabel={labels.languageGroupLabel}
                    onLinkClick={() => setOpen(false)}
                  />
                </div>
                <div className="my-2 border-t" />
                <div className="flex flex-col gap-1">{ctaLink}</div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
