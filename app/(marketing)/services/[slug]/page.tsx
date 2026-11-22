import { notFound } from "next/navigation";

import { blueprintSlugMetadata } from "@/components/marketing/blueprint-slug-route";
import { ServicePillarPage } from "@/components/marketing/service-pillar-page";
import {
  SERVICE_PILLAR_BLUEPRINTS,
  blueprintPathForSlug,
  blueprintStaticParams,
  getBlueprintByPath,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";
import { getServicePillar } from "@/constants/service-pillars";

/** Fixed pillar set — unknown slugs 404 without an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return blueprintStaticParams(SERVICE_PILLAR_BLUEPRINTS, ROUTES.services);
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  return blueprintSlugMetadata(ROUTES.services, slug);
}

export default async function ServicePillarRoute({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const pillar = getServicePillar(slug);
  const config = getBlueprintByPath(
    blueprintPathForSlug(ROUTES.services, slug),
  );
  if (!pillar || !config) notFound();
  return (
    <ServicePillarPage
      pillar={pillar}
      title={config.title}
      description={config.description}
    />
  );
}
