import {
  CASE_STUDIES_BLUEPRINT,
  INSIGHTS_BLUEPRINT,
  LEADERSHIP_BLUEPRINT,
  LEGAL_BLUEPRINTS,
  PLATFORM_BLUEPRINT,
  SERVICE_PILLAR_BLUEPRINTS,
  SOLUTION_BLUEPRINTS,
  USE_CASE_BLUEPRINTS,
  WHY_TELECEL_BLUEPRINT,
  type PageBlueprintConfig,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

/**
 * Public sitemap from the approved TGS text pack & developer brief.
 * Navbar, footer and sitemap.xml read from here. `live: true` includes the
 * URL in sitemap.xml (anchors are never listed).
 */
export type SiteNavLink = {
  label: string;
  href: string;
  live?: boolean;
};

export type SiteNavSection = SiteNavLink & {
  children?: readonly SiteNavLink[];
};

function navLinksFromBlueprints(
  blueprints: readonly PageBlueprintConfig[],
): SiteNavLink[] {
  return blueprints.map((blueprint) => ({
    label: blueprint.title,
    href: blueprint.path,
    live: true,
  }));
}

const PLATFORM_FLOW_IDS = new Set([
  "connect",
  "orchestrate",
  "deliver",
  "monitor",
  "optimize",
]);

export const SITE_NAV: readonly SiteNavSection[] = [
  {
    label: "Home",
    href: ROUTES.home,
    live: true,
  },
  {
    label: "Platform",
    href: PLATFORM_BLUEPRINT.path,
    live: true,
    children: [
      {
        label: PLATFORM_BLUEPRINT.title,
        href: PLATFORM_BLUEPRINT.path,
        live: true,
      },
      ...PLATFORM_BLUEPRINT.sections
        .filter((section) => PLATFORM_FLOW_IDS.has(section.id))
        .map((section) => ({
          label: section.title.replace(/^How we work — /, ""),
          href: `${PLATFORM_BLUEPRINT.path}#${section.id}`,
        })),
    ],
  },
  {
    label: "Services",
    href: ROUTES.services,
    live: true,
    children: navLinksFromBlueprints(SERVICE_PILLAR_BLUEPRINTS),
  },
  {
    label: "Solutions",
    href: ROUTES.solutions,
    live: true,
    children: navLinksFromBlueprints(SOLUTION_BLUEPRINTS),
  },
  {
    label: "Use Cases",
    href: ROUTES.useCases,
    live: true,
    children: navLinksFromBlueprints(USE_CASE_BLUEPRINTS),
  },
  {
    label: "Why Telecel Global",
    href: WHY_TELECEL_BLUEPRINT.path,
    live: true,
    children: [
      {
        label: "Our Approach",
        href: `${WHY_TELECEL_BLUEPRINT.path}#approach`,
      },
      {
        label: LEADERSHIP_BLUEPRINT.title,
        href: LEADERSHIP_BLUEPRINT.path,
        live: true,
      },
      {
        label: "Global Reach",
        href: `${WHY_TELECEL_BLUEPRINT.path}#global-reach`,
      },
      {
        label: "Partners & Ecosystem",
        href: `${WHY_TELECEL_BLUEPRINT.path}#partners`,
      },
    ],
  },
  {
    label: "Insights",
    href: INSIGHTS_BLUEPRINT.path,
    live: true,
    children: [
      { label: "News", href: INSIGHTS_BLUEPRINT.path, live: true },
      {
        label: CASE_STUDIES_BLUEPRINT.title,
        href: CASE_STUDIES_BLUEPRINT.path,
        live: true,
      },
    ],
  },
] as const;

/** Primary conversion CTAs — shown in the header and footer. */
export const SITE_CTAS = {
  talkToSales: {
    label: "Talk to Sales",
    href: `${ROUTES.contact}?intent=sales`,
  },
  requestDemo: {
    label: "Request a Demo",
    href: `${ROUTES.contact}?intent=demo`,
  },
} as const;

export const SITE_LEGAL_LINKS: readonly SiteNavLink[] =
  navLinksFromBlueprints(LEGAL_BLUEPRINTS);
