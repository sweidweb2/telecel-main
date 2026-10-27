import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { ErrorLogTable } from "@/components/error-log/error-log-table";
import { AccessDenied } from "@/components/layout/access-denied";
import { ROUTES } from "@/constants/routes";
import { getErrorLogPage } from "@/data/app-errors";
import { requireSection } from "@/data/auth";
import { parseErrorLogQuery } from "@/validations/app-errors";

export const metadata: Metadata = {
  title: "Error log",
};

export default async function ErrorLogPage({
  searchParams,
}: PageProps<"/dashboard/error-log">) {
  const { session, section, allowed } = await requireSection(ROUTES.errorLog);
  if (!allowed) return <AccessDenied />;

  const query = parseErrorLogQuery(await searchParams);
  const list = await getErrorLogPage(session, query);

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({ page: String(list.totalPages) });
    if (query.search) params.set("search", query.search);
    if (query.severity !== "all") params.set("severity", query.severity);
    redirect(`${ROUTES.errorLog}?${params.toString()}`);
  }

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={section.title}
        description={section.description}
      />
      <ErrorLogTable
        rows={list.rows}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
