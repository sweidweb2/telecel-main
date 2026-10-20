import type { Tables } from "@/types/database";
import type { Article, ArticleListItem } from "@/types/article";
import { insightPath } from "@/constants/routes";
import { format } from "date-fns";

export type BlogStatus = "draft" | "published";

export type Blog = Tables<"blogs">;

export type BlogListItem = Pick<
  Blog,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "categories"
  | "thumbnail_url"
  | "author_name"
  | "author_avatar_url"
  | "status"
  | "is_featured"
  | "reading_time_minutes"
  | "published_at"
  | "created_at"
  | "updated_at"
>;

/** Public list/related row (no body_html). */
export type BlogPublicListItem = Pick<
  Blog,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "categories"
  | "thumbnail_url"
  | "author_name"
  | "author_avatar_url"
  | "reading_time_minutes"
  | "published_at"
  | "is_featured"
>;

export type BlogSlugRow = Pick<Blog, "slug" | "updated_at">;

export type BlogListResult = {
  blogs: BlogListItem[];
  total: number;
  totalPages: number;
};

function readingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

function formatPublishedAt(value: string | null): string {
  if (!value) return "Draft";
  return format(new Date(value), "d MMM yyyy");
}

function toArticleListFields(blog: BlogPublicListItem): ArticleListItem {
  const categories = blog.categories ?? [];
  const primary = categories[0] ?? "General";

  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    summary: blog.summary,
    href: insightPath(blog.slug),
    category: { name: primary, href: "#" },
    thumbnailUrl: blog.thumbnail_url ?? "",
    publishedAt: formatPublishedAt(blog.published_at),
    readingTime: readingTimeLabel(blog.reading_time_minutes),
    author: {
      name: blog.author_name,
      href: "#",
      avatarUrl: blog.author_avatar_url ?? "",
    },
    tags: categories.map((name) => ({
      name,
      color: "gray",
      href: "#",
    })),
    isFeatured: blog.is_featured,
  };
}

/** Maps a public list row to marketing card shape (no body). */
export function toArticleList(blog: BlogPublicListItem): ArticleListItem {
  return toArticleListFields(blog);
}

/** Maps a DB blog detail row to the marketing `Article` shape. */
export function toArticle(
  blog: Pick<
    Blog,
    | "id"
    | "slug"
    | "title"
    | "summary"
    | "body_html"
    | "categories"
    | "thumbnail_url"
    | "author_name"
    | "author_avatar_url"
    | "reading_time_minutes"
    | "published_at"
    | "updated_at"
    | "is_featured"
  >,
): Article {
  return {
    ...toArticleListFields(blog),
    bodyHtml: blog.body_html,
    datePublishedIso: blog.published_at,
    dateModifiedIso: blog.updated_at,
  };
}
