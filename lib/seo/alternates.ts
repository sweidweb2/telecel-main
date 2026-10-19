import type { Metadata } from "next";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/constants/locales";
import { absoluteUrl } from "@/lib/seo/site";

/** Absolute or root-relative public URL for a locale + path (path without locale). */
export function localeUrl(locale: Locale, path: string = "/"): string {
  const normalized =
    path === "/" || path === ""
      ? `/${locale}`
      : `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
  return absoluteUrl(normalized);
}

/**
 * Canonical + hreflang alternates for a marketing page.
 * @param path - Path without locale, e.g. `/about` or `/`.
 */
export function pageAlternates(
  locale: Locale,
  path: string = "/"
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {
    "x-default": localeUrl(DEFAULT_LOCALE, path),
  };
  for (const loc of LOCALES) {
    languages[loc] = localeUrl(loc, path);
  }

  return {
    canonical: localeUrl(locale, path),
    languages,
  };
}

export function pageOpenGraph(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  imageUrl = "/opengraph-image.png",
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    locale: locale === "fr" ? "fr_FR" : "en_GB",
    alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
    url: localeUrl(locale, path),
    type: "website",
    siteName: "ASIP",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}
