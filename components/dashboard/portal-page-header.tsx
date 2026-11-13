import type { ReactNode } from "react";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

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
        <Heading level="title">{title}</Heading>
        {description ? (
          <Text
            variant="body"
            className="mt-1 max-w-[65ch] text-muted-foreground"
          >
            {description}
          </Text>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
