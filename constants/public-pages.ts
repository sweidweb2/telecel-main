/** Marketing page slugs under /en and /fr (home = ""). */
export const PUBLIC_PAGE_SLUGS = [
  "",
  "about",
  "programme",
  "portfolio",
  "insights",
  "apply",
  "contact",
  "faq",
  "terms",
  "privacy",
] as const;

export type PublicPageSlug = (typeof PUBLIC_PAGE_SLUGS)[number];

export const PUBLIC_PAGE_SLUG_SET = new Set<string>(PUBLIC_PAGE_SLUGS);
