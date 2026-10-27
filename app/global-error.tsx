"use client";

import { RouteError } from "@/components/layout/route-error";
import { fontVariables } from "@/lib/fonts";

import "./globals.css";

export default function GlobalError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <RouteError
          error={error}
          retry={retry}
          reset={reset}
          homeAsAnchor
        />
      </body>
    </html>
  );
}
