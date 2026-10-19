import { notFound } from "next/navigation";

import {
  InsightDetailPage,
  insightDetailLabelsFor,
} from "@/components/marketing/insight-detail-page";
import { blogLabelsFor } from "@/components/marketing/blog-labels";
import {
  getInsightBySlug,
  getInsightSlugs,
  getRelatedInsights,
} from "@/data/insights";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug, "en");

  if (!article) {
    return { title: "Insight not found — ASIP" };
  }

  return buildMarketingMetadata({
    locale: "en",
    path: `/insights/${slug}`,
    title: `${article.title} — ASIP`,
    description: article.summary,
    image: article.thumbnailUrl || undefined,
    ogType: "article",
  });
}

export default async function EnInsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    getInsightBySlug(slug, "en"),
    getRelatedInsights(slug, 3, "en"),
  ]);

  if (!article) notFound();

  return (
    <InsightDetailPage
      locale="en"
      article={article}
      related={related}
      labels={insightDetailLabelsFor("en", blogLabelsFor("en"))}
    />
  );
}
