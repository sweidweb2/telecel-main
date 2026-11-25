import { NextResponse, type NextRequest } from "next/server";

import { loginPath } from "@/constants/routes";
import { allowSessionDuringMaintenance } from "@/data/auth";
import { createAuthAuditor, signInOutcome } from "@/lib/auth-audit-throttle";
import { clientIp } from "@/lib/client-ip";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth (Google) PKCE return. Unknown Google accounts are rejected by Supabase
 * when signups are disabled and arrive here with `error` params instead of a
 * `code`. Accounts without a CMS role are signed out by requireStaff().
 * During maintenance only active admins keep the new session.
 * Audit/error writes are throttled per IP; no activity rows without a code.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const { audit, logError } = createAuthAuditor(await clientIp());
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const userId = data.user?.id ?? null;
      if (!(await allowSessionDuringMaintenance())) {
        await audit({
          actorId: userId,
          action: "sign_in_blocked",
          entityType: "auth",
          entityId: userId,
          summary: { method: "oauth", reason: "maintenance" },
        });
        return NextResponse.redirect(
          new URL(loginPath({ reason: "no-access" }), request.url),
        );
      }
      // sign_in only for active profiles with a role; requireStaff() signs
      // the rest out on the next request.
      const outcome = await signInOutcome();
      await audit({
        actorId: userId,
        action: outcome.ok ? "sign_in" : "sign_in_blocked",
        entityType: "auth",
        entityId: userId,
        summary: outcome.ok
          ? { method: "oauth" }
          : { method: "oauth", reason: outcome.reason },
      });
      return NextResponse.redirect(new URL(next, request.url));
    }
    await audit({
      actorId: null,
      action: "sign_in_failed",
      entityType: "auth",
      summary: { method: "oauth", code: error.code ?? null },
    });
    console.error(
      "[auth] OAuth code exchange failed",
      error.code ?? error.message,
    );
    await logError({
      severity: "error",
      source: "auth.callback.exchangeCodeForSession",
      code: error.code ?? null,
      message: error.message,
    });
  } else if (searchParams.get("error")) {
    // No code: no activity row, and the app_errors write is IP-throttled.
    const { logError } = createAuthAuditor(await clientIp());
    const providerError =
      searchParams.get("error_description") ??
      searchParams.get("error") ??
      "OAuth provider error";
    console.error(
      "[auth] OAuth provider error",
      searchParams.get("error_code"),
    );
    await logError({
      severity: "error",
      source: "auth.callback.provider",
      code: searchParams.get("error_code"),
      message: providerError,
    });
  }

  return NextResponse.redirect(
    new URL(loginPath({ reason: "auth-error" }), request.url),
  );
}
