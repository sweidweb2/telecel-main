import {
  BlueprintSlugPage,
  blueprintSlugMetadata,
} from "@/components/marketing/blueprint-slug-route";
import {
  SOLUTION_BLUEPRINTS,
  blueprintStaticParams,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export function generateStaticParams() {
  return blueprintStaticParams(SOLUTION_BLUEPRINTS, ROUTES.solutions);
}

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  return blueprintSlugMetadata(ROUTES.solutions, slug);
}

export default async function SolutionPage({
  params,
}: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  return <BlueprintSlugPage hubPath={ROUTES.solutions} slug={slug} />;
}
