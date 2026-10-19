import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  type Locale,
} from "@/constants/locales";
import { PUBLIC_PAGE_SLUG_SET } from "@/constants/public-pages";
import { authPath, ROUTES } from "@/constants/routes";

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) {
    return cookie;
  }

  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .find(Boolean);

  if (preferred?.startsWith("fr")) {
    return "fr";
  }

  return DEFAULT_LOCALE;
}

function withLocaleHeaders(
  response: NextResponse,
  locale: Locale
): NextResponse {
  response.headers.set(LOCALE_HEADER, locale);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function copyCookies(from: NextResponse, to: NextResponse): void {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
}

function isAuthPage(pathname: string): boolean {
  if (
    pathname === ROUTES.login ||
    pathname === ROUTES.signup ||
    pathname === "/register"
  ) {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length === 2 &&
    isLocale(segments[0]) &&
    (segments[1] === "login" ||
      segments[1] === "signup" ||
      segments[1] === "register")
  );
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === ROUTES.dashboard ||
    pathname.startsWith(`${ROUTES.dashboard}/`)
  );
}

async function refreshSupabaseSession(request: NextRequest): Promise<{
  response: NextResponse;
  userId: string | null;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { response: NextResponse.next({ request }), userId: null };
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, userId: user?.id ?? null };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, userId } = await refreshSupabaseSession(request);
  const locale = detectLocale(request);

  if (isProtectedPath(pathname) && !userId) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = authPath(locale, "login");
    loginUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    copyCookies(response, redirect);
    return withLocaleHeaders(redirect, locale);
  }

  if (isAuthPage(pathname) && userId) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = ROUTES.dashboard;
    dashboardUrl.search = "";
    const redirect = NextResponse.redirect(dashboardUrl);
    copyCookies(response, redirect);
    return redirect;
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Root → preferred locale home
  if (pathname === "/") {
    const redirect = NextResponse.redirect(new URL(`/${locale}`, request.url));
    copyCookies(response, redirect);
    return withLocaleHeaders(redirect, locale);
  }

  // Already on a locale route (marketing or localized auth)
  if (first && isLocale(first)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, first);
    const next = NextResponse.next({
      request: { headers: requestHeaders },
    });
    copyCookies(response, next);
    return withLocaleHeaders(next, first);
  }

  // Bare marketing slug → /{locale}/{slug}
  if (
    segments.length === 1 &&
    segments[0] !== "" &&
    PUBLIC_PAGE_SLUG_SET.has(segments[0])
  ) {
    const redirect = NextResponse.redirect(
      new URL(`/${locale}/${segments[0]}`, request.url)
    );
    copyCookies(response, redirect);
    return withLocaleHeaders(redirect, locale);
  }

  // Bare auth / dashboard / other — pass through with preferred locale
  response.headers.set(LOCALE_HEADER, locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
