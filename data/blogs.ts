import { unstable_cache } from "next/cache";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { createPublicClient } from "@/lib/supabase/public";
import type { StaffSession } from "@/data/auth";
import type {
  Blog,
  BlogListItem,
  BlogListResult,
  BlogPublicListItem,
  BlogSlugRow,
} from "@/types/blog";
import type { BlogListQuery } from "@/validations/blog";

export const BLOGS_CACHE_TAG = "blogs";

const LIST_COLUMNS =
  "id, slug, title, summary, categories, thumbnail_url, author_name, author_avatar_url, status, is_featured, reading_time_minutes, published_at, created_at, updated_at" as const;

const DETAIL_COLUMNS =
  "id, slug, title, summary, body_html, categories, thumbnail_url, author_name, author_avatar_url, status, is_featured, reading_time_minutes, published_at, created_at, updated_at" as const;

/** Public list / related / featured — no body_html. */
const PUBLIC_LIST_COLUMNS =
  "id, slug, title, summary, categories, thumbnail_url, author_name, author_avatar_url, reading_time_minutes, published_at, is_featured" as const;

/** Public detail by slug — includes body + updated_at for SEO. */
const PUBLIC_DETAIL_COLUMNS =
  "id, slug, title, summary, body_html, categories, thumbnail_url, author_name, author_avatar_url, reading_time_minutes, published_at, updated_at, is_featured" as const;

const PUBLIC_SLUG_COLUMNS = "slug, updated_at" as const;

type ServerClient = StaffSession["supabase"];

async function fetchBlogsPage(
  supabase: ServerClient,
  query: BlogListQuery,
): Promise<BlogListResult> {
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = supabase
    .from("blogs")
    .select(LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (query.status !== "all") {
    request = request.eq("status", query.status);
  }

  if (query.search) {
    request = request.or(
      `title.ilike.%${query.search}%,slug.ilike.%${query.search}%,author_name.ilike.%${query.search}%`,
    );
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    blogs: (data ?? []) as BlogListItem[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

/** Staff-only reads: callers pass the session from requireSection(). */
export async function getBlogsPageData(
  session: StaffSession,
  query: BlogListQuery,
): Promise<BlogListResult> {
  return fetchBlogsPage(session.supabase, query);
}

export async function getBlogByIdForStaff(
  session: StaffSession,
  id: string,
): Promise<Blog | null> {
  const { data, error } = await session.supabase
    .from("blogs")
    .select(DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as Blog | null) ?? null;
}

async function fetchPublishedBlogs(): Promise<BlogPublicListItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(PUBLIC_LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BlogPublicListItem[];
}

async function fetchFeaturedBlog(): Promise<BlogPublicListItem | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(PUBLIC_LIST_COLUMNS)
    .eq("status", "published")
    .eq("is_featured", true)
    .maybeSingle();

  if (error) throw error;
  return (data as BlogPublicListItem | null) ?? null;
}

async function fetchPublishedBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(PUBLIC_DETAIL_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data as Blog | null) ?? null;
}

async function fetchPublishedBlogSlugRows(): Promise<BlogSlugRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(PUBLIC_SLUG_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as BlogSlugRow[];
}

async function fetchRelatedPublishedBlogs(
  slug: string,
  limit: number,
): Promise<BlogPublicListItem[]> {
  const supabase = createPublicClient();

  const { data: current, error: currentError } = await supabase
    .from("blogs")
    .select("id, slug, categories")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (currentError) throw currentError;

  const primary = current?.categories?.[0];
  const results: BlogPublicListItem[] = [];

  if (primary) {
    const { data: sameCategory, error } = await supabase
      .from("blogs")
      .select(PUBLIC_LIST_COLUMNS)
      .eq("status", "published")
      .neq("slug", slug)
      .contains("categories", [primary])
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: true })
      .limit(limit);

    if (error) throw error;
    results.push(...((sameCategory ?? []) as BlogPublicListItem[]));
  }

  if (results.length >= limit) {
    return results.slice(0, limit);
  }

  const excludeIds = [
    ...(current?.id ? [current.id] : []),
    ...results.map((row) => row.id),
  ];
  const remaining = limit - results.length;

  let fallbackQuery = supabase
    .from("blogs")
    .select(PUBLIC_LIST_COLUMNS)
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true })
    .limit(remaining);

  if (excludeIds.length > 0) {
    fallbackQuery = fallbackQuery.not(
      "id",
      "in",
      `(${excludeIds.join(",")})`,
    );
  }

  const { data: extras, error: extrasError } = await fallbackQuery;
  if (extrasError) throw extrasError;

  results.push(...((extras ?? []) as BlogPublicListItem[]));
  return results.slice(0, limit);
}

/**
 * Builds (CI placeholders, or a DB that is briefly unreachable) must not fail
 * on public content reads: fall back to "no articles" while building only.
 * Pages then fill in on the first revalidation. At runtime errors still throw.
 */
async function tolerateDuringBuild<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    console.warn("[blogs] Supabase unreachable during build; rendering without articles.");
    return fallback;
  }
}

const cachedPublishedBlogs = unstable_cache(
  fetchPublishedBlogs,
  ["published-blogs"],
  { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
);

const cachedFeaturedBlog = unstable_cache(
  fetchFeaturedBlog,
  ["featured-blog"],
  { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
);

const cachedPublishedBlogSlugRows = unstable_cache(
  fetchPublishedBlogSlugRows,
  ["published-blog-slug-rows"],
  { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
);

export function getPublishedBlogs(): Promise<BlogPublicListItem[]> {
  return tolerateDuringBuild(cachedPublishedBlogs, []);
}

export function getFeaturedBlog(): Promise<BlogPublicListItem | null> {
  return tolerateDuringBuild(cachedFeaturedBlog, null);
}

export function getPublishedBlogSlugRows(): Promise<BlogSlugRow[]> {
  return tolerateDuringBuild(cachedPublishedBlogSlugRows, []);
}

export async function getPublishedBlogBySlug(
  slug: string,
): Promise<Blog | null> {
  return unstable_cache(
    async () => fetchPublishedBlogBySlug(slug),
    ["published-blog-by-slug", slug],
    { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
  )();
}

export async function getRelatedPublishedBlogs(
  slug: string,
  limit = 3,
): Promise<BlogPublicListItem[]> {
  return unstable_cache(
    async () => fetchRelatedPublishedBlogs(slug, limit),
    ["related-published-blogs", slug, String(limit)],
    { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
  )();
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const rows = await getPublishedBlogSlugRows();
  return rows.map((row) => row.slug);
}
