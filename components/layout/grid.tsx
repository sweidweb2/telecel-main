import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type GridProps = {
  children: ReactNode;
  className?: string;
  /** Mobile-first column counts. */
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: "4" | "6" | "8" | "10";
  as?: "div" | "section" | "ul";
};

const colsClass: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  12: "grid-cols-1 lg:grid-cols-12",
};

const gapClass = {
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-6 lg:gap-10",
} as const;

/** Responsive CSS grid primitive. */
export function Grid({
  children,
  className,
  cols = 2,
  gap = "6",
  as: Comp = "div",
}: GridProps) {
  return (
    <Comp className={cn("grid", colsClass[cols], gapClass[gap], className)}>
      {children}
    </Comp>
  );
}
