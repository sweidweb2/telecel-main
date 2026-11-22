import { BLOG_LABELS } from "@/components/marketing/blog-labels";
import { BlogSection } from "@/components/marketing/blog-section";
import { BLOG_TAB_IDS, type BlogTabId } from "@/constants/blog-ui";
import { ROUTES } from "@/constants/routes";
import { getFeaturedInsight, getInsights } from "@/data/insights";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  path: ROUTES.insights,
  title: "Insights",
  description: "News, announcements and perspectives from Telecel Global.",
});

function parseCategoryTab(value: string | string[] | undefined): BlogTabId {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && BLOG_TAB_IDS.includes(raw as BlogTabId)) {
    return raw as BlogTabId;
  }
  return "all";
}

export default async function InsightsPage({
  searchParams,
}: PageProps<"/insights">) {
  const params = await searchParams;
  const activeTab = parseCategoryTab(params.category);

  const [articles, featured] = await Promise.all([
    getInsights(activeTab),
    getFeaturedInsight(),
  ]);

  return (
    <BlogSection
      labels={BLOG_LABELS}
      articles={articles}
      featured={featured}
      activeTab={activeTab}
    />
  );
}
