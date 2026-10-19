"use client";

import { RouteError } from "@/components/layout/route-error";
import { geistMono, geistSans } from "@/lib/fonts";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <RouteError error={error} reset={reset} homeAsAnchor />
      </body>
    </html>
  );
}
