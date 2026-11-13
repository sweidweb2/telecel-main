import Link from "next/link";

import { ServicesProvideIllustration } from "@/components/marketing/services-provide-illustrations";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  SERVICES_PROVIDE,
  SERVICES_PROVIDE_CARDS,
} from "@/constants/services-provide";
import { cn } from "@/lib/utils";

type ServicesProvideSectionProps = {
  className?: string;
};

/**
 * Services hub “What We Provide” grid — six illustrated entry cards.
 */
export function ServicesProvideSection({
  className,
}: ServicesProvideSectionProps) {
  return (
    <Section
      id="pillars"
      className={cn("border-b-0 bg-white", className)}
      containerClassName="pt-0 sm:pt-0 lg:pt-0 pb-10 sm:pb-12 lg:pb-16"
    >
      <div className="mx-auto max-w-[40rem] text-center lg:mx-0 lg:max-w-none lg:text-left">
        <span className="inline-flex items-center rounded-full border border-brand/15 bg-brand/5 px-3 py-1 type-notation text-brand">
          {SERVICES_PROVIDE.eyebrow}
        </span>
        <Heading
          level="section"
          as="h2"
          className="mt-4 max-w-[22ch] text-balance lg:max-w-[28ch]"
        >
          {SERVICES_PROVIDE.title}
        </Heading>
        <Text variant="lead" className="mx-auto mt-4 max-w-[52ch] lg:mx-0">
          {SERVICES_PROVIDE.description}
        </Text>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
        {SERVICES_PROVIDE_CARDS.map((card) => (
          <li key={card.key} className="min-w-0">
            <Link
              href={card.href}
              className={cn(
                "services-provide-card group flex h-full flex-col overflow-hidden rounded-[20px] border border-hairline bg-white p-4 shadow-xs sm:p-5",
                "transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-standard)]",
                "hover:border-ink/15 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              )}
            >
              <ServicesProvideIllustration kind={card.key} />
              <div className="mt-4 flex flex-1 flex-col gap-1.5 px-0.5 pb-0.5">
                <Heading
                  level="label"
                  as="h3"
                  className="text-lg font-semibold tracking-tight"
                >
                  {card.title}
                </Heading>
                <Text variant="muted" className="text-sm leading-6">
                  {card.description}
                </Text>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
