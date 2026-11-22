import type { ReactNode } from "react";
import {
  CarIcon,
  CloudIcon,
  CpuIcon,
  GaugeIcon,
  GlobeIcon,
  MapPinIcon,
  MessageSquareIcon,
  ServerIcon,
  ShieldIcon,
  SmartphoneIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ServicesProvideIllustration } from "@/constants/services-provide";

type IllustrationProps = {
  className?: string;
};

/** Soft illustration stage shared by every card. */
function Stage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "services-provide-stage relative h-44 overflow-hidden rounded-xl bg-gradient-to-b from-surface via-surface/40 to-white",
        "ring-1 ring-hairline/70",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,color-mix(in_oklch,var(--background)_88%,transparent)_100%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Glossy app-style icon tile — full-strength brand on the hero only. */
function IconTile({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "soft";
}) {
  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center rounded-2xl shadow-sm",
        "before:pointer-events-none before:absolute before:inset-x-1.5 before:top-0.5 before:h-2 before:rounded-full before:bg-white/30",
        tone === "brand"
          ? "bg-brand text-brand-foreground"
          : "border border-hairline bg-white text-ink/70",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-hairline bg-white/95 px-2 py-0.5 text-[10px] font-medium tracking-wide text-ink shadow-xs backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <span className={cn("block h-1.5 rounded-full bg-ink/10", className)} />
  );
}

/** Concentric rings + globe hero + carrier pill. */
function WholesaleIllustration({ className }: IllustrationProps) {
  return (
    <Stage className={className}>
      <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/10" />
      <div className="absolute left-1/2 top-1/2 size-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/15" />
      <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/20" />

      <svg
        className="pointer-events-none absolute inset-0 size-full text-brand/25"
        viewBox="0 0 320 176"
        fill="none"
      >
        <path
          d="M88 52 C120 28, 200 28, 232 52"
          stroke="currentColor"
          strokeWidth="1"
          className="services-provide-flow"
        />
        <path
          d="M70 110 C110 140, 210 140, 250 110"
          stroke="currentColor"
          strokeWidth="1"
          className="services-provide-flow"
        />
        <path
          d="M96 128 C140 88, 190 70, 248 78"
          stroke="currentColor"
          strokeWidth="1"
          className="services-provide-flow"
        />
      </svg>

      <span className="services-provide-float absolute left-[18%] top-[28%] size-2 rounded-full bg-brand/50 shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand)_12%,transparent)]" />
      <span className="services-provide-float-delay absolute right-[20%] top-[30%] size-2 rounded-full bg-brand/40" />
      <span className="services-provide-float absolute bottom-[26%] left-[36%] size-2 rounded-full bg-brand/35" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <IconTile>
          <GlobeIcon className="size-5" strokeWidth={1.75} />
        </IconTile>
      </div>

      <Pill className="services-provide-float absolute right-3 top-3">
        Global Carriers
      </Pill>
    </Stage>
  );
}

/** Stacked notification cards + delivered badge. */
function MessagingIllustration({ className }: IllustrationProps) {
  return (
    <Stage className={className}>
      <div className="absolute left-1/2 top-[52%] w-[78%] max-w-[15rem] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-x-3 -top-3 h-16 rounded-2xl border border-hairline bg-white/50 shadow-xs" />
        <div className="absolute inset-x-1.5 -top-1.5 h-16 rounded-2xl border border-hairline bg-white/70 shadow-xs" />
        <div className="relative rounded-2xl border border-hairline bg-white p-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <IconTile className="size-9 shrink-0 rounded-xl">
              <MessageSquareIcon className="size-4" strokeWidth={1.75} />
            </IconTile>
            <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
              <SkeletonLine className="w-3/4" />
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-2/5" />
            </div>
          </div>
        </div>
      </div>

      <Pill className="services-provide-float absolute left-3 top-3 text-success">
        <span className="services-provide-pulse size-1.5 rounded-full bg-success" />
        Delivered ✓
      </Pill>
      <Pill className="services-provide-float-delay absolute bottom-3 right-3">
        2.4B / mo
      </Pill>
    </Stage>
  );
}

/** Server → cloud → app flow with dashed connectors. */
function CloudIllustration({ className }: IllustrationProps) {
  return (
    <Stage className={className}>
      <div className="absolute inset-0 flex items-center justify-between px-5">
        <div className="services-provide-float flex flex-col gap-2">
          <IconTile tone="soft" className="size-9 rounded-xl">
            <ServerIcon className="size-3.5" strokeWidth={1.75} />
          </IconTile>
          <IconTile tone="soft" className="size-9 rounded-xl opacity-70">
            <ServerIcon className="size-3.5" strokeWidth={1.75} />
          </IconTile>
        </div>

        <svg
          className="h-8 w-10 shrink-0 text-brand/35"
          viewBox="0 0 40 32"
          fill="none"
        >
          <path
            d="M2 16 H38"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray="3 3"
            className="services-provide-flow"
          />
        </svg>

        <IconTile className="services-provide-float-delay size-14 rounded-[1.15rem]">
          <CloudIcon className="size-6" strokeWidth={1.75} />
        </IconTile>

        <svg
          className="h-8 w-10 shrink-0 text-brand/35"
          viewBox="0 0 40 32"
          fill="none"
        >
          <path
            d="M2 16 H38"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray="3 3"
            className="services-provide-flow"
          />
        </svg>

        <div className="services-provide-float flex flex-col gap-2">
          <IconTile tone="soft" className="size-9 rounded-xl">
            <SmartphoneIcon className="size-3.5" strokeWidth={1.75} />
          </IconTile>
          <IconTile tone="soft" className="size-9 rounded-xl opacity-70">
            <CpuIcon className="size-3.5" strokeWidth={1.75} />
          </IconTile>
        </div>
      </div>

      <Pill className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="services-provide-pulse size-1.5 rounded-full bg-success" />
        Uptime 99.99%
      </Pill>
    </Stage>
  );
}

/** Chip hero with orbiting device satellites. */
function IotIllustration({ className }: IllustrationProps) {
  return (
    <Stage className={className}>
      <div className="absolute left-1/2 top-1/2 size-[8.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand/20" />
      <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/10" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <IconTile className="size-14 rounded-[1.15rem]">
          <CpuIcon className="size-6" strokeWidth={1.75} />
        </IconTile>
      </div>

      <div className="services-provide-float absolute left-[14%] top-[22%]">
        <IconTile tone="soft" className="size-8 rounded-xl">
          <CarIcon className="size-3.5" strokeWidth={1.75} />
        </IconTile>
        <span className="services-provide-pulse absolute -right-0.5 -top-0.5 size-2 rounded-full border border-white bg-success" />
      </div>
      <div className="services-provide-float-delay absolute right-[12%] top-[30%]">
        <IconTile tone="soft" className="size-8 rounded-xl">
          <GaugeIcon className="size-3.5" strokeWidth={1.75} />
        </IconTile>
        <span className="services-provide-pulse absolute -right-0.5 -top-0.5 size-2 rounded-full border border-white bg-success" />
      </div>
      <div className="services-provide-float absolute bottom-[18%] left-[28%]">
        <IconTile tone="soft" className="size-8 rounded-xl">
          <MapPinIcon className="size-3.5" strokeWidth={1.75} />
        </IconTile>
        <span className="services-provide-pulse absolute -right-0.5 -top-0.5 size-2 rounded-full border border-white bg-success" />
      </div>

      <Pill className="absolute right-3 top-3">
        <span className="services-provide-pulse size-1.5 rounded-full bg-success" />
        12k Devices Live
      </Pill>
    </Stage>
  );
}

/** Shield in front of a threat-log panel. */
function CyberIllustration({ className }: IllustrationProps) {
  return (
    <Stage className={className}>
      <div className="absolute inset-x-6 top-5 bottom-8 rounded-2xl border border-hairline bg-white/70 p-3 shadow-xs">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Live
          </span>
          <span className="services-provide-pulse size-1.5 rounded-full bg-destructive" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg px-1.5 py-1">
            <SkeletonLine className="w-10" />
            <SkeletonLine className="flex-1" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-destructive/8 px-1.5 py-1 ring-1 ring-destructive/15">
            <SkeletonLine className="w-10 bg-destructive/25" />
            <SkeletonLine className="flex-1 bg-destructive/20" />
            <Pill className="shrink-0 border-destructive/20 bg-destructive/10 text-destructive">
              Blocked
            </Pill>
          </div>
          <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 opacity-70">
            <SkeletonLine className="w-10" />
            <SkeletonLine className="w-2/3" />
          </div>
        </div>
      </div>

      <div className="services-provide-float absolute bottom-5 left-5">
        <IconTile className="size-14 rounded-[1.15rem] shadow-md">
          <ShieldIcon className="size-6" strokeWidth={1.75} />
        </IconTile>
      </div>

      <Pill className="services-provide-float-delay absolute bottom-3 right-3">
        Threats stopped 99.8%
      </Pill>
    </Stage>
  );
}

/** Soft bar chart with target line + tooltip. */
function AnalyticsIllustration({ className }: IllustrationProps) {
  const bars = [
    { h: "38%", active: false },
    { h: "58%", active: false },
    { h: "46%", active: false },
    { h: "86%", active: true },
    { h: "52%", active: false },
    { h: "64%", active: false },
  ] as const;

  return (
    <Stage className={className}>
      <div className="absolute inset-x-6 bottom-5 top-10">
        <div className="absolute inset-x-0 top-[28%] border-t border-dashed border-brand/30">
          <span className="absolute -top-2.5 right-0 rounded bg-white/90 px-1 text-[9px] font-medium text-brand">
            Target
          </span>
        </div>
        <div className="flex h-full items-end justify-between gap-2 px-1 pb-1">
          {bars.map((bar, index) => (
            <span
              key={index}
              className={cn(
                "services-provide-bar w-full max-w-6 rounded-t-md",
                bar.active
                  ? "bg-brand shadow-[0_0_0_1px_color-mix(in_oklch,var(--brand)_20%,transparent)]"
                  : "bg-brand/15",
              )}
              style={{ height: bar.h }}
            />
          ))}
        </div>
      </div>

      <div className="services-provide-float absolute right-4 top-3 w-[7.5rem] rounded-xl border border-hairline bg-white p-2 shadow-sm">
        <SkeletonLine className="mb-1.5 w-10" />
        <p className="text-[11px] font-semibold text-ink">+18.4%</p>
        <SkeletonLine className="mt-1.5 w-full" />
      </div>
    </Stage>
  );
}

const ILLUSTRATIONS: Record<
  ServicesProvideIllustration,
  (props: IllustrationProps) => ReactNode
> = {
  wholesale: WholesaleIllustration,
  messaging: MessagingIllustration,
  cloud: CloudIllustration,
  iot: IotIllustration,
  cyber: CyberIllustration,
  analytics: AnalyticsIllustration,
};

export function ServicesProvideIllustration({
  kind,
  className,
}: {
  kind: ServicesProvideIllustration;
  className?: string;
}) {
  const Illustration = ILLUSTRATIONS[kind];
  return <Illustration className={className} />;
}
