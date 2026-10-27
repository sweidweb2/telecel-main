import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

const MESSAGE_MAX = 2000;
const SOURCE_MAX = 160;
const CODE_MAX = 120;
const REQUEST_ID_MAX = 120;
const CONTEXT_MAX_KEYS = 24;
const CONTEXT_STRING_MAX = 500;

const SECRET_KEY_PATTERN =
  /pass(word)?|secret|token|authorization|cookie|api[_-]?key|recovery|reset.?link|service.?role/i;

export type ActivityAction =
  | "create"
  | "update"
  | "publish"
  | "unpublish"
  | "delete"
  | "role_change"
  | "invite"
  | "suspend"
  | "reactivate"
  | (string & {});

export type RecordActivityInput = {
  actorId: string | null;
  action: ActivityAction;
  entityType: string;
  entityId?: string | null;
  summary?: Record<string, unknown> | null;
};

export type AppErrorSeverity = "warning" | "error";

export type RecordAppErrorInput = {
  severity: AppErrorSeverity;
  source: string;
  message: string;
  code?: string | null;
  actorId?: string | null;
  requestId?: string | null;
  context?: Record<string, unknown> | null;
};

/** Truncate a log message for storage. Exported for unit tests. */
export function truncateMessage(message: string, max = MESSAGE_MAX): string {
  const trimmed = message.trim();
  if (trimmed.length <= max) return trimmed || "Unknown error";
  return `${trimmed.slice(0, max - 1)}…`;
}

/** Drop secret-looking keys and bound size. Exported for unit tests. */
export function scrubContext(
  context: Record<string, unknown> | null | undefined,
): Json | null {
  if (!context) return null;

  const out: Record<string, Json | undefined> = {};
  let count = 0;

  for (const [key, value] of Object.entries(context)) {
    if (count >= CONTEXT_MAX_KEYS) break;
    if (SECRET_KEY_PATTERN.test(key)) continue;

    const scrubbed = scrubValue(value);
    if (scrubbed === undefined) continue;
    out[key] = scrubbed;
    count += 1;
  }

  return Object.keys(out).length > 0 ? out : null;
}

function scrubValue(value: unknown): Json | undefined {
  if (value === null) return null;
  if (typeof value === "string") {
    return value.length <= CONTEXT_STRING_MAX
      ? value
      : `${value.slice(0, CONTEXT_STRING_MAX - 1)}…`;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    return value
      .slice(0, 20)
      .map((item) => scrubValue(item))
      .filter((item): item is Json => item !== undefined);
  }
  if (typeof value === "object") {
    return scrubContext(value as Record<string, unknown>);
  }
  return String(value).slice(0, CONTEXT_STRING_MAX);
}

/**
 * Append a successful CMS/admin mutation to `audit_log`.
 * Never throws — logging must not break the primary action.
 */
export async function recordActivity(input: RecordActivityInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("audit_log").insert({
      actor_id: input.actorId,
      action: truncateMessage(input.action, 64),
      entity_type: truncateMessage(input.entityType, 64),
      entity_id: input.entityId
        ? truncateMessage(input.entityId, 128)
        : null,
      summary: scrubContext(input.summary ?? null),
    });
    if (error) {
      console.error("[observability] recordActivity failed", error.message);
    }
  } catch (error) {
    console.error(
      "[observability] recordActivity threw",
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Append an unexpected operational failure to `app_errors`.
 * Never throws — logging must not break the primary action.
 */
export async function recordAppError(input: RecordAppErrorInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("app_errors").insert({
      severity: input.severity,
      source: truncateMessage(input.source, SOURCE_MAX),
      code: input.code ? truncateMessage(input.code, CODE_MAX) : null,
      message: truncateMessage(input.message),
      actor_id: input.actorId ?? null,
      request_id: input.requestId
        ? truncateMessage(input.requestId, REQUEST_ID_MAX)
        : null,
      context: scrubContext(input.context ?? null),
    });
    if (error) {
      console.error("[observability] recordAppError failed", error.message);
    }
  } catch (error) {
    console.error(
      "[observability] recordAppError threw",
      error instanceof Error ? error.message : error,
    );
  }
}
