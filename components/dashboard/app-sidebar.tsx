"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenTextIcon,
  BoxesIcon,
  DatabaseBackupIcon,
  FileTextIcon,
  HandshakeIcon,
  ImageIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LayersIcon,
  MegaphoneIcon,
  NewspaperIcon,
  RouteIcon,
  SearchIcon,
  SettingsIcon,
  TargetIcon,
  UserRoundIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { canAccessSection, PORTAL_NAV } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/profile";

const NAV_ICONS: Record<string, LucideIcon> = {
  [ROUTES.dashboard]: LayoutDashboardIcon,
  [ROUTES.pages]: FileTextIcon,
  [ROUTES.services]: LayersIcon,
  [ROUTES.solutions]: BoxesIcon,
  [ROUTES.useCases]: TargetIcon,
  [ROUTES.blogs]: NewspaperIcon,
  [ROUTES.caseStudies]: BookOpenTextIcon,
  [ROUTES.leadership]: UserRoundIcon,
  [ROUTES.partners]: HandshakeIcon,
  [ROUTES.ctas]: MegaphoneIcon,
  [ROUTES.media]: ImageIcon,
  [ROUTES.inquiries]: InboxIcon,
  [ROUTES.seo]: SearchIcon,
  [ROUTES.users]: UsersIcon,
  [ROUTES.formRouting]: RouteIcon,
  [ROUTES.settings]: SettingsIcon,
  [ROUTES.backups]: DatabaseBackupIcon,
};

function isActive(pathname: string, href: string): boolean {
  return (
    pathname === href ||
    (href !== ROUTES.dashboard && pathname.startsWith(`${href}/`))
  );
}

export function AppSidebar({ user }: { user: { email: string; role: UserRole } }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Telecel Global CMS"
              className="h-auto py-3 hover:bg-transparent"
              render={<Link href={ROUTES.dashboard} />}
            >
              <span className="grid gap-2 group-data-[collapsible=icon]:hidden">
                <Logo variant="reversed" size="sm" />
                <span className="type-notation text-charcoal-muted">Content management</span>
              </span>
              <span
                aria-hidden
                className="hidden size-2.5 rounded-full bg-brand group-data-[collapsible=icon]:block"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {PORTAL_NAV.map((group) => {
          const items = group.items.filter((item) => canAccessSection(user.role, item));
          if (items.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-xs font-medium text-charcoal-muted">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const Icon = NAV_ICONS[item.href] ?? FileTextIcon;
                    const active = isActive(pathname, item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={
                            <Link href={item.href} aria-current={active ? "page" : undefined} />
                          }
                          isActive={active}
                          tooltip={item.title}
                          className={cn(
                            "relative h-10 rounded-[3px] text-sidebar-foreground/75 hover:text-white",
                            "data-active:bg-sidebar-accent data-active:font-semibold data-active:text-white",
                            "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:bg-brand before:opacity-0 data-active:before:opacity-100"
                          )}
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <div className="grid gap-0.5 border-t border-sidebar-border px-2 pt-3 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm text-white">{user.email}</p>
          <p className="type-notation text-charcoal-muted">{user.role}</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
