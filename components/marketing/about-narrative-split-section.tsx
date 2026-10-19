import { Compass, Eye, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AboutNarrativeVisualVariant = "vision" | "mission";

const VISUAL_CONFIG: Record<
  AboutNarrativeVisualVariant,
  { Icon: LucideIcon; gradient: string }
> = {
  vision: {
    Icon: Eye,
    gradient: "from-primary/20 via-muted/70 to-secondary/40",
  },
  mission: {
    Icon: Compass,
    gradient: "from-secondary/50 via-muted/70 to-primary/15",
  },
};

type AboutNarrativeSplitSectionProps = {
  id: string;
  title: string;
  paragraphs: string[];
  imagePosition: "left" | "right";
  imageVariant: AboutNarrativeVisualVariant;
  imageLabel: string;
};

function NarrativeVisual({
  variant,
  label,
}: {
  variant: AboutNarrativeVisualVariant;
  label: string;
}) {
  const { Icon, gradient } = VISUAL_CONFIG[variant];

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br shadow-sm sm:aspect-[5/4]",
        gradient,
      )}
      role="img"
      aria-label={label}
    >
      <span
        aria-hidden
        className="about-story-float absolute -right-4 top-6 size-20 rounded-full bg-primary/10 blur-sm"
      />
      <span
        aria-hidden
        className="about-story-float-delayed absolute -left-5 bottom-10 size-24 rounded-full bg-primary/15 blur-sm"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="size-20 text-primary/30 sm:size-24" aria-hidden />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/10 to-transparent p-4 sm:p-5">
        <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

export function AboutNarrativeSplitSection({
  id,
  title,
  paragraphs,
  imagePosition,
  imageVariant,
  imageLabel,
}: AboutNarrativeSplitSectionProps) {
  const textOrder =
    imagePosition === "right" ? "order-1" : "order-1 lg:order-2";
  const imageOrder =
    imagePosition === "right" ? "order-2" : "order-2 lg:order-1";

  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className={cn("min-w-0", textOrder)}>
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            {title}
          </h2>
          <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className={cn("min-w-0", imageOrder)}>
          <NarrativeVisual variant={imageVariant} label={imageLabel} />
        </div>
      </div>
    </section>
  );
}
