import "server-only";

import type { StaffSession } from "@/data/auth";
import type {
  ActivityLogListResult,
  ActivityLogRow,
} from "@/types/observability";
import {
  endOfDayExclusive,
  type ActivityLogQuery,
} from "@/validations/audit-log";

const ACTIVITY_COLUMNS =
  "id, action, entity_type, entity_id, summary, created_at, actor:profiles!audit_log_actor_id_fkey(full_name, email)" as const;

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

  if (query.actor) {
    // Resolve matching profiles first; PostgREST cannot OR across the embed.
    const term = query.actor;
    const { data: actors, error: actorError } = await session.supabase
      .from("profiles")
      .select("id")
      .or(`email.ilike.%${term}%,full_name.ilike.%${term}%`)
      .limit(200);
    if (actorError) throw actorError;
    const ids = (actors ?? []).map((actor) => actor.id);
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
  };
}
