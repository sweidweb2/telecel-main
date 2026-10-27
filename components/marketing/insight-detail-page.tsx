import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { BlogCard } from "@/components/marketing/blog-card";
import type { BlogLabels } from "@/components/marketing/blog-labels";
import { JsonLd } from "@/components/seo/json-ld";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import type { Article, ArticleListItem } from "@/types/article";
import { cn } from "@/lib/utils";

function authorInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type InsightDetailLabels = {
  backToInsights: string;
  writtenBy: string;
  publishedOn: string;
  fileUnder: string;
  moreInsights: string;
};

type InsightDetailPageProps = {
  article: Article;
  related: ArticleListItem[];
  labels: InsightDetailLabels;
};

export function InsightDetailPage({
  article,
  related,
  labels,
}: InsightDetailPageProps) {
  const safeHtml = sanitizeBlogHtml(article.bodyHtml);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: article.thumbnailUrl || undefined,
    datePublished: article.datePublishedIso ?? undefined,
    dateModified: article.dateModifiedIso ?? undefined,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
  };

  return (
    <main>
      <JsonLd data={structuredData} />

      <article className="pb-16 lg:pb-24">
        <div className="container-site pt-8 sm:pt-10 lg:pt-12">
          <Link
            href={ROUTES.insights}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "min-h-11 gap-2 px-0 hover:bg-transparent",
            )}
          >
            <ArrowLeft className="size-4" />
            {labels.backToInsights}
          </Link>

          <header className="mt-6 max-w-3xl sm:mt-8">
            <p className="text-sm font-semibold text-primary">
              {article.category.name}
            </p>
            <h1 className="type-display mt-3 text-balance">{article.title}</h1>
            <p className="mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg">
              {article.summary}
            </p>
          </header>
        </div>

        <div className="container-site mt-8 sm:mt-10">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted md:aspect-[2/1]">
            {article.thumbnailUrl ? (
              <Image
                src={article.thumbnailUrl}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            ) : null}
          </div>
        </div>

        <div className="container-site mt-8 sm:mt-10">
          <div className="flex flex-col gap-8 border-b pb-8 sm:flex-row sm:items-end sm:justify-between lg:pb-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">{labels.writtenBy}</p>
                <div className="flex items-center gap-2">
                  <Avatar>
                    {article.author.avatarUrl ? (
                      <AvatarImage src={article.author.avatarUrl} alt="" />
                    ) : null}
                    <AvatarFallback>
                      {authorInitials(article.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-semibold">{article.author.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">{labels.publishedOn}</p>
                <p className="text-sm font-semibold sm:text-base">
                  {article.publishedAt} · {article.readingTime}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">{labels.fileUnder}</p>
              <ul className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li
                    key={tag.name}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border ring-inset"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="container-site mt-8 sm:mt-10">
          <div
            className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>

        {related.length > 0 ? (
          <section className="container-site mt-16 sm:mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="type-section text-balance">{labels.moreInsights}</h2>
              <Link
                href={ROUTES.insights}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "min-h-11 shrink-0 gap-1",
                )}
              >
                {labels.backToInsights}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <BlogCard article={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}

export type { InsightDetailLabels };

export function insightDetailLabelsFor(
  blogLabels: BlogLabels,
): InsightDetailLabels {
  return {
    backToInsights: "Back to insights",
    writtenBy: blogLabels.writtenBy,
    publishedOn: blogLabels.publishedOn,
    fileUnder: blogLabels.fileUnder,
    moreInsights: "More insights",
  };
}
