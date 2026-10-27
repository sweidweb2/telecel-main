import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { loginPath, ROUTES } from "@/constants/routes";
import { allowSessionDuringMaintenance } from "@/data/auth";
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
 * During L1/L2 maintenance only active admins keep the new session.
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

    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    // Redirect to a clean URL so the one-time token never lingers in history.
    if (!error) {
      if (!(await allowSessionDuringMaintenance())) {
        return NextResponse.redirect(
          new URL(loginPath({ reason: "no-access" }), request.url),
        );
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
    console.error("[auth] verifyOtp failed", error.code ?? error.message);
  }

  return NextResponse.redirect(
    new URL(loginPath({ reason: "auth-error" }), request.url),
  );
}
