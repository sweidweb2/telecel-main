import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  MarketingPageView,
  marketingPageMetadata,
} from "@/components/marketing/page-blueprint";
import { marketingChildPath } from "@/constants/marketing-pages";
import {
  blueprintStaticParams,
  getBlueprintByPath,
} from "@/constants/page-blueprints";
import type { PageBlueprintConfig } from "@/types/marketing-blueprint";

type HubParams = { params: Promise<{ slug: string }> };

/**
 * Shared exports for hub child routes (`/services/[slug]`, etc.).
 * Keeps the three nearly identical page files as thin wrappers.
 */
export function createBlueprintHubPage(
  hubPath: string,
  blueprints: readonly PageBlueprintConfig[],
) {
  return {
    dynamicParams: false as const,
    generateStaticParams() {
      return blueprintStaticParams(blueprints, hubPath);
    },
    async generateMetadata({ params }: HubParams): Promise<Metadata> {
      const { slug } = await params;
      const config = getBlueprintByPath(marketingChildPath(hubPath, slug));
      if (!config) return {};
      return marketingPageMetadata(config);
    },
    async Page({ params }: HubParams) {
      const { slug } = await params;
      const config = getBlueprintByPath(marketingChildPath(hubPath, slug));
      if (!config) notFound();
      return <MarketingPageView config={config} />;
    },
  };
}
