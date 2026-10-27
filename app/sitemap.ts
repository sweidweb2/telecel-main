import type { MetadataRoute } from "next";

import { ROUTES, insightPath } from "@/constants/routes";
import { SITE_NAV, type SiteNavLink } from "@/constants/site-nav";
import { getInsightSlugRows } from "@/data/insights";
import { absoluteUrl } from "@/lib/seo/site";

/** Only routes that exist (`live`) are listed; anchors (#…) never are. */
function liveLinks(): SiteNavLink[] {
  const links = SITE_NAV.flatMap((section) => [section, ...(section.children ?? [])]);
  const seen = new Set<string>();
  return links.filter((link) => {
    if (!link.live || link.href.includes("#") || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insightRows = await getInsightSlugRows();

  return [
    { url: absoluteUrl(ROUTES.home), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl(ROUTES.contact),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...liveLinks().map((link) => ({
      url: absoluteUrl(link.href),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...insightRows.map((row) => ({
      url: absoluteUrl(insightPath(row.slug)),
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
