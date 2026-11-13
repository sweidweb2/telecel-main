import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  /** Marketing flex column vs CMS dashboard-page chrome. */
  variant?: "marketing" | "dashboard";
  as?: "main" | "div";
};

/** Route body wrapper — marketing flex-1 or dashboard-page utility. */
export function PageContainer({
  children,
  className,
  variant = "marketing",
  as: Comp = "main",
}: PageContainerProps) {
  return (
    <Comp
      className={cn(
        variant === "dashboard" ? "dashboard-page" : "flex flex-1 flex-col",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
