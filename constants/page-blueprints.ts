import {
  CASE_STUDIES_PAGE,
  LEADERSHIP_PAGE,
  LEGAL_PAGES,
  PLATFORM_PAGE,
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  USE_CASE_PAGES,
  WHY_TELECEL_PAGE,
  marketingChildPath,
} from "@/constants/marketing-pages";
import { HOME_HERO } from "@/constants/home-content";
import { ROUTES } from "@/constants/routes";
import { SERVICES_HERO } from "@/constants/services-hero";
import type {
  BlueprintSectionConfig,
  PageBlueprintConfig,
} from "@/types/marketing-blueprint";

export type { BlueprintSectionConfig, PageBlueprintConfig };

/** Meta + header copy for `/` — body is composed in the home route. */
export const HOME_BLUEPRINT: PageBlueprintConfig = {
  path: "/",
  eyebrow: HOME_HERO.eyebrow,
  title: HOME_HERO.title,
  description: HOME_HERO.body,
  metaTitle: "Telecel Global | International Connectivity & Digital Services",
  metaDescription: HOME_HERO.body,
};

/** Meta + header copy for `/platform` — body is composed in the route. */
export const PLATFORM_BLUEPRINT: PageBlueprintConfig = {
  path: PLATFORM_PAGE.path,
  eyebrow: "Platform",
  title: PLATFORM_PAGE.title,
  description: "One managed platform. More ways to grow.",
  metaTitle: "One Global B2B Platform | Telecel Global",
  metaDescription:
    "Bring international connectivity, digital infrastructure, customer engagement and value-added services together through one managed relationship.",
};

/** Meta for `/services` — body is composed in the route. */
export const SERVICES_HUB_BLUEPRINT: PageBlueprintConfig = {
  path: ROUTES.services,
  eyebrow: "Services",
  title: SERVICES_HERO.headline.replace(/\n/g, " "),
  description: SERVICES_HERO.subtext,
  metaTitle: "Services | Telecel Global",
  metaDescription: SERVICES_HERO.subtext,
};

const SERVICE_PILLAR_SECTIONS: readonly BlueprintSectionConfig[] = [
  {
    id: "hero",
    title: "Hero",
    note: "Approved pillar headline and positioning.",
  },
  { id: "intro", title: "Introduction", note: "Page-level service narrative." },
  {
    id: "sub-services",
    title: "Sub-services",
    note: "Cards, accordions or anchored modules — wording locked from the text pack.",
  },
  { id: "cta", title: "Page CTA", note: "Talk to Sales / specialist routing." },
];

const SERVICE_PILLAR_COPY = {
  "cloud-data-centre": {
    description: "Modernize infrastructure without adding complexity.",
    metaTitle: "Cloud & Data Centre Services | Telecel Global",
    metaDescription:
      "Managed cloud, professional services, public and private cloud, colocation and data centre services for operators and enterprises.",
  },
  cybersecurity: {
    description:
      "Protect connected operations with practical, layered security.",
    metaTitle: "Cybersecurity Services | Telecel Global",
    metaDescription:
      "Cybersecurity services for connected operations, including prevention, threat monitoring, penetration testing and secure connectivity.",
  },
  "iot-digital-services": {
    description: "Turn connectivity into new digital value.",
    metaTitle: "IoT & Digital Services | Telecel Global",
    metaDescription:
      "IoT, telecom VAS, fintech, digital content and travel eSIM solutions designed to improve operations and create new customer value.",
  },
  "network-enterprise-connectivity": {
    description: "Connect markets, operations and opportunities.",
    metaTitle: "Network & Enterprise Connectivity | Telecel Global",
    metaDescription:
      "International data connectivity, IP transit, SD-WAN, satellite, IP-VPN, roaming and enterprise networking services.",
  },
  "interactions-voice-messaging": {
    description:
      "Turn every interaction into stronger customer and commercial value.",
    metaTitle: "Interactions, Voice & Messaging | Telecel Global",
    metaDescription:
      "CPaaS, omnichannel engagement, enterprise messaging, A2P, P2P, P2A, SMS Firewall, managed services and international voice.",
  },
} as const;

export const SERVICE_PILLAR_BLUEPRINTS: readonly PageBlueprintConfig[] =
  SERVICE_PILLAR_PAGES.map((page) => ({
    path: marketingChildPath(ROUTES.services, page.slug),
    eyebrow: "Services",
    title: page.title,
    ...SERVICE_PILLAR_COPY[page.slug],
    sections: SERVICE_PILLAR_SECTIONS,
  }));

export const SOLUTIONS_HUB_BLUEPRINT: PageBlueprintConfig = {
  path: ROUTES.solutions,
  eyebrow: "Solutions",
  title: "Designed for the decisions you need to make",
  description:
    "Start from your customer type: operators, enterprises, public bodies or wholesale partners.",
  metaTitle: "Solutions | Telecel Global",
  metaDescription:
    "Solutions for mobile operators, enterprises, governments and institutions, and wholesale aggregators.",
  sections: [
    {
      id: "audiences",
      title: "Audience index",
      note: "Four buyer pathways into dedicated solution pages.",
    },
    {
      id: "cta",
      title: "Talk to Sales",
      note: "Connect the outcome to the right team.",
    },
  ],
};

const SOLUTION_SECTIONS: readonly BlueprintSectionConfig[] = [
  { id: "hero", title: "Hero", note: "Audience-specific headline." },
  { id: "intro", title: "Introduction", note: "Approved journey narrative." },
  {
    id: "priority-routes",
    title: "Priority service routes",
    note: "Links into the relevant service pillars and products.",
  },
  { id: "cta", title: "Page CTA", note: "Tell us the outcome you need." },
];

const SOLUTION_COPY = {
  "mobile-operators": {
    description: "Grow international revenue. Create more subscriber value.",
    metaTitle: "Solutions for Mobile Operators | Telecel Global",
    metaDescription:
      "Connect international traffic, protect messaging ecosystems and launch digital services shaped around operator economics.",
  },
  enterprises: {
    description:
      "Connect operations. Modernize infrastructure. Engage customers.",
    metaTitle: "Solutions for Enterprises | Telecel Global",
    metaDescription:
      "Cloud, data centres, security, enterprise connectivity and customer engagement in one managed relationship.",
  },
  "governments-institutions": {
    description: "Build secure digital services that can scale.",
    metaTitle: "Solutions for Governments & Institutions | Telecel Global",
    metaDescription:
      "Secure infrastructure, international connectivity and digital platforms for public and institutional operations.",
  },
  "wholesale-aggregators": {
    description:
      "Access international capability through one accountable relationship.",
    metaTitle: "Wholesale & Aggregator Solutions | Telecel Global",
    metaDescription:
      "Connectivity, messaging, voice and managed support for wholesale and aggregator partners.",
  },
} as const;

export const SOLUTION_BLUEPRINTS: readonly PageBlueprintConfig[] =
  SOLUTION_PAGES.map((page) => ({
    path: marketingChildPath(ROUTES.solutions, page.slug),
    eyebrow: "Solutions",
    title: page.title,
    ...SOLUTION_COPY[page.slug],
    sections: SOLUTION_SECTIONS,
  }));

export const USE_CASES_HUB_BLUEPRINT: PageBlueprintConfig = {
  path: ROUTES.useCases,
  eyebrow: "Use Cases",
  title: "Start from the outcome you need",
  description: "Six buyer outcomes mapped to the service portfolio.",
  metaTitle: "Use Cases | Telecel Global",
  metaDescription:
    "Grow international revenue, modernize engagement, secure messaging, scale across markets, build resilient infrastructure and launch digital services.",
  sections: [
    {
      id: "index",
      title: "Use case index",
      note: "Six outcome destinations from the approved sitemap.",
    },
    {
      id: "cta",
      title: "Talk to Sales",
      note: "Route from outcome to specialist.",
    },
  ],
};

const USE_CASE_SECTIONS: readonly BlueprintSectionConfig[] = [
  { id: "hero", title: "Hero", note: "Outcome headline from the text pack." },
  { id: "summary", title: "Summary", note: "Approved use-case narrative." },
  {
    id: "relevant-services",
    title: "Relevant services",
    note: "Named service links — no catalogue dump.",
  },
  {
    id: "cta",
    title: "Page CTA",
    note: "Continue to Talk to Sales or Request a Demo.",
  },
];

const USE_CASE_COPY = {
  "grow-international-revenue": {
    description:
      "Turn connectivity and digital services into new commercial opportunity.",
    metaTitle: "Grow International Revenue | Telecel Global",
    metaDescription:
      "Support operator growth through international traffic, subscriber services, enterprise engagement and digital monetization.",
  },
  "modernize-customer-engagement": {
    description: "Create more relevant interactions across every channel.",
    metaTitle: "Modernize Customer Engagement | Telecel Global",
    metaDescription:
      "Use APIs, omnichannel platforms, analytics and customer-value tools to improve communication and engagement.",
  },
  "secure-messaging-traffic": {
    description: "Protect traffic. Recover value. Improve control.",
    metaTitle: "Secure Messaging Traffic | Telecel Global",
    metaDescription:
      "Strengthen messaging ecosystems through firewall technology, managed operations and traffic insight.",
  },
  "scale-across-markets": {
    description: "Connect new locations without multiplying complexity.",
    metaTitle: "Scale Across Markets | Telecel Global",
    metaDescription:
      "Bring international data, IP, cloud and managed networking requirements into one coordinated engagement.",
  },
  "build-resilient-infrastructure": {
    description: "Make infrastructure ready for growth and disruption.",
    metaTitle: "Build Resilient Infrastructure | Telecel Global",
    metaDescription:
      "Combine cloud, data centres, secure connectivity and cybersecurity to strengthen operational continuity.",
  },
  "launch-new-digital-services": {
    description:
      "Move from idea to market with the right platform and operating support.",
    metaTitle: "Launch New Digital Services | Telecel Global",
    metaDescription:
      "Build and launch connected, customer-facing services across IoT, VAS, fintech, content and eSIM.",
  },
} as const;

export const USE_CASE_BLUEPRINTS: readonly PageBlueprintConfig[] =
  USE_CASE_PAGES.map((page) => ({
    path: marketingChildPath(ROUTES.useCases, page.slug),
    eyebrow: "Use Cases",
    title: page.title,
    ...USE_CASE_COPY[page.slug],
    sections: USE_CASE_SECTIONS,
  }));

export const WHY_TELECEL_BLUEPRINT: PageBlueprintConfig = {
  path: WHY_TELECEL_PAGE.path,
  eyebrow: WHY_TELECEL_PAGE.title,
  title: "International capability, delivered with operator understanding",
  description:
    "Telecel Global is the international B2B arm of Telecel, bringing connectivity and digital services together for operators, enterprises and institutions.",
  metaTitle: "Why Telecel Global | Telecel Global",
  metaDescription:
    "Operator-led understanding, one accountable relationship, international reach and solution-led agility.",
  sections: [
    {
      id: "approach",
      title: "Our Approach",
      note: "Differentiation narrative from the text pack.",
    },
    {
      id: "global-reach",
      title: "Global Reach",
      note: "International scope without unsupported scale claims.",
    },
    {
      id: "partners",
      title: "Partners & Ecosystem",
      note: "Clearance-gated — no logos or partner marks until approved.",
    },
    { id: "cta", title: "Talk to Sales", note: "Confidence → conversion." },
  ],
};

export const LEADERSHIP_BLUEPRINT: PageBlueprintConfig = {
  path: LEADERSHIP_PAGE.path,
  eyebrow: WHY_TELECEL_PAGE.title,
  title: LEADERSHIP_PAGE.title,
  description: "Leadership connected to customers, markets and delivery.",
  metaTitle: "Leadership | Telecel Global",
  metaDescription:
    "Meet the leaders shaping Telecel Global's international growth, product direction and customer delivery.",
  sections: [
    {
      id: "leaders",
      title: "Leadership profiles",
      note: "Bios and representation supplied through the leadership workstream.",
    },
  ],
};

export const CASE_STUDIES_BLUEPRINT: PageBlueprintConfig = {
  path: CASE_STUDIES_PAGE.path,
  eyebrow: "Insights",
  title: CASE_STUDIES_PAGE.title,
  description: "Customer outcomes and delivery stories from Telecel Global.",
  metaTitle: "Case Studies | Telecel Global",
  metaDescription:
    "Customer outcomes and delivery stories from Telecel Global.",
  sections: [
    {
      id: "list",
      title: "Case study list",
      note: "Do not invent cases. Keep empty until approved content exists.",
    },
  ],
};

const LEGAL_COPY = {
  [ROUTES.privacy]: {
    metaTitle: "Privacy Policy | Telecel Global",
    metaDescription: "Privacy Policy for Telecel Global.",
  },
  [ROUTES.terms]: {
    metaTitle: "Terms of Use | Telecel Global",
    metaDescription: "Terms of Use for Telecel Global.",
  },
} as const;

const LEGAL_SECTION: readonly BlueprintSectionConfig[] = [
  { id: "content", title: "Policy content", note: "Legal copy pending." },
];

function legalBlueprint(
  path: (typeof LEGAL_PAGES)[number]["path"],
): PageBlueprintConfig {
  const page = LEGAL_PAGES.find((entry) => entry.path === path);
  if (!page) {
    throw new Error(`Missing legal page for path: ${path}`);
  }
  return {
    path: page.path,
    eyebrow: "Legal",
    title: page.title,
    ...LEGAL_COPY[page.path],
    sections: LEGAL_SECTION,
  };
}

export const PRIVACY_BLUEPRINT = legalBlueprint(ROUTES.privacy);
export const TERMS_BLUEPRINT = legalBlueprint(ROUTES.terms);

export const LEGAL_BLUEPRINTS: readonly PageBlueprintConfig[] = [
  PRIVACY_BLUEPRINT,
  TERMS_BLUEPRINT,
];

/**
 * Registry for wireframe pages and hub meta.
 * Contact and insights stay out — they own custom page implementations.
 */
export const ALL_PAGE_BLUEPRINTS: readonly PageBlueprintConfig[] = [
  HOME_BLUEPRINT,
  PLATFORM_BLUEPRINT,
  SERVICES_HUB_BLUEPRINT,
  ...SERVICE_PILLAR_BLUEPRINTS,
  SOLUTIONS_HUB_BLUEPRINT,
  ...SOLUTION_BLUEPRINTS,
  USE_CASES_HUB_BLUEPRINT,
  ...USE_CASE_BLUEPRINTS,
  WHY_TELECEL_BLUEPRINT,
  LEADERSHIP_BLUEPRINT,
  CASE_STUDIES_BLUEPRINT,
  ...LEGAL_BLUEPRINTS,
];

const BLUEPRINT_BY_PATH = new Map(
  ALL_PAGE_BLUEPRINTS.map((blueprint) => [blueprint.path, blueprint]),
);

/** Lookup a blueprint by its canonical path (e.g. `/services/cybersecurity`). */
export function getBlueprintByPath(
  path: string,
): PageBlueprintConfig | undefined {
  return BLUEPRINT_BY_PATH.get(path);
}

/** Slug segment from a blueprint path under a hub (`/services/foo` → `foo`). */
export function blueprintSlug(path: string, hubPath: string): string {
  const prefix = `${hubPath}/`;
  if (!path.startsWith(prefix)) {
    throw new Error(`Path ${path} is not under hub ${hubPath}`);
  }
  return path.slice(prefix.length);
}

/** `generateStaticParams` entries for a family of hub child blueprints. */
export function blueprintStaticParams(
  blueprints: readonly PageBlueprintConfig[],
  hubPath: string,
): { slug: string }[] {
  return blueprints.map((blueprint) => ({
    slug: blueprintSlug(blueprint.path, hubPath),
  }));
}
