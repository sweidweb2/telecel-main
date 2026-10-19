"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  BriefcaseIcon,
  DatabaseBackupIcon,
  LayoutDashboardIcon,
  MailIcon,
  NewspaperIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboard-nav";
import { publicPath, ROUTES } from "@/constants/routes";

const NAV_ICONS: Record<(typeof DASHBOARD_NAV_ITEMS)[number]["href"], LucideIcon> =
  {
    [ROUTES.dashboard]: LayoutDashboardIcon,
    [ROUTES.users]: UsersIcon,
    [ROUTES.registrations]: UserPlusIcon,
    [ROUTES.portfolio]: BriefcaseIcon,
    [ROUTES.blogs]: NewspaperIcon,
    [ROUTES.contactUs]: MailIcon,
    [ROUTES.analytics]: BarChart3Icon,
    [ROUTES.backup]: DatabaseBackupIcon,
    [ROUTES.settings]: SettingsIcon,
  };

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Telecel"
              render={<Link href={publicPath("en")} />}
            >
              <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                T
              </span>
              <span className="truncate font-heading font-medium group-data-[collapsible=icon]:hidden">
                Telecel
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DASHBOARD_NAV_ITEMS.map((item) => {
                const Icon = NAV_ICONS[item.href];

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={pathname === item.href}
                      tooltip={item.title}
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Admin">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
                Admin
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
