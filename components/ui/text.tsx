import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base leading-7 text-foreground",
      lead: "text-base leading-7 text-muted-foreground sm:text-lg",
      muted: "text-sm leading-6 text-muted-foreground",
      notation: "type-notation text-muted-foreground",
      // Darker red keeps small eyebrows above 4.5:1 on the warm surface.
      brand: "type-notation text-brand-hover",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextProps = React.ComponentProps<"p"> & VariantProps<typeof textVariants>;

/** Shared body / lead / muted / notation text. */
function Text({ className, variant = "body", ...props }: TextProps) {
  return (
    <p
      data-slot="text"
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Text, textVariants };
