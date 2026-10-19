import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MarketingCta = {
  href: string;
  label: string;
  variant?: "default" | "outline" | "ghost";
};

type MarketingPageShellProps = {
  title: string;
  description: string;
  /** Optional note under body (e.g. Telecel content pending). */
  note?: string;
  ctas?: MarketingCta[];
  children?: ReactNode;
};

export function MarketingPageShell({
  title,
  description,
  note,
  ctas,
  children,
}: MarketingPageShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="max-w-2xl space-y-4 sm:space-y-6">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
        {note ? (
          <p className="text-sm text-muted-foreground/80 italic">{note}</p>
        ) : null}
        {ctas && ctas.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {ctas.map((cta) => (
              <Link
                key={`${cta.href}-${cta.label}`}
                href={cta.href}
                className={cn(
                  buttonVariants({ variant: cta.variant ?? "default" }),
                  "min-h-11 w-full sm:w-auto"
                )}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {children ? <div className="mt-10 w-full lg:mt-12">{children}</div> : null}
    </main>
  );
}
