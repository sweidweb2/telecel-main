import type { MetadataRoute } from "next";

import { ROUTES, insightPath } from "@/constants/routes";
import {
  SITE_LEGAL_LINKS,
  SITE_NAV,
  type SiteNavLink,
} from "@/constants/site-nav";
import { getInsightSlugRows } from "@/data/insights";
import { absoluteUrl } from "@/lib/seo/site";

/** Only routes that exist (`live`) are listed; anchors (#…) never are. */
function liveLinks(): SiteNavLink[] {
  const links = [
    ...SITE_NAV.flatMap((section) => [section, ...(section.children ?? [])]),
    ...SITE_LEGAL_LINKS,
  ];
  const seen = new Set<string>();
  return links.filter((link) => {
    if (!link.live || link.href.includes("#") || seen.has(link.href))
      return false;
    seen.add(link.href);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insightRows = await getInsightSlugRows();
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  function add(path: string, meta: Omit<MetadataRoute.Sitemap[number], "url">) {
    const url = absoluteUrl(path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, ...meta });
  }

  add(ROUTES.home, { changeFrequency: "weekly", priority: 1 });
  add(ROUTES.contact, { changeFrequency: "monthly", priority: 0.9 });

  for (const link of liveLinks()) {
    add(link.href, { changeFrequency: "weekly", priority: 0.8 });
  }

  for (const row of insightRows) {
    add(insightPath(row.slug), {
      lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
