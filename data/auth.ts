import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/** Returns the signed-in Auth user, or null when logged out. */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
});

export async function isAuthenticated() {
  const user = await getAuthUser();
  return user !== null;
}

/**
 * DB-backed admin check. Uses `is_admin()` only (auth.uid from JWT) —
 * skips a redundant getUser() round trip after middleware already refreshed the session.
 */
export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  return Boolean(data);
});
