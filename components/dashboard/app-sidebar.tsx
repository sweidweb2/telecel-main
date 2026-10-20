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
  LightbulbIcon,
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
              tooltip="Telecel Global"
              render={<Link href={ROUTES.dashboard} />}
            >
              <Logo className="group-data-[collapsible=icon]:hidden" />
              <Logo compact className="hidden group-data-[collapsible=icon]:inline-flex" />
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
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const Icon = NAV_ICONS[item.href] ?? FileTextIcon;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={isActive(pathname, item.href)}
                          tooltip={item.title}
                        >
                          <Icon />
                          <span>{item.title}</span>
                          {item.ready ? null : (
                            <LightbulbIcon
                              aria-label="Planned"
                              className="ml-auto size-3 opacity-40 group-data-[collapsible=icon]:hidden"
                            />
                          )}
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
        <p className="truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          {user.email} · <span className="capitalize">{user.role}</span>
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
