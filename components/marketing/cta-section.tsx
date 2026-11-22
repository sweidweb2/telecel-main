import Link from "next/link";
import { useId } from "react";
import { ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { SITE_CTAS } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

type CtaLink = { label: string; href: string };

type CtaSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primary?: CtaLink;
  secondary?: CtaLink | null;
  className?: string;
};

/**
 * Reusable closing call-to-action band for public pages. Defaults route to
 * the contact form (Talk to Sales / Request a Demo); every field can be
 * overridden per page.
 */
export function CtaSection({
  eyebrow = "Work with us",
  title = "Ready to connect what comes next?",
  description = "Tell us the outcome you need and we will route you to the right Telecel Global team.",
  primary = SITE_CTAS.talkToSales,
  secondary = SITE_CTAS.requestDemo,
  className,
}: CtaSectionProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn("border-t bg-surface", className)}
    >
      <Container className="relative grid gap-8 overflow-hidden py-14 lg:grid-cols-12 lg:items-center lg:py-20">
        <div className="lg:col-span-7">
          <Text variant="brand">{eyebrow}</Text>
          <Heading
            id={headingId}
            level="section"
            as="h2"
            className="mt-4 max-w-[22ch]"
          >
            {title}
          </Heading>
          <Text variant="lead" className="mt-4 max-w-[52ch]">
            {description}
          </Text>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <Link
            href={primary.href}
            className={cn(
              buttonVariants({ size: "cta" }),
              "w-full rounded-full sm:w-auto",
            )}
          >
            {primary.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className={cn(
                buttonVariants({ variant: "ink-outline", size: "cta" }),
                "w-full rounded-full sm:w-auto",
              )}
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
