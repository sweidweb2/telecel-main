import Link from "next/link";
import type { ComponentType } from "react";

import type { SiteFooterLabels } from "@/components/layout/site-footer-labels";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  labels: SiteFooterLabels;
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 fill-current", className)}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 fill-current", className)}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 fill-current", className)}
    >
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186 31.247 31.247 0 000 12.017a31.247 31.247 0 00.502 5.831 3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136A31.247 31.247 0 0024 12.017a31.247 31.247 0 00-.502-5.831zM9.545 15.568V8.466l6.273 3.551-6.273 3.551z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  LinkedIn: LinkedInIcon,
  X: XIcon,
  YouTube: YouTubeIcon,
};

function FooterLinkList({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-sm font-semibold tracking-tight">
        {heading}
      </h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ labels }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <p className="font-heading text-base font-semibold tracking-tight">
              {labels.brand}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground text-pretty">
              {labels.tagline}
            </p>
            <div className="space-y-2">
              <p className="font-heading text-sm font-semibold tracking-tight">
                {labels.socialHeading}
              </p>
              <div className="flex flex-wrap gap-1">
                {labels.social.map((item) => {
                  const Icon = SOCIAL_ICONS[item.label];
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "min-h-11 min-w-11"
                      )}
                    >
                      {Icon ? <Icon className="size-4" /> : item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <FooterLinkList
            heading={labels.exploreHeading}
            links={labels.explore}
          />
          <FooterLinkList
            heading={labels.programmeHeading}
            links={labels.programme}
          />
          <FooterLinkList
            heading={labels.connectHeading}
            links={labels.connect}
          />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{labels.copyright}</p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            {labels.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
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
