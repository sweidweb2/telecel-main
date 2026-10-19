"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes injects an inline <script> to prevent theme flash (FOUC).
 * React 19 warns about script tags inside client components; the script still
 * runs correctly during SSR. Filter that specific false-positive in development.
 * @see https://github.com/shadcn-ui/ui/issues/10104
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const isScriptTagWarning = args.some(
      (arg) =>
        typeof arg === "string" && arg.includes("Encountered a script tag"),
    );
    if (isScriptTagWarning) return;
    originalConsoleError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
