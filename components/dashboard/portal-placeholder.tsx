import { ConstructionIcon } from "lucide-react";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PortalSection } from "@/constants/dashboard-nav";

/** Empty portal section: heading plus the capabilities planned for it. */
export function PortalPlaceholder({ section }: { section: PortalSection }) {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <PortalPageHeader title={section.title} description={section.description} />
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
            <ConstructionIcon className="size-5 text-muted-foreground" aria-hidden />
          </div>
          <CardTitle>Not built yet</CardTitle>
          <CardDescription>
            This section is part of the Phase 1 CMS. Planned capabilities:
          </CardDescription>
        </CardHeader>
        {section.planned.length > 0 ? (
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {section.planned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </Card>
    </main>
  );
}
