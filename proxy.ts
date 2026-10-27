import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { loginPath, ROUTES } from "@/constants/routes";
import {
  getMaintenanceFlagsForProxy,
  isLoginBlocked,
  isPublicBlocked,
} from "@/lib/maintenance";

/**
 * Optimistic checks only (Next 16 "proxy", formerly middleware):
 * refreshes the Supabase session cookies, enforces maintenance Level 1 / 2,
 * and redirects signed-out visitors away from the CMS. Role, account status
 * and the 24h absolute session lifetime are enforced server-side
 * (data/auth.ts) and in RLS.
 */

const AUTH_ONLY_PAGES = new Set<string>([ROUTES.login]);

/** Legacy self-serve reset URL — contact form is the supported path now. */
const LEGACY_FORGOT_PASSWORD = "/forgot-password";

/** Paths that must stay reachable during Level 2 public maintenance. */
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

/** Carries refreshed session cookies (with their options) onto a redirect. */
function redirectWithCookies(url: URL, from: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

function rewriteWithCookies(url: URL, from: NextResponse): NextResponse {
  const rewrite = NextResponse.rewrite(url);
  for (const cookie of from.cookies.getAll()) {
    rewrite.cookies.set(cookie);
  }
  return rewrite;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims(): it refreshes
  // an expired access token and writes the new cookies through setAll above.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  if (pathname === LEGACY_FORGOT_PASSWORD) {
    const target = new URL(ROUTES.contact, request.url);
    target.searchParams.set("intent", "general");
    return redirectWithCookies(target, response);
  }

  const maintenance = await getMaintenanceFlagsForProxy();
  const loginBlocked = isLoginBlocked(maintenance);
  const publicBlocked = isPublicBlocked(maintenance);

  if (publicBlocked) {
    const allowDashboard = signedIn && isProtectedPath(pathname);
    const passthrough = MAINTENANCE_PASSTHROUGH.has(pathname);
    if (!allowDashboard && !passthrough) {
      return rewriteWithCookies(
        new URL(ROUTES.maintenance, request.url),
        response,
      );
    }
  } else if (loginBlocked && isAuthSurfacePath(pathname)) {
    // Level 1: keep /login reachable so it can show the maintenance message;
    // block callback/confirm from establishing new sessions via rewrite.
    if (
      pathname === ROUTES.authCallback ||
      pathname === ROUTES.authConfirm ||
      pathname === ROUTES.updatePassword
    ) {
      const target = new URL(ROUTES.login, request.url);
      target.searchParams.set("maintenance", "1");
      return redirectWithCookies(target, response);
    }
  }

  if (isProtectedPath(pathname) && !signedIn) {
    if (publicBlocked || loginBlocked) {
      return redirectWithCookies(
        new URL(ROUTES.maintenance, request.url),
        response,
      );
    }
    const target = new URL(
      loginPath({ next: `${pathname}${search}` }),
      request.url,
    );
    return redirectWithCookies(target, response);
  }

  if (AUTH_ONLY_PAGES.has(pathname) && signedIn && !loginBlocked) {
    return redirectWithCookies(new URL(ROUTES.dashboard, request.url), response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff2?)$).*)",
  ],
};
