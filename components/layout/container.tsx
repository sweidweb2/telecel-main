import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** `site` = marketing 1280px; `narrow` = forms; `prose` = long copy; `full` = no max. */
  size?: "site" | "narrow" | "prose" | "full";
  as?: "div" | "section" | "main" | "header" | "footer";
};

const sizeClass: Record<NonNullable<ContainerProps["size"]>, string> = {
  site: "container-site",
  narrow: "mx-auto w-full max-w-[var(--container-narrow)] px-4 sm:px-6",
  prose: "mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6",
  full: "w-full",
};

/** Horizontal page / section width constraint. */
export function Container({
  children,
  className,
  size = "site",
  as: Comp = "div",
}: ContainerProps) {
  return <Comp className={cn(sizeClass[size], className)}>{children}</Comp>;
}
