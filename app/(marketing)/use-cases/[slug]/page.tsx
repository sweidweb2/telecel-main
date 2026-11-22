import { createBlueprintHubPage } from "@/components/marketing/blueprint-slug-route";
import { USE_CASE_BLUEPRINTS } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

const hub = createBlueprintHubPage(ROUTES.useCases, USE_CASE_BLUEPRINTS);

export const dynamicParams = hub.dynamicParams;
export const generateStaticParams = hub.generateStaticParams;
export const generateMetadata = hub.generateMetadata;
export default hub.Page;
