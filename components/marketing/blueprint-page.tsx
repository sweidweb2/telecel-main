import { PageBlueprint } from "@/components/marketing/page-blueprint";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import type { PageBlueprintConfig } from "@/types/marketing-blueprint";

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
