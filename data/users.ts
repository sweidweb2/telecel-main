import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Profile, UserListResult, UserStats } from "@/types/profile";
import type { UserListQuery } from "@/validations/users";

const USER_COLUMNS = "id, email, full_name, role, created_at, updated_at" as const;

export async function getUsers(query: UserListQuery): Promise<UserListResult> {
  const supabase = await createClient();
  return fetchUsers(supabase, query);
}

/**
 * Per-request memoization only.
 * Stats are one RPC (`get_user_stats`) — not four head-count round trips.
 */
export const getUserStats = cache(async (): Promise<UserStats> => {
  const supabase = await createClient();
  return fetchUserStats(supabase);
});

type ServerClient = Awaited<ReturnType<typeof createClient>>;

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
      viewers: 0,
      newThisWeek: 0,
      newThisMonth: 0,
    };
  }

  return {
    total: Number(row.total ?? 0),
    admins: Number(row.admins ?? 0),
    editors: Number(row.editors ?? 0),
    viewers: Number(row.viewers ?? 0),
    newThisWeek: Number(row.new_this_week ?? 0),
    newThisMonth: Number(row.new_this_month ?? 0),
  };
}

/**
 * Single shared client: admin check → list + stats in parallel.
 * Cuts duplicate createClient/getUser round trips on the Users page.
 */
export async function getUsersPageData(query: UserListQuery): Promise<
  | { status: "forbidden" }
  | { status: "ok"; list: UserListResult; stats: UserStats }
> {
  const supabase = await createClient();

  // `is_admin()` uses auth.uid() from the JWT — no extra getUser() needed.
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw adminError;
  if (!isAdmin) return { status: "forbidden" };

  const [list, stats] = await Promise.all([
    fetchUsers(supabase, query),
    fetchUserStats(supabase),
  ]);

  return { status: "ok", list, stats };
}
