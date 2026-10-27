import "server-only";

import type { StaffSession } from "@/data/auth";
import type { ActivityLogListResult, ActivityLogRow } from "@/types/observability";
import type { ActivityLogQuery } from "@/validations/audit-log";

const ACTIVITY_COLUMNS =
  "id, action, entity_type, entity_id, created_at, actor:profiles!audit_log_actor_id_fkey(full_name, email)" as const;

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

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    rows: (data ?? []) as unknown as ActivityLogRow[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}
