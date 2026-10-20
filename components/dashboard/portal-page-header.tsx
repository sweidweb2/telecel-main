import type { ReactNode } from "react";

/** Consistent heading block for every portal page. */
export function PortalPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-heading text-[1.75rem] leading-9 font-medium tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-[65ch] text-base text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
