import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { BlogArticleFilters } from "@/components/marketing/blog-article-filters";
import { BlogCard } from "@/components/marketing/blog-card";
import type { BlogLabels } from "@/components/marketing/blog-labels";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { BlogTabId } from "@/constants/blog-ui";
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
  labels: BlogLabels;
  articles: ArticleListItem[];
  featured?: ArticleListItem;
  /** Active category tab from `?category=` — defaults to all. */
  activeTab?: BlogTabId;
};

function FeaturedPost({
  labels,
  article,
}: {
  labels: BlogLabels;
  article: ArticleListItem;
}) {
  const href = insightPath(article.slug);

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
                <Heading
                  level="subtitle"
                  as="p"
                  className="flex-1 text-xl font-semibold text-white lg:text-2xl"
                >
                  {article.title}
                </Heading>
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
        <BlogCard article={article} />
      </div>
    </>
  );
}

/**
 * Insights listing shell (Server Component). Header, featured, and article
 * grid stay on the server; only the category tabs are a client island.
 * `articles` must already be category-filtered in `data/insights`.
 */
export function BlogSection({
  labels,
  articles,
  featured,
  activeTab = "all",
}: BlogSectionProps) {
  const gridArticles = featured
    ? articles.filter((article) => article.id !== featured.id)
    : articles;

  return (
    <main>
      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="flex w-full max-w-3xl flex-col">
            <span className="text-sm font-semibold text-primary">
              {labels.eyebrow}
            </span>
            <Heading level="display" as="h1" className="mt-3">
              {labels.title}
            </Heading>
            <Text variant="lead" className="mt-4 sm:mt-6">
              {labels.description}
            </Text>
          </div>
        </Container>
      </section>

      <Container className="flex flex-col gap-12 pb-16 md:gap-16 lg:pb-24">
        {featured ? <FeaturedPost labels={labels} article={featured} /> : null}

        <div className="flex flex-col gap-8">
          <BlogArticleFilters
            labels={{ tabs: labels.tabs }}
            activeTab={activeTab}
          />

          {gridArticles.length === 0 ? (
            <Text variant="muted">{labels.emptyState}</Text>
          ) : (
            <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <li key={article.id}>
                  <BlogCard article={article} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </main>
  );
}
