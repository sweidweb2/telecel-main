import { marketingPageMetadata } from "@/components/marketing/page-blueprint";
import { JourneyIndex } from "@/components/marketing/journey-page";
import {
  USE_CASE_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  USE_CASES_HUB_BLUEPRINT,
  getBlueprintByPath,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

export const metadata = marketingPageMetadata(USE_CASES_HUB_BLUEPRINT);

const items = USE_CASE_PAGES.map((page) => {
  const href = marketingChildPath(ROUTES.useCases, page.slug);
  return {
    href,
    title: page.title,
    summary: getBlueprintByPath(href)?.description,
  };
});

export default function Page() {
  return (
    <JourneyIndex
      eyebrow={USE_CASES_HUB_BLUEPRINT.eyebrow ?? ""}
      title={USE_CASES_HUB_BLUEPRINT.title}
      description={USE_CASES_HUB_BLUEPRINT.description}
      items={items}
    />
  );
}
