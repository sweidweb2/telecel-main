import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type BlueprintSectionConfig = {
  id: string;
  title: string;
  /** Optional note under the title (blueprint-only, not final copy). */
  note?: string;
};

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
    <main className="flex-1">
      <header className="border-b bg-surface">
        <div className="container-site py-12 sm:py-14 lg:py-20">
          {eyebrow ? (
            <p className="type-notation text-brand">{eyebrow}</p>
          ) : null}
          <h1
            className={cn(
              "max-w-[22ch] type-display text-balance text-ink",
              eyebrow && "mt-4",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-[56ch] text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
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
    <section
      id={id}
      className={cn("border-b", tone === "surface" && "bg-surface")}
    >
      <div className="container-site py-10 sm:py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="type-notation text-muted-foreground">Section</p>
            <h2 className="mt-3 max-w-[20ch] type-section text-ink">{title}</h2>
            {note ? (
              <p className="mt-3 max-w-[36ch] text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            ) : null}
          </div>
          <div className="min-w-0 lg:col-span-8">
            {children ?? <BlueprintPlaceholder />}
          </div>
        </div>
      </div>
    </section>
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
