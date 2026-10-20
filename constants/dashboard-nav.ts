import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/profile";

export type PortalSection = {
  title: string;
  href: string;
  /** Lowest role that can open the section. */
  minRole: UserRole;
  /** One line shown under the page heading. */
  description: string;
  /** Planned capabilities (from the RFQ); shown on placeholder pages. */
  planned: readonly string[];
  /** True once the section has a working implementation. */
  ready?: boolean;
};

export type PortalNavGroup = {
  label: string;
  items: readonly PortalSection[];
};

/**
 * Single source of truth for the CMS portal: sidebar, page titles,
 * placeholder content and role gating all read from here.
 * Scope comes from the Telecel Global RFQ (§3 architecture, §4.2 CMS, §4.4
 * forms, §5 governance) — see docs/02-architecture/editor-portal-features.md.
 */
export const PORTAL_NAV: readonly PortalNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: ROUTES.dashboard,
        minRole: "editor",
        description: "Recent inquiries, drafts awaiting review and quick links.",
        planned: [
          "New inquiries this week by service area",
          "Drafts and recently published content",
          "Shortcuts to Talk to Sales / Request a Demo settings",
        ],
        ready: true,
      },
    ],
  },
  {
    label: "Website content",
    items: [
      {
        title: "Pages",
        href: ROUTES.pages,
        minRole: "editor",
        description: "Home, Platform and Why Telecel Global built from reorderable sections.",
        planned: [
          "Edit page sections (hero, outcomes, buyer routes, proof, CTA) and reorder them",
          "Draft, preview and publish",
          "Per-page SEO title, description and social image",
        ],
      },
      {
        title: "Services",
        href: ROUTES.services,
        minRole: "editor",
        description: "The five service pillars and their sub-service modules.",
        planned: [
          "Edit each pillar page and its sub-service modules",
          "Promote a module to a standalone page without redesign",
          "Order modules (voice & messaging last where relevant)",
        ],
      },
      {
        title: "Solutions",
        href: ROUTES.solutions,
        minRole: "editor",
        description: "Mobile Operators, Enterprises, Governments & Institutions, Wholesale & Aggregators.",
        planned: [
          "Edit each solution page",
          "Link relevant services and use cases",
        ],
      },
      {
        title: "Use cases",
        href: ROUTES.useCases,
        minRole: "editor",
        description: "The six buyer use cases and the services behind them.",
        planned: ["Edit each use case", "Link services, solutions and proof points"],
      },
      {
        title: "News",
        href: ROUTES.blogs,
        minRole: "editor",
        description: "Insights news articles shown on the public site.",
        planned: [],
        ready: true,
      },
      {
        title: "Case studies",
        href: ROUTES.caseStudies,
        minRole: "editor",
        description: "Customer case studies, published only once Telecel approves them.",
        planned: [
          "Case-study template (challenge, solution, outcome)",
          "Approval flag before publishing",
        ],
      },
      {
        title: "Leadership",
        href: ROUTES.leadership,
        minRole: "editor",
        description: "Leadership profiles for Why Telecel Global.",
        planned: ["Profiles with photo, role and bio", "Manual ordering"],
      },
      {
        title: "Partners",
        href: ROUTES.partners,
        minRole: "editor",
        description: "Partners & ecosystem logos, shown only once cleared.",
        planned: ["Logo, name and link", "Clearance flag gates publishing"],
      },
      {
        title: "CTAs",
        href: ROUTES.ctas,
        minRole: "editor",
        description: "Reusable Talk to Sales and Request a Demo blocks.",
        planned: [
          "Edit CTA copy and target once, reuse everywhere",
          "Consistent analytics event names",
        ],
      },
      {
        title: "Media",
        href: ROUTES.media,
        minRole: "editor",
        description: "Images, hero film and posters with required alt text.",
        planned: [
          "Upload with size/type checks and required alt text",
          "Hero video with poster/fallback image",
        ],
      },
    ],
  },
  {
    label: "Leads & SEO",
    items: [
      {
        title: "Inquiries",
        href: ROUTES.inquiries,
        minRole: "editor",
        description: "Talk to Sales and Request a Demo submissions.",
        planned: [
          "List, filter and export inquiries",
          "See which recipient group each inquiry was routed to",
          "Status tracking (new, contacted, closed)",
        ],
      },
      {
        title: "SEO & redirects",
        href: ROUTES.seo,
        minRole: "editor",
        description: "Redirects, sitemap and robots controls.",
        planned: [
          "301/302 redirects managed without code",
          "Exclude pages from the sitemap / set noindex",
        ],
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Users",
        href: ROUTES.users,
        minRole: "admin",
        description: "Invite people, assign admin or editor roles and suspend access.",
        planned: [],
        ready: true,
      },
      {
        title: "Form routing",
        href: ROUTES.formRouting,
        minRole: "admin",
        description: "Which Telecel recipient groups receive each inquiry.",
        planned: [
          "Recipient groups with email addresses",
          "Route by area of interest without code changes",
        ],
      },
      {
        title: "Site settings",
        href: ROUTES.settings,
        minRole: "admin",
        description: "Analytics/tag manager IDs, contact defaults, social links and legal text.",
        planned: [
          "Tag manager / analytics IDs",
          "Footer, social links, privacy and cookie wording",
        ],
      },
      {
        title: "Backups",
        href: ROUTES.backups,
        minRole: "admin",
        description: "Backup status and recovery instructions.",
        planned: ["Last backup time", "Link to recovery runbook"],
      },
    ],
  },
] as const;

export const PORTAL_SECTIONS: readonly PortalSection[] = PORTAL_NAV.flatMap(
  (group) => group.items
);

export function canAccessSection(role: UserRole, section: Pick<PortalSection, "minRole">) {
  return section.minRole === "editor" || role === "admin";
}

export function getPortalSection(href: string): PortalSection | undefined {
  return PORTAL_SECTIONS.find((section) => section.href === href);
}

/** Title for the header: exact match, else the longest matching parent section. */
export function getDashboardPageTitle(pathname: string): string {
  const match = [...PORTAL_SECTIONS]
    .filter(
      (section) =>
        pathname === section.href ||
        (section.href !== ROUTES.dashboard && pathname.startsWith(`${section.href}/`))
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.title ?? "Dashboard";
}
