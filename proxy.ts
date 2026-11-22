import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { loginPath, ROUTES } from "@/constants/routes";
import {
  getMaintenanceModeForProxy,
  isAdminClaim,
  isMaintenanceActive,
  MAINTENANCE_REWRITE_HEADER,
} from "@/lib/maintenance";

/**
 * Optimistic checks only (Next 16 "proxy", formerly middleware):
 * refreshes the Supabase session cookies, enforces maintenance mode, and
 * redirects signed-out visitors away from the CMS. Role, account status and
 * the 24h absolute session lifetime are enforced server-side (data/auth.ts)
 * and in RLS.
 *
 * Maintenance policy (full mode): rewrite public traffic to /maintenance
 * (503 + Retry-After); keep auth surfaces + sign-out reachable; anonymous
 * /dashboard visitors go to /login; signed-in /dashboard
 * requests reach the app, where requireStaff() does the authoritative DB role
 * check (non-admins go to /maintenance). Admin exceptions for *new* sessions are
 * enforced in actions/auth and auth route handlers (DB role), not via
 * JWT-admin public browse.
 */

const AUTH_ONLY_PAGES = new Set<string>([ROUTES.login]);

/** Legacy self-serve reset URL — contact form is the supported path now. */
const LEGACY_FORGOT_PASSWORD = "/forgot-password";

/** Paths that must stay reachable during full maintenance. */
const MAINTENANCE_PASSTHROUGH = new Set<string>([
  ROUTES.maintenance,
  ROUTES.signOut,
]);

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === ROUTES.dashboard || pathname.startsWith(`${ROUTES.dashboard}/`)
  );
}

function isAuthSurfacePath(pathname: string): boolean {
  return (
    pathname === ROUTES.login ||
    pathname === ROUTES.updatePassword ||
    pathname === ROUTES.authCallback ||
    pathname === ROUTES.authConfirm ||
    pathname.startsWith(`${ROUTES.authCallback}/`) ||
    pathname.startsWith(`${ROUTES.authConfirm}/`)
  );
}

/** Supabase SSR auth cookies look like `sb-<ref>-auth-token`. */
function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("-auth-token"));
}

/** Carries refreshed session cookies (with their options) onto a redirect. */
/** Headers setAll() attached to a refreshed-session response (cache safety). */
const SESSION_HEADER_NAMES = ["cache-control", "expires", "pragma"] as const;

function copySessionState(from: NextResponse, to: NextResponse): NextResponse {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
  for (const name of SESSION_HEADER_NAMES) {
    const value = from.headers.get(name);
    if (value !== null) to.headers.set(name, value);
  }
  return to;
}

function redirectWithCookies(url: URL, from: NextResponse): NextResponse {
  return copySessionState(from, NextResponse.redirect(url));
}

/** Seconds clients should wait before retrying during maintenance. */
const MAINTENANCE_RETRY_AFTER_SECONDS = 300;

function maintenanceRewrite(request: NextRequest): NextResponse {
  // Marks proxy-originated rewrites so /maintenance does not bounce home
  // while the proxy and page caches briefly disagree.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(MAINTENANCE_REWRITE_HEADER, "1");
  return NextResponse.rewrite(new URL(ROUTES.maintenance, request.url), {
    request: { headers: requestHeaders },
    status: 503,
    headers: {
      "Retry-After": String(MAINTENANCE_RETRY_AFTER_SECONDS),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}

function maintenanceRewriteWithCookies(
  request: NextRequest,
  from: NextResponse,
): NextResponse {
  return copySessionState(from, maintenanceRewrite(request));
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });

  const { pathname, search } = request.nextUrl;

  // Scheduled jobs (e.g. backups) must run during maintenance; the route
  // enforces its own CRON_SECRET bearer auth and needs no session refresh.
  if (pathname.startsWith("/api/cron/")) return NextResponse.next({ request });

  if (pathname === LEGACY_FORGOT_PASSWORD) {
    const target = new URL(ROUTES.contact, request.url);
    target.searchParams.set("intent", "general");
    return NextResponse.redirect(target);
  }

  const maintenancePromise = getMaintenanceModeForProxy();
  const needsSession = hasSupabaseAuthCookie(request);

  // Anonymous marketing hits: maintenance only — skip Supabase client + getClaims.
  if (!needsSession) {
    const maintenanceOn = isMaintenanceActive(await maintenancePromise);

    if (maintenanceOn) {
      // Anonymous /dashboard falls through to the login redirect below so
      // admins can still authenticate.
      const allow =
        MAINTENANCE_PASSTHROUGH.has(pathname) ||
        isAuthSurfacePath(pathname) ||
        isProtectedPath(pathname);
      if (!allow) return maintenanceRewrite(request);
    }

    if (isProtectedPath(pathname)) {
      return NextResponse.redirect(
        new URL(loginPath({ next: `${pathname}${search}` }), request.url),
      );
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // A refreshed session must never be cached by a CDN or shared cache.
        for (const [name, value] of Object.entries(headers ?? {})) {
          response.headers.set(name, value);
        }
        if (cookiesToSet.length > 0) {
          response.headers.set("Cache-Control", "private, no-store");
        }
      },
    },
  });

  // Do not run code between createServerClient and getClaims(): it refreshes
  // an expired access token and writes the new cookies through setAll above.
  // Maintenance fetch runs in parallel — it does not touch auth cookies.
  const [{ data }, maintenanceMode] = await Promise.all([
    supabase.auth.getClaims(),
    maintenancePromise,
  ]);
  const claims = data?.claims;
  const signedIn = Boolean(claims?.sub);
  const maintenanceOn = isMaintenanceActive(maintenanceMode);

  if (maintenanceOn) {
    const allow =
      MAINTENANCE_PASSTHROUGH.has(pathname) ||
      isAuthSurfacePath(pathname) ||
      // Anonymous → login redirect below. Signed-in users pass through:
      // requireStaff() checks the DB role and sends non-admins to
      // /maintenance (the token role is not trusted for the lockout).
      isProtectedPath(pathname);
    if (!allow) return maintenanceRewriteWithCookies(request, response);
  }

  if (isProtectedPath(pathname) && !signedIn) {
    // Always send anonymous CMS visitors to login — including during
    // maintenance, so admins can still authenticate.
    const target = new URL(
      loginPath({ next: `${pathname}${search}` }),
      request.url,
    );
    return redirectWithCookies(target, response);
  }

  if (AUTH_ONLY_PAGES.has(pathname) && signedIn) {
    // During maintenance only JWT-admins leave /login for the dashboard;
    // DB role is still enforced there. Non-admins stay on login.
    if (!maintenanceOn || isAdminClaim(claims)) {
      return redirectWithCookies(
        new URL(ROUTES.dashboard, request.url),
        response,
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff2?)$).*)",
  ],
};
