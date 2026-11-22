import { NextResponse, type NextRequest } from "next/server";

import { recordActivity } from "@/actions/observability";
import { loginPath, ROUTES, type LoginReason } from "@/constants/routes";
import { getSessionContext } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";

const REASONS = new Set<LoginReason>([
  "session-expired",
  "no-access",
  "signed-out",
]);

function parseReason(request: NextRequest): LoginReason {
  const requested = request.nextUrl.searchParams.get(
    "reason",
  ) as LoginReason | null;
  return requested && REASONS.has(requested) ? requested : "signed-out";
}

async function endSessionAndRedirect(
  request: NextRequest,
  reason: LoginReason,
  source: "route.post" | "route.get",
): Promise<NextResponse> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const actorId = data?.claims?.sub ?? null;
  await supabase.auth.signOut({ scope: "local" });
  if (actorId) {
    await recordActivity({
      actorId,
      action: "sign_out",
      entityType: "auth",
      entityId: actorId,
      summary: { source, reason },
    });
  }

  const response = NextResponse.redirect(
    new URL(loginPath({ reason }), request.url),
    303,
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}

/** Same-origin check for the state-changing POST (CSRF defence). */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Browsers always send Origin on cross-site POSTs; fall back to Sec-Fetch-Site.
    const site = request.headers.get("sec-fetch-site");
    return site === null || site === "same-origin" || site === "none";
  }
  return origin === request.nextUrl.origin;
}

/** Explicit logout (forms / fetch). POST-only so it cannot be triggered cross-site via a link or <img>. */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return endSessionAndRedirect(request, parseReason(request), "route.post");
}

/**
 * Server Components cannot write cookies, so guards in data/auth.ts redirect
 * here (a GET) when a session expired or access was revoked. To keep GET free
 * of CSRF-able side effects, it only clears cookies for sessions that are
 * already unusable; a healthy session is sent back to the dashboard untouched.
 */
export async function GET(request: NextRequest) {
  const context = await getSessionContext().catch(() => null);
  const healthy = Boolean(
    context && context.sessionFresh && context.isActive && context.role,
  );
  if (healthy) {
    const response = NextResponse.redirect(
      new URL(ROUTES.dashboard, request.url),
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  return endSessionAndRedirect(request, parseReason(request), "route.get");
}
