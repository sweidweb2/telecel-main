import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { loginPath, ROUTES } from "@/constants/routes";
import { allowSessionDuringMaintenance } from "@/data/auth";
import { createAuthAuditor, signInOutcome } from "@/lib/auth-audit-throttle";
import { clientIp } from "@/lib/client-ip";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set<EmailOtpType>([
  "recovery",
  "invite",
  "email",
  "email_change",
]);

/**
 * Email-link verification (token_hash flow). Unlike the PKCE `code` flow, it
 * works when the link is opened on another device. The email templates in
 * Supabase must point here — see docs/04-runbooks/auth-setup.md.
 * During maintenance only active admins keep the new session.
 * Requests without a token write nothing; audit writes are throttled per IP.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type && ALLOWED_TYPES.has(type)) {
    const fallback =
      type === "recovery" || type === "invite"
        ? ROUTES.updatePassword
        : ROUTES.dashboard;
    const next = safeRedirectPath(searchParams.get("next"), fallback);
    const { audit, logError } = createAuthAuditor(await clientIp());

    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    // Redirect to a clean URL so the one-time token never lingers in history.
    if (!error) {
      const userId = data.user?.id ?? null;
      if (!(await allowSessionDuringMaintenance())) {
        await audit({
          actorId: userId,
          action: "sign_in_blocked",
          entityType: "auth",
          entityId: userId,
          summary: { method: "email_link", type, reason: "maintenance" },
        });
        return NextResponse.redirect(
          new URL(loginPath({ reason: "no-access" }), request.url),
        );
      }
      // sign_in only for active profiles with a role.
      const outcome = await signInOutcome();
      await audit({
        actorId: userId,
        action: outcome.ok ? "sign_in" : "sign_in_blocked",
        entityType: "auth",
        entityId: userId,
        summary: outcome.ok
          ? { method: "email_link", type }
          : { method: "email_link", type, reason: outcome.reason },
      });
      return NextResponse.redirect(new URL(next, request.url));
    }
    await audit({
      actorId: null,
      action: "sign_in_failed",
      entityType: "auth",
      summary: { method: "email_link", type, code: error.code ?? null },
    });
    console.error("[auth] verifyOtp failed", error.code ?? error.message);
    await logError({
      severity: "error",
      source: "auth.confirm.verifyOtp",
      code: error.code ?? null,
      message: error.message,
      context: { type },
    });
  }

  return NextResponse.redirect(
    new URL(loginPath({ reason: "auth-error" }), request.url),
  );
}
