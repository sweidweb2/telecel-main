"use client";

import { useSearchParams } from "next/navigation";

import { BlogArticleFilters } from "@/components/marketing/blog-article-filters";
import { BlogCard } from "@/components/marketing/blog-card";
import type { BlogLabels } from "@/components/marketing/blog-labels";
import { Text } from "@/components/ui/text";
import {
  BLOG_TAB_IDS,
  categoryLabelForTab,
  type BlogTabId,
} from "@/constants/blog-ui";
import type { ArticleListItem } from "@/types/article";

type BlogArticlesPanelProps = {
  labels: BlogLabels;
  articles: ArticleListItem[];
  featuredId?: string;
};

function parseCategoryTab(value: string | null): BlogTabId {
  if (value && BLOG_TAB_IDS.includes(value as BlogTabId)) {
    return value as BlogTabId;
  }
  return "all";
}

/**
 * Category tabs + filtered grid. Reads `?category=` on the client so the
 * insights page can stay fully static (one cached article list).
 */
export function BlogArticlesPanel({
  labels,
  articles,
  featuredId,
}: BlogArticlesPanelProps) {
  const searchParams = useSearchParams();
  const activeTab = parseCategoryTab(searchParams.get("category"));
  const label = categoryLabelForTab(activeTab);

  const filtered = articles.filter((article) => {
    if (featuredId && article.id === featuredId) return false;
    if (!label) return true;
    return (
      article.category.name === label ||
      article.tags.some((tag) => tag.name === label)
    );
  });

  return (
    <div className="flex flex-col gap-8">
      <BlogArticleFilters
        labels={{ tabs: labels.tabs }}
        activeTab={activeTab}
      />

      {filtered.length === 0 ? (
        <Text variant="muted">{labels.emptyState}</Text>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <li key={article.id}>
              <BlogCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
