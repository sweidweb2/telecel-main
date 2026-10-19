export const RECOMMENDED_BLOG_CATEGORIES = [
  "Design",
  "Product",
  "Software Engineering",
  "Customer Success",
  "Leadership",
  "Research",
] as const;

export type RecommendedBlogCategory =
  (typeof RECOMMENDED_BLOG_CATEGORIES)[number];
