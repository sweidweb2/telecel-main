import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/** Centered empty list / table placeholder. */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-hairline px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="flex size-10 items-center justify-center rounded-lg bg-surface text-muted-foreground">
          <Icon className="size-5" aria-hidden />
        </div>
      ) : null}
      <div className="max-w-sm space-y-1">
        <Heading level="label" as="p">
          {title}
        </Heading>
        {description ? <Text variant="muted">{description}</Text> : null}
      </div>
      {action ? (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export { EmptyState };
