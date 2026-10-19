export type ArticleTag = {
  name: string;
  color: string;
  href: string;
};

export type ArticleAuthor = {
  name: string;
  href: string;
  avatarUrl: string;
};

export type ArticleCategory = {
  name: string;
  href: string;
};

/** Card / list / related — no HTML body. */
export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  href: string;
  category: ArticleCategory;
  thumbnailUrl: string;
  publishedAt: string;
  readingTime: string;
  author: ArticleAuthor;
  tags: ArticleTag[];
  isFeatured?: boolean;
};

/** Detail page — includes body + ISO dates for SEO. */
export type Article = ArticleListItem & {
  /** Sanitized HTML body for the detail page. */
  bodyHtml: string;
  datePublishedIso: string | null;
  dateModifiedIso: string | null;
};
