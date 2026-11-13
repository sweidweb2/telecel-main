import {
  CASE_STUDIES_PAGE,
  INSIGHTS_PAGE,
  LEADERSHIP_PAGE,
  LEGAL_PAGES,
  PLATFORM_FLOW_LINKS,
  PLATFORM_PAGE,
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  USE_CASE_PAGES,
  WHY_TELECEL_PAGE,
  marketingChildPath,
  type MarketingChildPage,
  type MarketingPathPage,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";

/**
 * Public sitemap from the approved TGS text pack & developer brief.
 * Navbar, footer and sitemap.xml read from here. `live: true` includes the
 * URL in sitemap.xml (anchors are never listed).
 *
 * Imports only the slim `marketing-pages` catalog — never `page-blueprints` —
 * so client chrome does not ship blueprint meta/section notes.
 */
export type SiteNavLink = {
  label: string;
  href: string;
  live?: boolean;
};

export type SiteNavSection = SiteNavLink & {
  children?: readonly SiteNavLink[];
};

function navLinksFromChildren(
  hubPath: string,
  pages: readonly MarketingChildPage[],
): SiteNavLink[] {
  return pages.map((page) => ({
    label: page.title,
    href: marketingChildPath(hubPath, page.slug),
    live: true,
  }));
}

function navLinksFromPaths(pages: readonly MarketingPathPage[]): SiteNavLink[] {
  return pages.map((page) => ({
    label: page.title,
    href: page.path,
    live: true,
  }));
}

export const SITE_NAV: readonly SiteNavSection[] = [
  {
    label: "Home",
    href: ROUTES.home,
    live: true,
  },
  {
    label: "Platform",
    href: PLATFORM_PAGE.path,
    live: true,
    children: [
      {
        label: PLATFORM_PAGE.title,
        href: PLATFORM_PAGE.path,
        live: true,
      },
      ...PLATFORM_FLOW_LINKS.map((link) => ({
        label: link.label,
        href: `${PLATFORM_PAGE.path}#${link.id}`,
      })),
    ],
  },
  {
    label: "Services",
    href: ROUTES.services,
    live: true,
    children: navLinksFromChildren(ROUTES.services, SERVICE_PILLAR_PAGES),
  },
  {
    label: "Solutions",
    href: ROUTES.solutions,
    live: true,
    children: navLinksFromChildren(ROUTES.solutions, SOLUTION_PAGES),
  },
  {
    label: "Use Cases",
    href: ROUTES.useCases,
    live: true,
    children: navLinksFromChildren(ROUTES.useCases, USE_CASE_PAGES),
  },
  {
    label: WHY_TELECEL_PAGE.title,
    href: WHY_TELECEL_PAGE.path,
    live: true,
    children: [
      {
        label: "Our Approach",
        href: `${WHY_TELECEL_PAGE.path}#approach`,
      },
      {
        label: LEADERSHIP_PAGE.title,
        href: LEADERSHIP_PAGE.path,
        live: true,
      },
      {
        label: "Global Reach",
        href: `${WHY_TELECEL_PAGE.path}#global-reach`,
      },
      {
        label: "Partners & Ecosystem",
        href: `${WHY_TELECEL_PAGE.path}#partners`,
      },
    ],
  },
  {
    label: "Insights",
    href: INSIGHTS_PAGE.path,
    live: true,
    children: [
      { label: INSIGHTS_PAGE.title, href: INSIGHTS_PAGE.path, live: true },
      {
        label: CASE_STUDIES_PAGE.title,
        href: CASE_STUDIES_PAGE.path,
        live: true,
      },
    ],
  },
];

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
  navLinksFromPaths(LEGAL_PAGES);
