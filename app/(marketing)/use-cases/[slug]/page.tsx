import { notFound } from "next/navigation";

import { blueprintSlugMetadata } from "@/components/marketing/blueprint-slug-route";
import { JourneyPage } from "@/components/marketing/journey-page";
import { USE_CASE_JOURNEYS } from "@/constants/journeys";
import {
  SOLUTION_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  USE_CASE_BLUEPRINTS,
  blueprintPathForSlug,
  blueprintStaticParams,
  getBlueprintByPath,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

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

export default async function Page({ params }: PageProps<"/use-cases/[slug]">) {
  const { slug } = await params;
  const config = getBlueprintByPath(
    blueprintPathForSlug(ROUTES.useCases, slug),
  );
  const journey = Object.hasOwn(USE_CASE_JOURNEYS, slug)
    ? USE_CASE_JOURNEYS[slug as keyof typeof USE_CASE_JOURNEYS]
    : undefined;
  if (!config || !journey) notFound();
  const related = journey.related.map((relatedSlug) => ({
    href: marketingChildPath(ROUTES.solutions, relatedSlug),
    title:
      SOLUTION_PAGES.find((page) => page.slug === relatedSlug)?.title ??
      relatedSlug,
  }));
  return (
    <JourneyPage
      hub={{ href: ROUTES.useCases, label: "Use Cases" }}
      title={config.title}
      description={config.description}
      intro={config.metaDescription}
      journey={journey}
      related={related}
      relatedLabel="Who this is for"
      showDemo={true}
    />
  );
}
