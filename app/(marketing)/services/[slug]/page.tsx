import {
  BlueprintSlugPage,
  blueprintSlugMetadata,
} from "@/components/marketing/blueprint-slug-route";
import {
  SERVICE_PILLAR_BLUEPRINTS,
  blueprintStaticParams,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

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

export default async function ServicePillarPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  return <BlueprintSlugPage hubPath={ROUTES.services} slug={slug} />;
}
