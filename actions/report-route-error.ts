"use server";

import { recordAppError } from "@/actions/observability";

export type ReportRouteErrorInput = {
  message: string;
  digest?: string | null;
  name?: string | null;
};

/**
 * Client-callable logger for `error.tsx` / `global-error.tsx` boundaries.
 * Keeps `actions/observability.ts` behind `server-only` while still writing
 * uncaught route failures into `app_errors`.
 */
export async function reportRouteError(
  input: ReportRouteErrorInput,
): Promise<void> {
  await recordAppError({
    severity: "error",
    source: "app.route-error",
    code: input.digest ?? input.name ?? "uncaught",
    message: input.message || "Uncaught route error",
    requestId: input.digest ?? null,
    context: {
      name: input.name ?? null,
      digest: input.digest ?? null,
    },
  });
}
