import {
  SOLUTION_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";

export {
  PLATFORM_STAGES,
  type PlatformStage,
} from "@/constants/platform-stages";

/**
 * PROVISIONAL home copy — structure from the RFQ §3 sitemap; every sentence
 * must be replaced by the approved Telecel Global Text Pack before launch
 * (RFQ §4.3: no unsupported claims, metrics, customers or coverage).
 * Kept here so the CMS "Pages" section can take it over later.
 */

export const HOME_HERO = {
  eyebrow: "Telecel Global",
  title: "One partner for international connectivity and digital services",
  body: "Telecel Global brings networks, cloud, security, IoT and messaging together on one B2B platform for operators, enterprises and institutions.",
} as const;

const BUYER_SUMMARIES = {
  "mobile-operators":
    "Services that extend what operators offer their own customers.",
  enterprises:
    "Connectivity, cloud and security for organisations working across markets.",
  "governments-institutions":
    "Infrastructure and digital services for public bodies.",
  "wholesale-aggregators":
    "Capacity and messaging for carriers and aggregators.",
} as const satisfies Record<(typeof SOLUTION_PAGES)[number]["slug"], string>;

/** Buyer pathways on the homepage — titles/paths from the marketing catalog. */
export const BUYER_ROUTES = SOLUTION_PAGES.map((page) => ({
  href: marketingChildPath(ROUTES.solutions, page.slug),
  title: page.title,
  summary: BUYER_SUMMARIES[page.slug],
}));
