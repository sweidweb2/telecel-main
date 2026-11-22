import { Suspense } from "react";

import { BLOG_LABELS } from "@/components/marketing/blog-labels";
import { BlogSection } from "@/components/marketing/blog-section";
import { ROUTES } from "@/constants/routes";
import { getAllInsights, getFeaturedInsight } from "@/data/insights";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

/** ISR backstop; CMS actions expire the "blogs" tag immediately on change. */
export const revalidate = 300;

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

  return (
    <Suspense fallback={null}>
      <BlogSection
        labels={BLOG_LABELS}
        articles={articles}
        featured={featured}
      />
    </Suspense>
  );
}
