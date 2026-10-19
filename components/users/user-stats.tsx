import {
  UsersIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { UserStats } from "@/types/profile";

const STATS = [
  {
    key: "total",
    label: "Total users",
    icon: UsersIcon,
  },
  {
    key: "admins",
    label: "Admins",
    icon: ShieldCheckIcon,
  },
  {
    key: "newThisWeek",
    label: "New this week",
    icon: CalendarDaysIcon,
  },
  {
    key: "newThisMonth",
    label: "New this month",
    icon: CalendarRangeIcon,
  },
] as const;

export function UserStatsCards({ stats }: { stats: UserStats }) {
  return (
    <div className="flex w-full flex-row flex-nowrap gap-2 sm:gap-3">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.key}
            size="sm"
            className="min-w-0 flex-1 basis-0 py-0"
          >
            <CardContent className="flex flex-row items-center gap-2 py-3 sm:gap-2.5 sm:py-4">
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold tracking-tight tabular-nums sm:text-xl">
                  {stats[stat.key]}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
