import { notFound } from "next/navigation";

import { BLOG_LABELS } from "@/components/marketing/blog-labels";
import {
  InsightDetailPage,
  insightDetailLabelsFor,
} from "@/components/marketing/insight-detail-page";
import { insightPath } from "@/constants/routes";
import {
  getInsightBySlug,
  getInsightSlugs,
  getRelatedInsights,
} from "@/data/insights";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import { SITE_NAME } from "@/lib/seo/site";

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);

  if (!article) return { title: `Insight not found — ${SITE_NAME}` };

  return buildMarketingMetadata({
    path: insightPath(slug),
    title: `${article.title} — ${SITE_NAME}`,
    description: article.summary,
    image: article.thumbnailUrl || undefined,
    ogType: "article",
  });
}

export default async function InsightDetailRoute({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    getInsightBySlug(slug),
    getRelatedInsights(slug, 3),
  ]);

  if (!article) notFound();

  return (
    <InsightDetailPage
      article={article}
      related={related}
      labels={insightDetailLabelsFor(BLOG_LABELS)}
    />
  );
}
