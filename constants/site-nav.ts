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
 * URL in sitemap.xml (anchors are never listed). Only mark pages live when
 * they have real indexable content — wireframes and stub legal copy stay off.
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
  live = false,
): SiteNavLink[] {
  return pages.map((page) => ({
    label: page.title,
    href: marketingChildPath(hubPath, page.slug),
    ...(live ? { live: true as const } : {}),
  }));
}

function navLinksFromPaths(
  pages: readonly MarketingPathPage[],
  live = false,
): SiteNavLink[] {
  return pages.map((page) => ({
    label: page.title,
    href: page.path,
    ...(live ? { live: true as const } : {}),
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
    children: navLinksFromChildren(ROUTES.services, SERVICE_PILLAR_PAGES, true),
  },
  {
    label: "Solutions",
    href: ROUTES.solutions,
    live: true,
    children: navLinksFromChildren(ROUTES.solutions, SOLUTION_PAGES, true),
  },
  {
    label: "Use Cases",
    href: ROUTES.useCases,
    live: true,
    children: navLinksFromChildren(ROUTES.useCases, USE_CASE_PAGES, true),
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
      },
      {
        label: "Global Reach",
        href: `${WHY_TELECEL_PAGE.path}#global-reach`,
      },
      // Partners & Ecosystem returns once partner marks are cleared (RFQ).
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
        // Empty until approved cases exist — do not index.
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

/** Legal stubs until approved copy ships — linked in footer, not in sitemap. */
export const SITE_LEGAL_LINKS: readonly SiteNavLink[] =
  navLinksFromPaths(LEGAL_PAGES);
