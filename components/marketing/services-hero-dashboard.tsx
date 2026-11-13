import { SearchIcon } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Traffic", "Messaging", "IoT", "Security"] as const;

const TRAFFIC_BARS = [
  { region: "EMEA", voice: 72, data: 88 },
  { region: "APAC", voice: 54, data: 76 },
  { region: "AMER", voice: 61, data: 69 },
  { region: "ME", voice: 80, data: 92 },
  { region: "AF", voice: 48, data: 64 },
] as const;

const HUBS = [
  { id: "dubai", label: "Dubai", x: 58, y: 42 },
  { id: "london", label: "London", x: 48, y: 28 },
  { id: "lagos", label: "Lagos", x: 50, y: 52 },
  { id: "singapore", label: "Singapore", x: 78, y: 55 },
] as const;

const ARCS: ReadonlyArray<readonly [string, string]> = [
  ["london", "dubai"],
  ["dubai", "lagos"],
  ["dubai", "singapore"],
  ["london", "lagos"],
];

const SHIELD_SEGMENTS = [
  { label: "Firewall", value: 98 },
  { label: "A2P Filter", value: 96 },
  { label: "Threat Intel", value: 99 },
  { label: "Zero Trust", value: 94 },
] as const;

/** Decorative product mock — network ops dashboard rising from the clouds. */
export function ServicesHeroDashboard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_24px_80px_color-mix(in_oklch,var(--ink)_14%,transparent)]",
        className,
      )}
      aria-hidden
    >
      <DashboardTopBar />
      <div className="flex flex-col gap-5 px-4 pb-6 pt-5 sm:px-6 lg:px-8">
        <DashboardGreeting />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <TrafficCard />
          <MapCard />
          <SecurityCard />
        </div>
      </div>
    </div>
  );
}

function DashboardTopBar() {
  return (
    <div className="flex items-center gap-3 border-b border-hairline/80 px-4 py-3 sm:gap-4 sm:px-6">
      <Logo size="sm" className="shrink-0" />
      <div className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:flex lg:gap-2">
        {TABS.map((tab, index) => (
          <span
            key={tab}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium lg:text-sm",
              index === 0
                ? "bg-ink text-white"
                : "text-muted-foreground hover:text-ink",
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="hidden h-8 w-36 items-center gap-2 rounded-full border border-hairline bg-surface/80 px-3 text-xs text-muted-foreground md:inline-flex lg:w-44">
          <SearchIcon className="size-3.5 opacity-60" />
          Search network…
        </span>
        <div className="flex -space-x-2">
          {["bg-info", "bg-ink", "bg-brand"].map((tone) => (
            <span
              key={tone}
              className={cn("size-7 rounded-full border-2 border-card", tone)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardGreeting() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-heading text-lg font-medium tracking-tight text-ink sm:text-xl">
          Good Morning, Network Ops
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Live wholesale & messaging overview
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Kpi label="184 Carrier Partners" delta="+6%" />
        <Kpi label="2.4B Messages / mo" delta="+12%" />
      </div>
    </div>
  );
}

function Kpi({ label, delta }: { label: string; delta: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface/60 px-3.5 py-2.5">
      <p className="text-sm font-medium text-ink">{label}</p>
      <span className="mt-1 inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
        {delta}
      </span>
    </div>
  );
}

function TrafficCard() {
  return (
    <div className="flex min-h-[220px] flex-col rounded-2xl border border-hairline bg-white p-4 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Global Traffic</p>
        <span className="text-[11px] text-muted-foreground">
          Gbps · voice & data
        </span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-2 px-1 pb-1">
        {TRAFFIC_BARS.map((bar) => (
          <div
            key={bar.region}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-28 w-full items-end justify-center gap-0.5">
              <span
                className="w-[42%] rounded-t-md bg-linear-to-t from-info to-info/40"
                style={{ height: `${bar.voice}%` }}
              />
              <span
                className="w-[42%] rounded-t-md bg-linear-to-t from-brand to-brand/35"
                style={{ height: `${bar.data}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {bar.region}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapCard() {
  const hubMap = Object.fromEntries(HUBS.map((h) => [h.id, h]));

  return (
    <div className="flex min-h-[220px] flex-col rounded-2xl border border-hairline bg-surface/80 p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Live Network Map</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-info" />
          Live
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_30%_40%,color-mix(in_oklch,var(--info)_12%,var(--surface)),transparent_55%),radial-gradient(circle_at_70%_60%,color-mix(in_oklch,var(--brand)_10%,var(--surface)),transparent_50%),var(--surface)]">
        <svg
          viewBox="0 0 100 70"
          className="absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 18 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                cx={4 + col * 5.4}
                cy={4 + row * 5.4}
                r="0.45"
                className="fill-info/25"
              />
            )),
          )}
          {ARCS.map(([from, to]) => {
            const a = hubMap[from];
            const b = hubMap[to];
            if (!a || !b) return null;
            const mx = (a.x + b.x) / 2;
            const my = Math.min(a.y, b.y) - 10;
            return (
              <path
                key={`${from}-${to}`}
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                fill="none"
                stroke="url(#arcGlow)"
                strokeWidth="0.7"
                strokeLinecap="round"
                className="opacity-80"
              />
            );
          })}
          <defs>
            <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--info)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--brand)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--info)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {HUBS.map((hub) => (
            <g key={hub.id}>
              <circle
                cx={hub.x}
                cy={hub.y}
                r="2.2"
                className="fill-card stroke-info"
                strokeWidth="0.6"
              />
              <circle cx={hub.x} cy={hub.y} r="1" className="fill-brand" />
            </g>
          ))}
        </svg>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          {HUBS.map((hub) => (
            <span
              key={hub.id}
              className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-ink shadow-xs"
            >
              {hub.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityCard() {
  return (
    <div className="flex min-h-[220px] flex-col rounded-2xl bg-charcoal p-4 text-charcoal-foreground shadow-md">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium">Security Shield</p>
        <span className="rounded-full bg-charcoal-foreground/10 px-2 py-0.5 text-[10px] text-charcoal-muted">
          Onboarding
        </span>
      </div>
      <p className="font-heading text-2xl font-medium tracking-tight">
        Threats Blocked <span className="text-info">99.8%</span>
      </p>
      <p className="mt-1 text-xs text-charcoal-muted">
        Last 24h across messaging & edge
      </p>
      <div className="mt-5 flex flex-1 flex-col justify-end gap-3">
        {SHIELD_SEGMENTS.map((segment) => (
          <div key={segment.label}>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-charcoal-muted">{segment.label}</span>
              <span className="text-charcoal-foreground/90">
                {segment.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-charcoal-foreground/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-info via-brand to-brand-hover"
                style={{ width: `${segment.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
