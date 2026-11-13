import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { BlueprintSection } from "@/components/marketing/page-blueprint";
import { PlatformLayers } from "@/components/marketing/platform-layers";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { PLATFORM_BLUEPRINT } from "@/constants/page-blueprints";
import { PLATFORM_STAGES } from "@/constants/platform-stages";

export const metadata = blueprintMetadata(PLATFORM_BLUEPRINT);

export default function Page() {
  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          <Text variant="brand">{PLATFORM_BLUEPRINT.eyebrow}</Text>
          <Heading level="display" as="h1" className="mt-4 max-w-[22ch]">
            {PLATFORM_BLUEPRINT.title}
          </Heading>
          <Text variant="lead" className="mt-5 max-w-[56ch]">
            {PLATFORM_BLUEPRINT.description}
          </Text>
        </Container>
      </header>

      <BlueprintSection
        id="overview"
        title="Platform overview"
        note="Integrated service model across the five layers."
        tone="default"
      />

      <PlatformLayers />

      {PLATFORM_STAGES.map((stage, index) => (
        <BlueprintSection
          key={stage.key}
          id={stage.key}
          title={`How we work — ${stage.title}`}
          note={stage.blueprintNote}
          tone={index % 2 === 0 ? "surface" : "default"}
        />
      ))}
    </main>
  );
}
