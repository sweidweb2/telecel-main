import { blogLabelsFor } from "@/components/marketing/blog-labels";
import { BlogSection } from "@/components/marketing/blog-section";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import { getAllInsights, getFeaturedInsight } from "@/data/insights";

export const metadata = buildMarketingMetadata({
  locale: "en",
  path: "/insights",
  title: "Insights",
  description:
    "Resources and insights from the ASIP programme and African tech ecosystem.",
});

export default async function InsightsPageEn() {
  const [articles, featured] = await Promise.all([
    getAllInsights("en"),
    getFeaturedInsight("en"),
  ]);

  return (
    <BlogSection
      locale="en"
      labels={blogLabelsFor("en")}
      articles={articles}
      featured={featured}
    />
  );
}
