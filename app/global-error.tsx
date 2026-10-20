"use client";

import { RouteError } from "@/components/layout/route-error";
import { brandMono, brandSans } from "@/lib/fonts";

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
      className={`${brandSans.variable} ${brandMono.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <RouteError error={error} reset={reset} homeAsAnchor />
      </body>
    </html>
  );
}
