import { ROUTES } from "@/constants/routes";

export const DASHBOARD_NAV_ITEMS = [
  { title: "Dashboard", href: ROUTES.dashboard },
  { title: "Manage users", href: ROUTES.users },
  { title: "Manage registrations", href: ROUTES.registrations },
  { title: "Manage portfolio", href: ROUTES.portfolio },
  { title: "Manage blogs", href: ROUTES.blogs },
  { title: "Manage contact us", href: ROUTES.contactUs },
  { title: "Analytics", href: ROUTES.analytics },
  { title: "Backup", href: ROUTES.backup },
  { title: "Settings", href: ROUTES.settings },
] as const;

export function getDashboardPageTitle(pathname: string) {
  return (
    DASHBOARD_NAV_ITEMS.find((item) => item.href === pathname)?.title ??
    "Dashboard"
  );
}
