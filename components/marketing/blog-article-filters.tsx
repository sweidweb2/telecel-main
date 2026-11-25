"use client";

import { useRouter } from "nextjs-toploader/app";

import type { BlogLabels } from "@/components/marketing/blog-labels";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type BlogTabId } from "@/constants/blog-ui";
import { ROUTES } from "@/constants/routes";

type BlogArticleFiltersProps = {
  labels: Pick<BlogLabels, "tabs">;
  activeTab: BlogTabId;
};

/**
 * Category tabs only — filter state lives in `?category=` so the article
 * grid stays a Server Component (BlogCard never enters the client graph).
 */
export function BlogArticleFilters({
  labels,
  activeTab,
}: BlogArticleFiltersProps) {
  const router = useRouter();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const next = value as BlogTabId;
        const href =
          next === "all"
            ? ROUTES.insights
            : `${ROUTES.insights}?category=${next}`;
        router.replace(href, { scroll: false });
      }}
      className="min-w-0 w-full"
    >
      <TabsList
        variant="line"
        className="no-scrollbar h-auto w-full min-h-11 justify-start overflow-x-auto overflow-y-hidden rounded-none p-0"
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
  );
}
