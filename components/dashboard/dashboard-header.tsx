"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";
import {
  HomeIcon,
  KeyRoundIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { signOut } from "@/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDashboardPageTitle } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/profile";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function initials(email: string): string {
  const name = email.split("@")[0] ?? "";
  const parts = name.split(/[._-]+/).filter(Boolean);
  const letters =
    parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
  return letters.toUpperCase() || "?";
}

export function DashboardHeader({
  user,
}: {
  user: { email: string; role: UserRole };
}) {
  const pathname = usePathname();
  const title = getDashboardPageTitle(pathname);
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const mounted = useIsClient();

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 sm:px-8">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="min-w-0 truncate font-heading text-lg font-medium text-ink">{title}</h1>
      <DropdownMenu>
        {/*
          Base UI Menu Trigger already renders a <button>.
          Do not wrap <Button> with asChild — that nests button-in-button
          and breaks hydration.
        */}
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "ml-auto min-h-11 min-w-11 rounded-full",
          )}
          aria-label="Open account menu"
        >
          <Avatar>
            <AvatarFallback>{initials(user.email)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 min-w-56">
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="min-h-11 cursor-pointer sm:min-h-8"
            render={<Link href={ROUTES.home} />}
            nativeButton={false}
          >
            <HomeIcon />
            View website
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11 cursor-pointer sm:min-h-8"
            render={<Link href={ROUTES.updatePassword} />}
            nativeButton={false}
          >
            <KeyRoundIcon />
            Change password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              className="min-h-11 cursor-pointer sm:min-h-8"
              onClick={() => {
                setTheme(value);
              }}
            >
              <Icon />
              {label}
              {mounted && theme === value ? (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              ) : null}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="min-h-11 sm:min-h-8"
            disabled={isPending}
            onClick={() => {
              handleSignOut();
            }}
          >
            <LogOutIcon />
            {isPending ? "Signing out…" : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
