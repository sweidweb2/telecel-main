import "server-only";

import type { StaffSession } from "@/data/auth";
import type { Profile, UserListResult, UserStats } from "@/types/profile";
import type { UserListQuery } from "@/validations/users";

const USER_COLUMNS =
  "id, email, full_name, role, is_active, created_at, updated_at" as const;

type ServerClient = StaffSession["supabase"];

async function fetchUsers(
  supabase: ServerClient,
  query: UserListQuery,
): Promise<UserListResult> {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = supabase
    .from("profiles")
    .select(USER_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (query.role !== "all") {
    request = request.eq("role", query.role);
  }

  if (query.search) {
    request = request.or(
      `full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`,
    );
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    users: (data ?? []) as Profile[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

async function fetchUserStats(supabase: ServerClient): Promise<UserStats> {
  const { data, error } = await supabase.rpc("get_user_stats");
  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return {
      total: 0,
      admins: 0,
      editors: 0,
      noAccess: 0,
      newThisWeek: 0,
      newThisMonth: 0,
    };
  }

  return {
    total: Number(row.total ?? 0),
    admins: Number(row.admins ?? 0),
    editors: Number(row.editors ?? 0),
    noAccess: Number(row.no_access ?? 0),
    newThisWeek: Number(row.new_this_week ?? 0),
    newThisMonth: Number(row.new_this_month ?? 0),
  };
}

/**
 * List + stats in parallel for the Users page. The caller must already have
 * passed an admin guard; RLS (is_admin) enforces the same rule in the DB.
 */
export async function getUsersPageData(
  session: StaffSession,
  query: UserListQuery
): Promise<{ list: UserListResult; stats: UserStats }> {
  const [list, stats] = await Promise.all([
    fetchUsers(session.supabase, query),
    fetchUserStats(session.supabase),
  ]);
  return { list, stats };
}
