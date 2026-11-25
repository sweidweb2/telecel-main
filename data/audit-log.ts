import "server-only";

import type { StaffSession } from "@/data/auth";
import type {
  ActivityLogListResult,
  ActivityLogRow,
} from "@/types/observability";
import {
  endOfDayExclusive,
  escapeIlikeTerm,
  type ActivityLogQuery,
} from "@/validations/audit-log";

const ACTIVITY_COLUMNS =
  "id, action, entity_type, entity_id, summary, created_at, actor:profiles!audit_log_actor_id_fkey(full_name, email)" as const;

/** Max profiles the actor filter resolves before asking the admin to refine. */
// Fetch CAP + 1 to detect overflow; stays far below PostgREST max_rows (1000)
// and keeps the `actor_id in (...)` URL short.
const ACTOR_MATCH_CAP = 100;

/**
 * Paginated activity log for the admin Activity page.
 * Caller must already pass requireSection / admin gate; RLS re-checks is_admin.
 */
export async function getActivityLogPage(
  session: StaffSession,
  query: ActivityLogQuery,
): Promise<ActivityLogListResult> {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = session.supabase
    .from("audit_log")
    .select(ACTIVITY_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (query.search) {
    const term = query.search;
    request = request.or(
      `action.ilike.%${term}%,entity_type.ilike.%${term}%,entity_id.ilike.%${term}%`,
    );
  }

  if (query.action) request = request.eq("action", query.action);
  if (query.entity) request = request.eq("entity_type", query.entity);
  if (query.from)
    request = request.gte("created_at", `${query.from}T00:00:00Z`);
  if (query.to) request = request.lt("created_at", endOfDayExclusive(query.to));

  let actorsCapped = false;
  if (query.actor) {
    // Resolve matching profiles first; PostgREST cannot OR across the embed.
    const term = escapeIlikeTerm(query.actor);
    const { data: actors, error: actorError } = await session.supabase
      .from("profiles")
      .select("id")
      .or(`email.ilike.%${term}%,full_name.ilike.%${term}%`)
      .limit(ACTOR_MATCH_CAP + 1);
    if (actorError) throw actorError;
    const matched = actors ?? [];
    actorsCapped = matched.length > ACTOR_MATCH_CAP;
    const ids = matched.slice(0, ACTOR_MATCH_CAP).map((actor) => actor.id);
    if (ids.length === 0) {
      return { rows: [], total: 0, totalPages: 1 };
    }
    request = request.in("actor_id", ids);
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    rows: (data ?? []) as unknown as ActivityLogRow[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    actorsCapped,
  };
}
