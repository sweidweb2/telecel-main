import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { loginPath, ROUTES } from "@/constants/routes";

/**
 * Optimistic checks only (Next 16 "proxy", formerly middleware):
 * refreshes the Supabase session cookies and redirects signed-out visitors
 * away from the CMS. Role, account status and the 24h absolute session
 * lifetime are enforced server-side (data/auth.ts) and in RLS.
 */

const AUTH_ONLY_PAGES = new Set<string>([ROUTES.login, ROUTES.forgotPassword]);

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === ROUTES.dashboard || pathname.startsWith(`${ROUTES.dashboard}/`)
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
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims(): it refreshes
  // an expired access token and writes the new cookies through setAll above.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  if (isProtectedPath(pathname) && !signedIn) {
    const target = new URL(
      loginPath({ next: `${pathname}${search}` }),
      request.url
    );
    return redirectWithCookies(target, response);
  }

  if (AUTH_ONLY_PAGES.has(pathname) && signedIn) {
    return redirectWithCookies(new URL(ROUTES.dashboard, request.url), response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff2?)$).*)",
  ],
};
