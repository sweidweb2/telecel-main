import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-heading text-balance text-ink", {
  variants: {
    level: {
      display: "type-display font-medium tracking-tight",
      section: "type-section font-medium tracking-tight",
      title: "text-[1.75rem] leading-9 font-medium tracking-tight",
      subtitle: "text-xl font-medium tracking-tight sm:text-2xl",
      label: "text-base font-medium",
    },
  },
  defaultVariants: {
    level: "title",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

const defaultTag: Record<
  NonNullable<VariantProps<typeof headingVariants>["level"]>,
  HeadingTag
> = {
  display: "h1",
  section: "h2",
  title: "h2",
  subtitle: "h3",
  label: "h3",
};

type HeadingProps = React.ComponentProps<"h1"> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingTag;
  };

/** Shared typography heading — prefer over one-off font-heading classes. */
function Heading({ className, level = "title", as, ...props }: HeadingProps) {
  const Comp = as ?? defaultTag[level ?? "title"];
  return (
    <Comp
      data-slot="heading"
      className={cn(headingVariants({ level }), className)}
      {...props}
    />
  );
}

export { Heading, headingVariants };
