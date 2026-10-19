import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
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

type ServerClient = Awaited<ReturnType<typeof createClient>>;

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

export async function getBlogsPageData(
  query: BlogListQuery,
): Promise<
  | { status: "forbidden" }
  | { status: "ok"; list: BlogListResult }
> {
  const supabase = await createClient();
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw adminError;
  if (!isAdmin) return { status: "forbidden" };

  const list = await fetchBlogsPage(supabase, query);
  return { status: "ok", list };
}

export async function getBlogByIdForAdmin(
  id: string,
): Promise<
  | { status: "forbidden" }
  | { status: "not_found" }
  | { status: "ok"; blog: Blog }
> {
  const supabase = await createClient();
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) throw adminError;
  if (!isAdmin) return { status: "forbidden" };

  const { data, error } = await supabase
    .from("blogs")
    .select(DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { status: "not_found" };
  return { status: "ok", blog: data as Blog };
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

export const getPublishedBlogs = unstable_cache(
  fetchPublishedBlogs,
  ["published-blogs"],
  { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
);

export const getFeaturedBlog = unstable_cache(
  fetchFeaturedBlog,
  ["featured-blog"],
  { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
);

export const getPublishedBlogSlugRows = unstable_cache(
  fetchPublishedBlogSlugRows,
  ["published-blog-slug-rows"],
  { tags: [BLOGS_CACHE_TAG], revalidate: 300 },
);

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
