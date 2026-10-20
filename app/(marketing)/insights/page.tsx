import { BLOG_LABELS } from "@/components/marketing/blog-labels";
import { BlogSection } from "@/components/marketing/blog-section";
import { ROUTES } from "@/constants/routes";
import { getAllInsights, getFeaturedInsight } from "@/data/insights";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  path: ROUTES.insights,
  title: "Insights",
  description: "News, announcements and perspectives from Telecel Global.",
});

export default async function InsightsPage() {
  const [articles, featured] = await Promise.all([
    getAllInsights(),
    getFeaturedInsight(),
  ]);

  return <BlogSection labels={BLOG_LABELS} articles={articles} featured={featured} />;
}
