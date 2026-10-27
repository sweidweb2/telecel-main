import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ActivityLogTable } from "@/components/activity-log/activity-log-table";
import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { AccessDenied } from "@/components/layout/access-denied";
import { ROUTES } from "@/constants/routes";
import { getActivityLogPage } from "@/data/audit-log";
import { requireSection } from "@/data/auth";
import { parseActivityLogQuery } from "@/validations/audit-log";

export const metadata: Metadata = {
  title: "Activity log",
};

export default async function ActivityLogPage({
  searchParams,
}: PageProps<"/dashboard/activity-log">) {
  const { session, section, allowed } = await requireSection(ROUTES.activityLog);
  if (!allowed) return <AccessDenied />;

  const query = parseActivityLogQuery(await searchParams);
  const list = await getActivityLogPage(session, query);

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({ page: String(list.totalPages) });
    if (query.search) params.set("search", query.search);
    redirect(`${ROUTES.activityLog}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <PortalPageHeader
        title={section.title}
        description={section.description}
      />
      <ActivityLogTable
        rows={list.rows}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
