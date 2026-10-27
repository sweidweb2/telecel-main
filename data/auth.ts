import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { canAccessSection, getPortalSection } from "@/constants/dashboard-nav";
import { loginPath, ROUTES, type LoginReason } from "@/constants/routes";
import { getMaintenanceMode } from "@/data/site-settings";
import { isMaintenanceActive } from "@/lib/maintenance";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/profile";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type SessionContext = {
  userId: string;
  email: string;
  role: UserRole | null;
  isActive: boolean;
  /** False once the session is older than the 24h absolute lifetime. */
  sessionFresh: boolean;
};

export type StaffSession = SessionContext & {
  role: UserRole;
  supabase: SupabaseServerClient;
};

/**
 * Verified identity (JWT signature checked by `getClaims()`) plus the
 * DB-backed role, active flag and absolute-session check, in one RPC.
 * Returns null when signed out. Cached per request.
 */
export const getSessionContext = cache(
  async (): Promise<SessionContext | null> => {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();
    const claims = claimsData?.claims;
    if (claimsError || !claims?.sub) return null;

    const { data, error } = await supabase.rpc("get_session_context");
    if (error) throw error;
    const row = data?.[0];

    return {
      userId: claims.sub,
      email: typeof claims.email === "string" ? claims.email : "",
      role: row?.role ?? null,
      isActive: row?.is_active ?? false,
      sessionFresh: row?.session_fresh ?? false,
    };
  }
);

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionContext()) !== null;
}

/** Ends the session via the sign-out route (Server Components cannot clear cookies). */
function endSession(reason: LoginReason): never {
  redirect(`${ROUTES.signOut}?reason=${reason}`);
}

/**
 * Guard for every CMS page and layout. Redirects to login when signed out,
 * and signs the user out when the session expired or access was revoked.
 */
export async function requireStaff(nextPath?: string): Promise<StaffSession> {
  const context = await getSessionContext();
  if (!context) redirect(loginPath({ next: nextPath }));
  if (!context.sessionFresh) endSession("session-expired");
  if (!context.isActive || !context.role) endSession("no-access");

  return { ...context, role: context.role, supabase: await createClient() };
}

/** True when the current staff member can open admin-only portal sections. */
export function isAdminSession(session: Pick<SessionContext, "role">): boolean {
  return session.role === "admin";
}

/**
 * After a successful auth handshake: keep the session only if maintenance is
 * off, or the signed-in user is an active admin. Signs the user out and
 * returns false when maintenance blocks them.
 */
export async function allowSessionDuringMaintenance(): Promise<boolean> {
  const mode = await getMaintenanceMode();
  if (!isMaintenanceActive(mode)) return true;

  const context = await getSessionContext();
  if (context?.role === "admin" && context.isActive) return true;

  const supabase = await createClient();
  await supabase.auth.signOut();
  return false;
}

export type ActionSession =
  | { status: "success"; session: StaffSession }
  | { status: "error"; message: string };

/**
 * Guard for Server Actions and Route Handlers: never redirects, returns an
 * error result instead so the caller can show a toast. RLS enforces the same
 * rules again in the database.
 */
export async function authorizeAction(
  level: "staff" | "admin"
): Promise<ActionSession> {
  const context = await getSessionContext();
  if (!context) return { status: "error", message: "You must be signed in." };
  if (!context.sessionFresh) {
    return {
      status: "error",
      message: "Your session has expired. Sign in again.",
    };
  }
  if (!context.isActive || !context.role) {
    return { status: "error", message: "Your account has no CMS access." };
  }
  if (level === "admin" && context.role !== "admin") {
    return {
      status: "error",
      message: "Only administrators can do this.",
    };
  }

  return {
    status: "success",
    session: { ...context, role: context.role, supabase: await createClient() },
  };
}

/**
 * Page-level guard for a portal section: staff session plus whether the
 * caller's role may open it. Pages render <AccessDenied /> when not allowed.
 */
export async function requireSection(href: string) {
  const session = await requireStaff(href);
  const section = getPortalSection(href);
  if (!section) throw new Error(`Unknown portal section: ${href}`);
  return { session, section, allowed: canAccessSection(session.role, section) };
}
