import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StackProps = {
  children: ReactNode;
  className?: string;
  gap?: "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  direction?: "vertical" | "horizontal";
  align?: "start" | "center" | "end" | "stretch";
  as?: "div" | "section" | "ul" | "ol" | "fieldset";
};

const gapClass = {
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
} as const;

const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

/** Flex stack primitive for consistent spacing. */
export function Stack({
  children,
  className,
  gap = "4",
  direction = "vertical",
  align = "stretch",
  as: Comp = "div",
}: StackProps) {
  return (
    <Comp
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gapClass[gap],
        alignClass[align],
        className,
      )}
    >
      {children}
    </Comp>
  );
}
