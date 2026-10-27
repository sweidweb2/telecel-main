import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/profile";

export type PortalSection = {
  title: string;
  href: string;
  /** Lowest role that can open the section. */
  minRole: UserRole;
  /** One line shown under the page heading. */
  description: string;
};

export type PortalNavGroup = {
  label: string;
  items: readonly PortalSection[];
};

/**
 * Single source of truth for the CMS portal: sidebar, page titles,
 * and role gating all read from here.
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
      },
    ],
  },
  {
    label: "Website content",
    items: [
      {
        title: "News",
        href: ROUTES.blogs,
        minRole: "editor",
        description: "Insights news articles shown on the public site.",
      },
    ],
  },
  {
    label: "Leads",
    items: [
      {
        title: "Inquiries",
        href: ROUTES.inquiries,
        minRole: "editor",
        description: "Talk to Sales and Request a Demo submissions.",
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
      },
      {
        title: "Activity log",
        href: ROUTES.activityLog,
        minRole: "admin",
        description: "Who created, updated, published or deleted CMS content and users.",
      },
      {
        title: "Error log",
        href: ROUTES.errorLog,
        minRole: "admin",
        description: "Unexpected server failures from actions and auth providers.",
      },
      {
        title: "Site settings",
        href: ROUTES.settings,
        minRole: "admin",
        description:
          "Maintenance modes, plus future analytics, contact defaults, and legal text.",
      },
      {
        title: "Backups",
        href: ROUTES.backups,
        minRole: "admin",
        description:
          "Save export settings and download table dumps as CSV or JSON.",
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
