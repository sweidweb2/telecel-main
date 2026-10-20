import { NextResponse, type NextRequest } from "next/server";

import { loginPath, type LoginReason } from "@/constants/routes";
import { createClient } from "@/lib/supabase/server";

const REASONS = new Set<LoginReason>(["session-expired", "no-access", "signed-out"]);

/**
 * Ends the session and clears its cookies. Server Components cannot write
 * cookies, so guards in data/auth.ts redirect here when a session expired or
 * access was revoked. The user-facing logout button uses the signOut action.
 */
export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("reason") as LoginReason | null;
  const reason = requested && REASONS.has(requested) ? requested : "signed-out";

  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });

  const response = NextResponse.redirect(new URL(loginPath({ reason }), request.url));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
