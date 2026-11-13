import NextLink from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type AppLinkProps = ComponentProps<typeof NextLink> & {
  /** Visual treatment; default is brand underline link. */
  variant?: "default" | "muted" | "nav" | "plain";
};

const variants: Record<NonNullable<AppLinkProps["variant"]>, string> = {
  default: "text-primary underline-offset-4 hover:underline",
  muted:
    "text-muted-foreground underline-offset-4 hover:text-ink hover:underline",
  nav: "text-ink underline-offset-[6px] hover:underline aria-[current=page]:text-brand",
  plain: "text-inherit no-underline",
};

/** App-wide Next.js link with shared visual variants. */
function Link({ className, variant = "default", ...props }: AppLinkProps) {
  return (
    <NextLink
      data-slot="link"
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}

export { Link };
