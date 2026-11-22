import { categoryLabelForTab, type BlogTabId } from "@/constants/blog-ui";
import {
  getFeaturedBlog,
  getLatestPublishedBlog,
  getPublishedBlogBySlug,
  getPublishedBlogSlugRows,
  getPublishedBlogSlugs,
  getPublishedBlogs,
  getPublishedBlogsByCategory,
  getRelatedPublishedBlogs,
} from "@/data/blogs";
import { toArticle, toArticleList } from "@/types/blog";
import type { Article, ArticleListItem } from "@/types/article";
import type { BlogSlugRow } from "@/types/blog";

export async function getAllInsights(): Promise<ArticleListItem[]> {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => toArticleList(blog));
}

/**
 * Public insights list filtered from the cached published list when a
 * category tab is active (`blogs.categories` label match).
 */
export async function getInsights(
  categoryTab: BlogTabId = "all",
): Promise<ArticleListItem[]> {
  const label = categoryLabelForTab(categoryTab);
  if (!label) return getAllInsights();

  const blogs = await getPublishedBlogsByCategory(label);
  return blogs.map((blog) => toArticleList(blog));
}

export async function getInsightSlugs(): Promise<string[]> {
  return getPublishedBlogSlugs();
}

export async function getInsightSlugRows(): Promise<BlogSlugRow[]> {
  return getPublishedBlogSlugRows();
}

export async function getInsightBySlug(
  slug: string,
): Promise<Article | undefined> {
  const blog = await getPublishedBlogBySlug(slug);
  return blog ? toArticle(blog) : undefined;
}

export async function getFeaturedInsight(): Promise<
  ArticleListItem | undefined
> {
  // Prefer explicit featured; otherwise newest published (same cached list).
  const featured = await getFeaturedBlog();
  if (featured) return toArticleList(featured);

  const latest = await getLatestPublishedBlog();
  return latest ? toArticleList(latest) : undefined;
}

export async function getRelatedInsights(
  slug: string,
  limit = 3,
): Promise<ArticleListItem[]> {
  const related = await getRelatedPublishedBlogs(slug, limit);
  return related.map((blog) => toArticleList(blog));
}
