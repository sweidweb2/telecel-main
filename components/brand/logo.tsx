import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Mark only (collapsed sidebar, favicon-sized spots). */
  compact?: boolean;
};

/**
 * Placeholder Telecel Global lockup built from theme tokens.
 * Replace the mark/wordmark with the official SVG once Telecel supplies it
 * (keep this component's API so call sites do not change).
 */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-foreground", className)}
      aria-label="Telecel Global"
      role="img"
    >
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold leading-none text-brand-foreground"
      >
        t
      </span>
      {compact ? null : (
        <span aria-hidden className="flex items-baseline gap-1 font-heading leading-none">
          <span className="text-lg font-bold tracking-tight text-brand">telecel</span>
          <span className="text-sm font-medium text-muted-foreground">Global</span>
        </span>
      )}
    </span>
  );
}
