import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  /** Alternating public-page surfaces. */
  tone?: "default" | "surface" | "charcoal";
  className?: string;
  containerClassName?: string;
  /** Skip the shared container when nesting custom width. */
  bleed?: boolean;
};

/**
 * Public / landing section shell: optional eyebrow + heading + body,
 * container-site padding, alternating surfaces.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  className,
  containerClassName,
  bleed = false,
}: SectionProps) {
  const body = (
    <>
      {(eyebrow || title || description) && (
        <div className={cn("max-w-[56ch]", children && "mb-8 lg:mb-10")}>
          {eyebrow ? <Text variant="brand">{eyebrow}</Text> : null}
          {title ? (
            <Heading
              level="section"
              className={cn(
                eyebrow && "mt-3",
                tone === "charcoal" && "text-charcoal-foreground",
              )}
            >
              {title}
            </Heading>
          ) : null}
          {description ? (
            <Text
              variant="lead"
              className={cn(
                "mt-4",
                tone === "charcoal" && "text-charcoal-muted",
              )}
            >
              {description}
            </Text>
          ) : null}
        </div>
      )}
      {children}
    </>
  );

  return (
    <section
      id={id}
      className={cn(
        "border-b",
        tone === "surface" && "bg-surface",
        tone === "charcoal" &&
          "border-transparent bg-charcoal text-charcoal-foreground",
        className,
      )}
    >
      {bleed ? (
        body
      ) : (
        <Container
          className={cn("py-10 sm:py-12 lg:py-16", containerClassName)}
        >
          {body}
        </Container>
      )}
    </section>
  );
}
