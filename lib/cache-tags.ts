/**
 * Cache tags shared by cached reads (data/*) and the server actions that
 * invalidate them. Dependency-free so both sides (and tests) can import it.
 * See Docs/02-architecture/caching.md.
 */

/** Every public blog read: listings, featured, sitemap slugs, details. */
export const BLOGS_CACHE_TAG = "blogs";

/** Seconds a public blog read may be served before a background refresh. */
export const BLOGS_REVALIDATE_SECONDS = 300;

/** Per-article tag so a single detail page can be expired on its own. */
export function blogSlugTag(slug: string): string {
  return `${BLOGS_CACHE_TAG}:slug:${slug}`;
}
