import "server-only";

import type { StaffSession } from "@/data/auth";
import type { ErrorLogListResult, ErrorLogRow } from "@/types/observability";
import type { ErrorLogQuery } from "@/validations/app-errors";

const ERROR_COLUMNS =
  "id, created_at, severity, source, message, actor:profiles!app_errors_actor_id_fkey(full_name, email)" as const;

/**
 * Paginated error log for the admin Error log page.
 * Caller must already pass requireSection / admin gate; RLS re-checks is_admin.
 */
export async function getErrorLogPage(
  session: StaffSession,
  query: ErrorLogQuery,
): Promise<ErrorLogListResult> {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = session.supabase
    .from("app_errors")
    .select(ERROR_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (query.severity !== "all") {
    request = request.eq("severity", query.severity);
  }

  if (query.search) {
    const term = query.search;
    request = request.or(
      `source.ilike.%${term}%,message.ilike.%${term}%,code.ilike.%${term}%`,
    );
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    rows: (data ?? []) as unknown as ErrorLogRow[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}
