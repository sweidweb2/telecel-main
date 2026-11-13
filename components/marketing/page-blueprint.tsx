import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { BlueprintSectionConfig } from "@/types/marketing-blueprint";

export type { BlueprintSectionConfig };

type PageBlueprintProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  sections: readonly BlueprintSectionConfig[];
};

/**
 * Public-page wireframe: page title + named sections with skeleton blocks.
 * Replace section bodies with real modules during design/build.
 */
export function PageBlueprint({
  eyebrow,
  title,
  description,
  sections,
}: PageBlueprintProps) {
  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          {eyebrow ? <Text variant="brand">{eyebrow}</Text> : null}
          <Heading
            level="display"
            as="h1"
            className={cn("max-w-[22ch]", eyebrow && "mt-4")}
          >
            {title}
          </Heading>
          {description ? (
            <Text variant="lead" className="mt-5 max-w-[56ch]">
              {description}
            </Text>
          ) : null}
        </Container>
      </header>

      {sections.map((section, index) => (
        <BlueprintSection
          key={section.id}
          id={section.id}
          title={section.title}
          note={section.note}
          tone={index % 2 === 0 ? "default" : "surface"}
        />
      ))}
    </main>
  );
}

type BlueprintSectionProps = {
  id: string;
  title: string;
  note?: string;
  tone?: "default" | "surface";
  children?: ReactNode;
};

/** Named section shell with a default skeleton body. */
export function BlueprintSection({
  id,
  title,
  note,
  tone = "default",
  children,
}: BlueprintSectionProps) {
  return (
    <Section id={id} tone={tone} bleed>
      <Container className="py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Text variant="notation">Section</Text>
            <Heading level="section" className="mt-3 max-w-[20ch]">
              {title}
            </Heading>
            {note ? (
              <Text variant="muted" className="mt-3 max-w-[36ch]">
                {note}
              </Text>
            ) : null}
          </div>
          <div className="min-w-0 lg:col-span-8">
            {children ?? <BlueprintPlaceholder />}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Generic content placeholder for unfinished modules. */
export function BlueprintPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-4 rounded-xl border border-dashed border-hairline p-5 sm:p-6",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-3/4 max-w-md" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </div>
  );
}
