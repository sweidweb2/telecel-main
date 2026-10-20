import {
  getFeaturedBlog,
  getPublishedBlogBySlug,
  getPublishedBlogSlugRows,
  getPublishedBlogSlugs,
  getPublishedBlogs,
  getRelatedPublishedBlogs,
} from "@/data/blogs";
import { toArticle, toArticleList } from "@/types/blog";
import type { Article, ArticleListItem } from "@/types/article";
import type { BlogSlugRow } from "@/types/blog";

export async function getAllInsights(): Promise<ArticleListItem[]> {
  const blogs = await getPublishedBlogs();
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

export async function getFeaturedInsight(): Promise<ArticleListItem | undefined> {
  const featured = await getFeaturedBlog();
  if (featured) return toArticleList(featured);

  const blogs = await getPublishedBlogs();
  const first = blogs[0];
  return first ? toArticleList(first) : undefined;
}

export async function getRelatedInsights(
  slug: string,
  limit = 3,
): Promise<ArticleListItem[]> {
  const related = await getRelatedPublishedBlogs(slug, limit);
  return related.map((blog) => toArticleList(blog));
}
