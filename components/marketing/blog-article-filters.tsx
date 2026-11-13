"use client";

import { useMemo, useState } from "react";

import { BlogCard } from "@/components/marketing/blog-card";
import type { BlogLabels } from "@/components/marketing/blog-labels";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { categoryToTabId, type BlogTabId } from "@/constants/blog-ui";
import type { ArticleListItem } from "@/types/article";

type BlogArticleFiltersProps = {
  labels: Pick<BlogLabels, "tabs" | "emptyState">;
  articles: ArticleListItem[];
};

/** Tab filter + article grid — the only interactive part of the insights list. */
export function BlogArticleFilters({
  labels,
  articles,
}: BlogArticleFiltersProps) {
  const [tab, setTab] = useState<BlogTabId>("all");

  const filteredArticles = useMemo(() => {
    if (tab === "all") return articles;
    return articles.filter(
      (article) => categoryToTabId(article.category.name) === tab,
    );
  }, [articles, tab]);

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as BlogTabId)}
        className="min-w-0 w-full"
      >
        <TabsList
          variant="line"
          className="h-auto w-full min-h-11 justify-start overflow-x-auto rounded-none p-0"
        >
          {labels.tabs.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="min-h-11 shrink-0 px-3"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredArticles.length === 0 ? (
        <Text variant="muted">{labels.emptyState}</Text>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <li key={article.id}>
              <BlogCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
