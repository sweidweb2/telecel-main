import { blogLabelsFor } from "@/components/marketing/blog-labels";
import { BlogSection } from "@/components/marketing/blog-section";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import { getAllInsights, getFeaturedInsight } from "@/data/insights";

export const metadata = buildMarketingMetadata({
  locale: "fr",
  path: "/insights",
  title: "Perspectives",
  description:
    "Ressources et analyses du programme ASIP et de l’écosystème tech africain.",
});

export default async function InsightsPageFr() {
  const [articles, featured] = await Promise.all([
    getAllInsights("fr"),
    getFeaturedInsight("fr"),
  ]);

  return (
    <BlogSection
      locale="fr"
      labels={blogLabelsFor("fr")}
      articles={articles}
      featured={featured}
    />
  );
}
