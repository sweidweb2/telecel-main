"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MapPin,
  Rocket,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { AboutStoryStatIcon } from "@/types/marketing-page";
import { cn } from "@/lib/utils";

const STAT_ICONS: Record<AboutStoryStatIcon, LucideIcon> = {
  rocket: Rocket,
  users: Users,
  "map-pin": MapPin,
  star: Star,
};

type StoryStat = {
  icon: AboutStoryStatIcon;
  value: number;
  suffix?: string;
  label: string;
};

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, target]);

  return value;
}

function StoryStatItem({
  stat,
  active,
}: {
  stat: StoryStat;
  active: boolean;
}) {
  const Icon = STAT_ICONS[stat.icon];
  const count = useCountUp(stat.value, active);

  return (
    <div className="group relative rounded-xl border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden />
      </div>
      <p className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {count}
        {stat.suffix ?? ""}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
      <span
        aria-hidden
        className="mx-auto mt-4 block h-0.5 w-0 max-w-12 bg-primary transition-all duration-300 group-hover:w-full"
      />
    </div>
  );
}

export function StoryStatCounter({ stats }: { stats: StoryStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
    >
      {stats.map((stat) => (
        <StoryStatItem key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}

export function StoryStatsNotice({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-center text-xs text-muted-foreground", className)}>
      {children}
    </p>
  );
}
