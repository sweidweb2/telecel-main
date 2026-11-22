import { createBlueprintHubPage } from "@/components/marketing/blueprint-slug-route";
import { SERVICE_PILLAR_BLUEPRINTS } from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

const hub = createBlueprintHubPage(ROUTES.services, SERVICE_PILLAR_BLUEPRINTS);

export const dynamicParams = hub.dynamicParams;
export const generateStaticParams = hub.generateStaticParams;
export const generateMetadata = hub.generateMetadata;
export default hub.Page;
