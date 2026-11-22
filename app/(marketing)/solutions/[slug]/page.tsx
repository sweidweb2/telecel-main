import { createBlueprintHubPage } from "@/components/marketing/blueprint-slug-route";
import { SOLUTION_BLUEPRINTS } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

const hub = createBlueprintHubPage(ROUTES.solutions, SOLUTION_BLUEPRINTS);

export const dynamicParams = hub.dynamicParams;
export const generateStaticParams = hub.generateStaticParams;
export const generateMetadata = hub.generateMetadata;
export default hub.Page;
