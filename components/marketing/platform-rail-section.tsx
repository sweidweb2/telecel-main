import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PlatformRail } from "@/components/marketing/platform-rail";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

type PlatformRailSectionProps = {
  className?: string;
};

/** Connect → Optimize band for the platform hub. */
export function PlatformRailSection({ className }: PlatformRailSectionProps) {
  return (
    <Section id="how-we-work" tone="default" bleed className={className}>
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[40rem] text-center lg:mx-0 lg:max-w-none lg:text-left">
          <Text variant="notation">How we work</Text>
          <Heading level="section" as="h2" className="mt-3">
            Connect → Optimize
          </Heading>
          <Text variant="lead" className="mx-auto mt-4 max-w-[48ch] lg:mx-0">
            One operating sequence from first connection through ongoing
            improvement — not a stack of disconnected vendors.
          </Text>
        </div>
        <div className="mt-10 lg:mt-14">
          <PlatformRail />
        </div>
      </Container>
    </Section>
  );
}
