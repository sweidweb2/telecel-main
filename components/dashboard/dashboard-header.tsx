"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";
import {
  HomeIcon,
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
import { DEFAULT_LOCALE } from "@/constants/locales";
import { publicPath } from "@/constants/routes";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function DashboardHeader() {
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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="min-w-0 truncate text-sm font-medium">{title}</h1>
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
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 min-w-48">
          <DropdownMenuItem
            className="min-h-11 cursor-pointer sm:min-h-8"
            render={<Link href={publicPath(DEFAULT_LOCALE)} />}
            nativeButton={false}
          >
            <HomeIcon />
            Go home
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
