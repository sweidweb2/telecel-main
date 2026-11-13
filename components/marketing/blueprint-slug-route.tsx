import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlueprintPage,
  blueprintMetadata,
} from "@/components/marketing/blueprint-page";
import {
  blueprintPathForSlug,
  getBlueprintByPath,
} from "@/constants/page-blueprints";

/** Metadata for a hub child blueprint (`/services/[slug]`, etc.). */
export function blueprintSlugMetadata(hubPath: string, slug: string): Metadata {
  const config = getBlueprintByPath(blueprintPathForSlug(hubPath, slug));
  if (!config) return {};
  return blueprintMetadata(config);
}

/** Resolve a hub child blueprint or 404. */
export function BlueprintSlugPage({
  hubPath,
  slug,
}: {
  hubPath: string;
  slug: string;
}) {
  const config = getBlueprintByPath(blueprintPathForSlug(hubPath, slug));
  if (!config) notFound();
  return <BlueprintPage config={config} />;
}
