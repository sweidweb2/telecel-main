import Link from "next/link";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { canAccessSection, PORTAL_NAV } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";

export default async function DashboardPage() {
  const { session } = await requireSection(ROUTES.dashboard);

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-8 p-4 sm:p-6">
      <PortalPageHeader
        title="Welcome"
        description={`Signed in as ${session.email} (${session.role}).`}
      />
      {PORTAL_NAV.filter((group) => group.label !== "Overview").map((group) => {
        const items = group.items.filter((item) => canAccessSection(session.role, item));
        if (items.length === 0) return null;

        return (
          <section key={group.label} className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{group.label}</h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Card className="h-full transition-colors hover:bg-muted/40">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle>{item.title}</CardTitle>
                        {item.ready ? null : <Badge variant="outline">Planned</Badge>}
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
