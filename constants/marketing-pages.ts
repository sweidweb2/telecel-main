import { PLATFORM_FLOW_LINKS } from "@/constants/platform-stages";
import { ROUTES } from "@/constants/routes";

/**
 * Client-safe public page identities (path/title/slug only).
 * Full blueprint copy (meta, sections, notes) lives in `page-blueprints.ts`
 * so the navbar/footer client bundle does not ship wireframe content.
 */

export type MarketingChildPage = {
  slug: string;
  title: string;
};

export type MarketingPathPage = {
  path: string;
  title: string;
};

export const PLATFORM_PAGE = {
  path: ROUTES.platform,
  title: "One Global B2B Platform",
} as const satisfies MarketingPathPage;

/** Re-export — single source is `platform-stages`. */
export { PLATFORM_FLOW_LINKS };

/** RFQ §3 order — voice & messaging stays last. */
export const SERVICE_PILLAR_PAGES = [
  { slug: "cloud-data-centre", title: "Cloud & Data Centre Services" },
  { slug: "cybersecurity", title: "Cybersecurity" },
  { slug: "iot-digital-services", title: "IoT & Digital Services" },
  {
    slug: "network-enterprise-connectivity",
    title: "Network & Enterprise Connectivity",
  },
  {
    slug: "interactions-voice-messaging",
    title: "Interactions, Voice & Messaging",
  },
] as const satisfies readonly MarketingChildPage[];

export const SOLUTION_PAGES = [
  { slug: "mobile-operators", title: "Mobile Operators" },
  { slug: "enterprises", title: "Enterprises" },
  {
    slug: "governments-institutions",
    title: "Governments & Institutions",
  },
  { slug: "wholesale-aggregators", title: "Wholesale & Aggregators" },
] as const satisfies readonly MarketingChildPage[];

export const USE_CASE_PAGES = [
  {
    slug: "grow-international-revenue",
    title: "Grow International Revenue",
  },
  {
    slug: "modernize-customer-engagement",
    title: "Modernize Customer Engagement",
  },
  { slug: "secure-messaging-traffic", title: "Secure Messaging Traffic" },
  { slug: "scale-across-markets", title: "Scale Across Markets" },
  {
    slug: "build-resilient-infrastructure",
    title: "Build Resilient Infrastructure",
  },
  {
    slug: "launch-new-digital-services",
    title: "Launch New Digital Services",
  },
] as const satisfies readonly MarketingChildPage[];

export const WHY_TELECEL_PAGE = {
  path: ROUTES.whyTelecelGlobal,
  title: "Why Telecel Global",
} as const satisfies MarketingPathPage;

export const LEADERSHIP_PAGE = {
  path: ROUTES.leadership,
  title: "Leadership",
} as const satisfies MarketingPathPage;

export const INSIGHTS_PAGE = {
  path: ROUTES.insights,
  title: "Insights",
} as const satisfies MarketingPathPage;

export const CASE_STUDIES_PAGE = {
  path: ROUTES.caseStudies,
  title: "Case Studies",
} as const satisfies MarketingPathPage;

export const LEGAL_PAGES = [
  { path: ROUTES.privacy, title: "Privacy Policy" },
  { path: ROUTES.terms, title: "Terms of Use" },
] as const satisfies readonly MarketingPathPage[];

/** Hub child path, e.g. `/services` + `cybersecurity`. */
export function marketingChildPath(hubPath: string, slug: string): string {
  return `${hubPath}/${slug}`;
}
