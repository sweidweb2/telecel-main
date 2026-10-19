import {
  getFeaturedBlog,
  getPublishedBlogBySlug,
  getPublishedBlogSlugRows,
  getPublishedBlogSlugs,
  getPublishedBlogs,
  getRelatedPublishedBlogs,
} from "@/data/blogs";
import type { Locale } from "@/constants/locales";
import { insightPath } from "@/constants/routes";
import { toArticle, toArticleList } from "@/types/blog";
import type { Article, ArticleListItem } from "@/types/article";
import type { BlogSlugRow } from "@/types/blog";

export async function getAllInsights(
  locale: Locale = "en",
): Promise<ArticleListItem[]> {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => toArticleList(blog, locale));
}

export async function getInsightSlugs(): Promise<string[]> {
  return getPublishedBlogSlugs();
}

export async function getInsightSlugRows(): Promise<BlogSlugRow[]> {
  return getPublishedBlogSlugRows();
}

export async function getInsightBySlug(
  slug: string,
  locale: Locale = "en",
): Promise<Article | undefined> {
  const blog = await getPublishedBlogBySlug(slug);
  return blog ? toArticle(blog, locale) : undefined;
}

export async function getFeaturedInsight(
  locale: Locale = "en",
): Promise<ArticleListItem | undefined> {
  const featured = await getFeaturedBlog();
  if (featured) return toArticleList(featured, locale);

  const blogs = await getPublishedBlogs();
  const first = blogs[0];
  return first ? toArticleList(first, locale) : undefined;
}

export async function getRelatedInsights(
  slug: string,
  limit = 3,
  locale: Locale = "en",
): Promise<ArticleListItem[]> {
  const related = await getRelatedPublishedBlogs(slug, limit);
  return related.map((blog) => toArticleList(blog, locale));
}

export function insightHref(locale: Locale, slug: string): string {
  return insightPath(locale, slug);
}
