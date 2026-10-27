import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { canAccessSection, PORTAL_NAV } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";

export default async function DashboardPage() {
  const { session } = await requireSection(ROUTES.dashboard);

  return (
    <main className="dashboard-page gap-10">
      <PortalPageHeader
        title="Overview"
        description={`Signed in as ${session.email}. Your role: ${session.role}.`}
      />
      {PORTAL_NAV.filter((group) => group.label !== "Overview").map((group) => {
        const items = group.items.filter((item) => canAccessSection(session.role, item));
        if (items.length === 0) return null;

        return (
          <section key={group.label} aria-labelledby={`group-${group.label}`}>
            <h3 id={`group-${group.label}`} className="type-notation text-muted-foreground">
              {group.label}
            </h3>
            <ul className="mt-3 grid border-t md:grid-cols-2 md:gap-x-10">
              {items.map((item) => (
                <li key={item.href} className="border-b">
                  <Link
                    href={item.href}
                    className="group grid min-h-20 grid-cols-[1fr_auto] items-center gap-4 py-4 outline-none focus-visible:bg-surface"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-ink group-hover:underline group-hover:underline-offset-4">
                          {item.title}
                        </span>
                        {item.ready ? (
                          <span className="type-notation text-brand">Live</span>
                        ) : (
                          <span className="type-notation text-muted-foreground">Soon</span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <ArrowRightIcon className="size-4 text-muted-foreground transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
