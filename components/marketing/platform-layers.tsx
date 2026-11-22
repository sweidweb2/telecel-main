import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PlatformLayersInteractive } from "@/components/marketing/platform-layers-interactive";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

type PlatformLayersProps = {
  className?: string;
};

const LAYERS_HEADING_ID = "platform-layers-heading";

/**
 * Five platform layers section — server shell for copy; interactive stack
 * lives in a small client island so Container/Section stay out of the bundle.
 */
export function PlatformLayers({ className }: PlatformLayersProps) {
  return (
    <Section id="layers" tone="surface" bleed className={className}>
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[40rem] text-center lg:max-w-none">
          <Text variant="notation">Platform</Text>
          <Heading
            level="section"
            as="h2"
            id={LAYERS_HEADING_ID}
            className="mt-3"
          >
            Five platform layers
          </Heading>
          <Text variant="lead" className="mx-auto mt-4 max-w-[48ch]">
            Connectivity, messaging, cloud, IoT and security — one managed stack
            for operators, enterprises and partners.
          </Text>
        </div>

        <PlatformLayersInteractive labelledBy={LAYERS_HEADING_ID} />
      </Container>
    </Section>
  );
}
