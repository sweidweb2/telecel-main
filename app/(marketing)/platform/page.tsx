import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { CtaSection } from "@/components/marketing/cta-section";
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

      <section
        id="overview"
        aria-labelledby="platform-overview"
        className="scroll-mt-28 border-b"
      >
        <Container className="grid gap-6 py-14 lg:grid-cols-12 lg:py-20">
          <h2
            id="platform-overview"
            className="font-mono text-xs tracking-wide text-muted-foreground uppercase lg:col-span-3"
          >
            Platform overview
          </h2>
          <p className="font-heading text-2xl leading-snug text-balance sm:text-3xl lg:col-span-9">
            One integrated service model across five layers, so connectivity,
            messaging, cloud, IoT and security are designed, delivered and run
            by a single team.
          </p>
        </Container>
      </section>

      <PlatformLayers />

      <section aria-labelledby="platform-model" className="border-t">
        <Container className="py-14 lg:py-20">
          <Heading level="section" as="h2" id="platform-model">
            How we work
          </Heading>
          <ol className="mt-10 border-t">
            {PLATFORM_STAGES.map((stage, index) => (
              <li
                key={stage.key}
                id={stage.key}
                className="grid scroll-mt-28 gap-2 border-b py-8 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="font-mono text-xs text-muted-foreground sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-2xl sm:col-span-4">
                  {stage.title}
                </h3>
                <div className="sm:col-span-7">
                  <p className="text-lg">{stage.blueprintNote}</p>
                  <p className="mt-2 text-muted-foreground">{stage.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaSection />
    </main>
  );
}
