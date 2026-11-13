import { PageBlueprint } from "@/components/marketing/page-blueprint";
import type { PageBlueprintConfig } from "@/constants/page-blueprints";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

/** Metadata helper for blueprint marketing pages. */
export function blueprintMetadata(config: PageBlueprintConfig) {
  return buildMarketingMetadata({
    path: config.path,
    title: config.metaTitle,
    description: config.metaDescription,
  });
}

/** Renders a full public page from a blueprint config. */
export function BlueprintPage({ config }: { config: PageBlueprintConfig }) {
  return (
    <PageBlueprint
      eyebrow={config.eyebrow}
      title={config.title}
      description={config.description}
      sections={config.sections}
    />
  );
}
