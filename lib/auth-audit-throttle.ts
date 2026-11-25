import {
  recordActivity,
  recordAppError,
  type RecordActivityInput,
  type RecordAppErrorInput,
} from "@/actions/observability";
import { getSessionContext } from "@/data/auth";
import { consumeRateLimit } from "@/lib/rate-limit";

const AUDIT_WINDOW_MS = 10 * 60 * 1000;
const AUDIT_LIMIT = 20;

/**
 * Per-IP budget for unauthenticated auth audit writes (callback, confirm,
 * sign-in). Returns false once the IP exceeds ~20 writes per 10 minutes so a
 * flood of junk requests cannot fill audit_log / app_errors.
 */
export function allowAuthAuditWrite(ip: string, now = Date.now()): boolean {
  return consumeRateLimit(
    `audit:auth:${ip}`,
    AUDIT_LIMIT,
    AUDIT_WINDOW_MS,
    now,
  );
}

/** Throttled recordActivity/recordAppError bound to one client IP. */
export function createAuthAuditor(ip: string) {
  return {
    /** Rows tied to a real user are always written; anonymous ones are throttled. */
    async audit(input: RecordActivityInput): Promise<void> {
      if (input.actorId || allowAuthAuditWrite(ip)) await recordActivity(input);
    },
    async logError(input: RecordAppErrorInput): Promise<void> {
      if (allowAuthAuditWrite(ip)) await recordAppError(input);
    },
  };
}

export type SignInOutcome =
  { ok: true } | { ok: false; reason: "no_session" | "inactive" | "no_role" };

/** Whether the just-established session belongs to an active profile with a role. */
export async function signInOutcome(): Promise<SignInOutcome> {
  const context = await getSessionContext().catch(() => null);
  if (!context) return { ok: false, reason: "no_session" };
  if (!context.isActive) return { ok: false, reason: "inactive" };
  if (!context.role) return { ok: false, reason: "no_role" };
  return { ok: true };
}
