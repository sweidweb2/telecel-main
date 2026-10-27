import { NextResponse, type NextRequest } from "next/server";

import { loginPath, ROUTES } from "@/constants/routes";
import { getMaintenanceFlags } from "@/data/site-settings";
import { isLoginBlocked } from "@/lib/maintenance";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth (Google) PKCE return. Unknown Google accounts are rejected by Supabase
 * when signups are disabled and arrive here with `error` params instead of a
 * `code`. Accounts without a CMS role are signed out by requireStaff().
 */
export async function GET(request: NextRequest) {
  const flags = await getMaintenanceFlags();
  if (isLoginBlocked(flags)) {
    return NextResponse.redirect(new URL(ROUTES.maintenance, request.url));
  }

  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
    console.error("[auth] OAuth code exchange failed", error.code ?? error.message);
  } else if (searchParams.get("error")) {
    console.error("[auth] OAuth provider error", searchParams.get("error_code"));
  }

  return NextResponse.redirect(
    new URL(loginPath({ reason: "auth-error" }), request.url),
  );
}
