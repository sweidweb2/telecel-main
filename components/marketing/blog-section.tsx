"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { BlogCard } from "@/components/marketing/blog-card";
import type { BlogLabels } from "@/components/marketing/blog-labels";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryToTabId, type BlogTabId } from "@/constants/blog-ui";
import type { Locale } from "@/constants/locales";
import { insightPath } from "@/constants/routes";
import type { ArticleListItem } from "@/types/article";

function authorInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type BlogSectionProps = {
  locale: Locale;
  labels: BlogLabels;
  articles: ArticleListItem[];
  featured?: ArticleListItem;
};

function FeaturedPost({
  locale,
  labels,
  article,
}: {
  locale: Locale;
  labels: BlogLabels;
  article: ArticleListItem;
}) {
  const href = insightPath(locale, article.slug);

  return (
    <>
      <Link
        href={href}
        className="relative hidden w-full overflow-hidden rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:block md:h-[28rem] lg:h-[36rem]"
      >
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1152px) 100vw, 1152px"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-x-0 bottom-0 w-full bg-linear-to-t from-black/60 to-transparent pt-24">
          <div className="flex w-full flex-col gap-6 p-6 lg:p-8">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <p className="flex-1 font-heading text-xl font-semibold text-white text-balance lg:text-2xl">
                  {article.title}
                </p>
                <ArrowUpRight className="size-6 shrink-0 text-white" />
              </div>
              <p className="line-clamp-2 text-sm text-white/90 sm:text-base">
                {article.summary}
              </p>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-white">
                    {labels.writtenBy}
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      {article.author.avatarUrl ? (
                        <AvatarImage src={article.author.avatarUrl} alt="" />
                      ) : null}
                      <AvatarFallback>
                        {authorInitials(article.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold text-white">
                      {article.author.name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-white">
                    {labels.publishedOn}
                  </p>
                  <div className="flex h-10 items-center">
                    <p className="text-sm font-semibold text-white sm:text-base">
                      {article.publishedAt}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-white">
                  {labels.fileUnder}
                </p>
                <ul className="flex min-h-10 flex-wrap items-center gap-2">
                  {article.tags.map((tag) => (
                    <li
                      key={tag.name}
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white ring-inset"
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="md:hidden">
        <BlogCard locale={locale} article={article} />
      </div>
    </>
  );
}

export function BlogSection({
  locale,
  labels,
  articles,
  featured,
}: BlogSectionProps) {
  const [tab, setTab] = useState<BlogTabId>("all");

  const filteredArticles = useMemo(() => {
    if (tab === "all") return articles;
    return articles.filter(
      (article) => categoryToTabId(article.category.name) === tab,
    );
  }, [articles, tab]);

  return (
    <main>
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex w-full max-w-3xl flex-col">
            <span className="text-sm font-semibold text-primary">
              {labels.eyebrow}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {labels.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg">
              {labels.description}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 sm:px-6 md:gap-16 lg:pb-24">
        {featured ? (
          <FeaturedPost locale={locale} labels={labels} article={featured} />
        ) : null}

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
          <p className="text-muted-foreground">{labels.emptyState}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <li key={article.id}>
                <BlogCard locale={locale} article={article} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
