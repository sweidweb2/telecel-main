import { notFound } from "next/navigation";

import { blueprintSlugMetadata } from "@/components/marketing/blueprint-slug-route";
import { JourneyPage } from "@/components/marketing/journey-page";
import { SOLUTION_JOURNEYS } from "@/constants/journeys";
import {
  USE_CASE_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  SOLUTION_BLUEPRINTS,
  blueprintPathForSlug,
  blueprintStaticParams,
  getBlueprintByPath,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return blueprintStaticParams(SOLUTION_BLUEPRINTS, ROUTES.solutions);
}

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  return blueprintSlugMetadata(ROUTES.solutions, slug);
}

export default async function Page({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const config = getBlueprintByPath(
    blueprintPathForSlug(ROUTES.solutions, slug),
  );
  const journey = Object.hasOwn(SOLUTION_JOURNEYS, slug)
    ? SOLUTION_JOURNEYS[slug as keyof typeof SOLUTION_JOURNEYS]
    : undefined;
  if (!config || !journey) notFound();
  const related = journey.related.map((relatedSlug) => ({
    href: marketingChildPath(ROUTES.useCases, relatedSlug),
    title:
      USE_CASE_PAGES.find((page) => page.slug === relatedSlug)?.title ??
      relatedSlug,
  }));
  return (
    <JourneyPage
      hub={{ href: ROUTES.solutions, label: "Solutions" }}
      title={config.title}
      description={config.description}
      intro={config.metaDescription}
      journey={journey}
      related={related}
      relatedLabel="Outcomes to explore"
      showDemo={false}
    />
  );
}
