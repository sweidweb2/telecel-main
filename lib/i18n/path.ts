import { isLocale, type Locale } from "@/constants/locales";

const AUTH_PAGES = new Set(["login", "signup", "register"]);

/** Routes that are not under `/{locale}/…` (bare auth redirects, dashboard). */
function isUnlocalizedAppPath(segments: string[]): boolean {
  const root = segments[0];
  return (
    root === "login" ||
    root === "signup" ||
    root === "register" ||
    root === "dashboard"
  );
}

/**
 * Swap the leading locale segment in a pathname.
 * `/en/portfolio` + `fr` → `/fr/portfolio`; `/en/login` + `fr` → `/fr/login`.
 * Bare `/login` / `/signup` map to localized auth; dashboard maps to locale home.
 */
export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (isLocale(segments[0])) {
    if (segments.length === 2 && AUTH_PAGES.has(segments[1])) {
      const page = segments[1] === "register" ? "signup" : segments[1];
      return `/${nextLocale}/${page}`;
    }
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }

  if (segments[0] === "login" || segments[0] === "signup") {
    return `/${nextLocale}/${segments[0]}`;
  }

  if (segments[0] === "register") {
    return `/${nextLocale}/signup`;
  }

  if (isUnlocalizedAppPath(segments)) {
    return `/${nextLocale}`;
  }

  segments.unshift(nextLocale);
  return `/${segments.join("/")}`;
}

/** Path without leading locale, e.g. `/en/about` → `/about`, `/fr` → `/`. */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "/";
  }
  if (isLocale(segments[0])) {
    segments.shift();
  }
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : null;
}
