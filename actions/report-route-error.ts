"use server";

import { recordAppError } from "@/actions/observability";
import { clientIp } from "@/lib/client-ip";
import { consumeRateLimit } from "@/lib/rate-limit";

export type ReportRouteErrorInput = {
  message: string;
  digest?: string | null;
  name?: string | null;
};

const MESSAGE_MAX = 1000;
const DIGEST_MAX = 120;
const NAME_MAX = 120;
const REPORT_LIMIT = 20;
const REPORT_WINDOW_MS = 10 * 60 * 1000;

/** Coerces untrusted client input to a bounded string (or null). */
function capString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length <= max ? trimmed : trimmed.slice(0, max);
}

/**
 * Client-callable logger for `error.tsx` / `global-error.tsx` boundaries.
 * Keeps `actions/observability.ts` behind `server-only` while still writing
 * uncaught route failures into `app_errors`. Rate limited per IP and
 * size-capped because any client can call it.
 */
export async function reportRouteError(
  input: ReportRouteErrorInput,
): Promise<void> {
  const raw = (input ?? {}) as Partial<
    Record<keyof ReportRouteErrorInput, unknown>
  >;
  const message = capString(raw.message, MESSAGE_MAX);
  const digest = capString(raw.digest, DIGEST_MAX);
  const name = capString(raw.name, NAME_MAX);

  const ip = await clientIp();
  if (
    !consumeRateLimit(`route-error:ip:${ip}`, REPORT_LIMIT, REPORT_WINDOW_MS)
  ) {
    return;
  }

  await recordAppError({
    severity: "error",
    source: "app.route-error",
    code: digest ?? name ?? "uncaught",
    message: message ?? "Uncaught route error",
    requestId: digest,
    context: { name, digest },
  });
}
