import Link from "next/link";

import { SignalMotif } from "@/components/brand/signal-motif";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { SITE_CTAS } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

type TalkToSalesSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  tone?: "default" | "surface";
  className?: string;
  /** Show Request a Demo beside Talk to Sales (home conversion band). */
  showRequestDemo?: boolean;
  /** Decorative signal motif beside the copy (home conversion band). */
  showMotif?: boolean;
};

/** Shared conversion band used on hub and home pages. */
export function TalkToSalesSection({
  id = "cta",
  title = "Talk to Sales",
  description = "Route serious buyers into the inquiry flow for wholesale, messaging and platform conversations.",
  tone = "surface",
  className,
  showRequestDemo = false,
  showMotif = false,
}: TalkToSalesSectionProps) {
  return (
    <Section id={id} tone={tone} className={className}>
      <div className={cn("flex items-stretch gap-8", showMotif && "lg:gap-16")}>
        {showMotif ? (
          <SignalMotif rows={6} className="hidden h-48 w-auto sm:block" />
        ) : null}
        <div
          className={cn(
            "flex flex-1 flex-col justify-center gap-6",
            showMotif
              ? "sm:gap-8 lg:flex-row lg:items-end lg:justify-between"
              : "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div>
            <Heading level={showMotif ? "section" : "title"} as="h2">
              {title}
            </Heading>
            <Text
              variant={showMotif ? "lead" : "muted"}
              className={cn(
                "mt-2 max-w-[42ch]",
                showMotif && "mt-4 max-w-[52ch]",
              )}
            >
              {description}
            </Text>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href={SITE_CTAS.talkToSales.href}
              className={cn(
                buttonVariants({ size: "cta" }),
                "w-full rounded-full sm:w-auto",
              )}
            >
              {SITE_CTAS.talkToSales.label}
            </Link>
            {showRequestDemo ? (
              <Link
                href={SITE_CTAS.requestDemo.href}
                className={cn(
                  buttonVariants({ size: "cta", variant: "ink-outline" }),
                  "w-full rounded-full bg-background sm:w-auto",
                )}
              >
                {SITE_CTAS.requestDemo.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
