import { blueprintMetadata } from "@/components/marketing/blueprint-page";
import { JourneyIndex } from "@/components/marketing/journey-page";
import {
  SOLUTION_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  SOLUTIONS_HUB_BLUEPRINT,
  getBlueprintByPath,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export const metadata = blueprintMetadata(SOLUTIONS_HUB_BLUEPRINT);

const items = SOLUTION_PAGES.map((page) => {
  const href = marketingChildPath(ROUTES.solutions, page.slug);
  return {
    href,
    title: page.title,
    summary: getBlueprintByPath(href)?.description,
  };
});

export default function Page() {
  return (
    <JourneyIndex
      eyebrow={SOLUTIONS_HUB_BLUEPRINT.eyebrow ?? ""}
      title={SOLUTIONS_HUB_BLUEPRINT.title}
      description={SOLUTIONS_HUB_BLUEPRINT.description}
      items={items}
    />
  );
}
