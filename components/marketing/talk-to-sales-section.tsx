import Link from "next/link";

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
};

/** Shared conversion band used on hub pages. */
export function TalkToSalesSection({
  id = "cta",
  title = "Talk to Sales",
  description = "Route serious buyers into the inquiry flow for wholesale, messaging and platform conversations.",
  tone = "surface",
  className,
}: TalkToSalesSectionProps) {
  return (
    <Section id={id} tone={tone} className={className}>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level="title" as="h2">
            {title}
          </Heading>
          <Text variant="muted" className="mt-2 max-w-[42ch]">
            {description}
          </Text>
        </div>
        <Link
          href={SITE_CTAS.talkToSales.href}
          className={cn(
            buttonVariants({ size: "cta" }),
            "w-full rounded-full sm:w-auto",
          )}
        >
          {SITE_CTAS.talkToSales.label}
        </Link>
      </div>
    </Section>
  );
}
