import { unstable_cache } from "next/cache";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { cache } from "react";

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

import {
  BLOGS_CACHE_TAG,
  BLOGS_REVALIDATE_SECONDS,
  blogSlugTag,
} from "@/lib/cache-tags";

export { BLOGS_CACHE_TAG };

const LIST_COLUMNS =
  "id, slug, title, summary, categories, thumbnail_url, author_name, author_avatar_url, status, is_featured, reading_time_minutes, published_at, created_at, updated_at" as const;

const DETAIL_COLUMNS =
  "id, slug, title, summary, body_html, categories, thumbnail_url, author_name, author_avatar_url, status, is_featured, reading_time_minutes, published_at, created_at, updated_at" as const;

/** Public list / related / featured / sitemap — no body_html. */
const PUBLIC_LIST_COLUMNS =
  "id, slug, title, summary, categories, thumbnail_url, author_name, author_avatar_url, reading_time_minutes, published_at, updated_at, is_featured" as const;

/** Public detail by slug — includes body + updated_at for SEO. */
const PUBLIC_DETAIL_COLUMNS =
  "id, slug, title, summary, body_html, categories, thumbnail_url, author_name, author_avatar_url, reading_time_minutes, published_at, updated_at, is_featured" as const;

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

/** Soft ceiling for the in-memory public list (related/featured/sitemap). */
const PUBLISHED_LIST_WARN_AT = 500;

async function fetchPublishedBlogs(): Promise<BlogPublicListItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(PUBLIC_LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as BlogPublicListItem[];
  if (rows.length >= PUBLISHED_LIST_WARN_AT) {
    console.warn(
      `[blogs] published list has ${rows.length} rows; consider paginated related/featured reads`,
    );
  }
  return rows;
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

function relatedFromPublishedList(
  blogs: BlogPublicListItem[],
  slug: string,
  limit: number,
): BlogPublicListItem[] {
  const current = blogs.find((blog) => blog.slug === slug);
  if (!current) return [];

  const primary = current.categories?.[0];
  const others = blogs.filter((blog) => blog.slug !== slug);
  const sameCategory = primary
    ? others.filter((blog) => blog.categories?.includes(primary))
    : [];
  const sameIds = new Set(sameCategory.map((blog) => blog.id));
  const extras = others.filter((blog) => !sameIds.has(blog.id));

  return [...sameCategory, ...extras].slice(0, limit);
}

/**
 * Builds (CI placeholders, or a DB that is briefly unreachable) must not fail
 * on public content reads: fall back to "no articles" while building only.
 * Pages then fill in on the first revalidation. At runtime errors still throw.
 */
async function tolerateDuringBuild<T>(
  load: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    console.warn(
      "[blogs] Supabase unreachable during build; rendering without articles.",
    );
    return fallback;
  }
}

const cachedPublishedBlogs = unstable_cache(
  fetchPublishedBlogs,
  ["published-blogs"],
  { tags: [BLOGS_CACHE_TAG], revalidate: BLOGS_REVALIDATE_SECONDS },
);

/** Request-deduped; still backed by unstable_cache across requests. */
export const getPublishedBlogs = cache((): Promise<BlogPublicListItem[]> => {
  return tolerateDuringBuild(cachedPublishedBlogs, []);
});

/** Filter the cached published list by category label (no extra DB round trip). */
export async function getPublishedBlogsByCategory(
  categoryLabel: string,
): Promise<BlogPublicListItem[]> {
  const blogs = await getPublishedBlogs();
  return blogs.filter((blog) => blog.categories?.includes(categoryLabel));
}

export async function getFeaturedBlog(): Promise<BlogPublicListItem | null> {
  const blogs = await getPublishedBlogs();
  return blogs.find((blog) => blog.is_featured) ?? null;
}

/** Newest published post — used when no explicit featured flag is set. */
export async function getLatestPublishedBlog(): Promise<BlogPublicListItem | null> {
  const blogs = await getPublishedBlogs();
  return blogs[0] ?? null;
}

export async function getPublishedBlogSlugRows(): Promise<BlogSlugRow[]> {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
    updated_at: blog.updated_at,
  }));
}

/** Dedupes generateMetadata + page within one request; still cached across requests. */
export const getPublishedBlogBySlug = cache(
  async (slug: string): Promise<Blog | null> => {
    return tolerateDuringBuild(
      () =>
        unstable_cache(
          async () => fetchPublishedBlogBySlug(slug),
          ["published-blog-by-slug", slug],
          {
            tags: [BLOGS_CACHE_TAG, blogSlugTag(slug)],
            revalidate: BLOGS_REVALIDATE_SECONDS,
          },
        )(),
      null,
    );
  },
);

export async function getRelatedPublishedBlogs(
  slug: string,
  limit = 3,
): Promise<BlogPublicListItem[]> {
  const blogs = await getPublishedBlogs();
  return relatedFromPublishedList(blogs, slug, limit);
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const rows = await getPublishedBlogSlugRows();
  return rows.map((row) => row.slug);
}
