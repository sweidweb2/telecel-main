import {
  BlueprintSlugPage,
  blueprintSlugMetadata,
} from "@/components/marketing/blueprint-slug-route";
import {
  USE_CASE_BLUEPRINTS,
  blueprintStaticParams,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

/** Fixed outcome set — unknown slugs 404 without an on-demand render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return blueprintStaticParams(USE_CASE_BLUEPRINTS, ROUTES.useCases);
}

export async function generateMetadata({
  params,
}: PageProps<"/use-cases/[slug]">) {
  const { slug } = await params;
  return blueprintSlugMetadata(ROUTES.useCases, slug);
}

export default async function UseCasePage({
  params,
}: PageProps<"/use-cases/[slug]">) {
  const { slug } = await params;
  return <BlueprintSlugPage hubPath={ROUTES.useCases} slug={slug} />;
}
