import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { InquiriesTable } from "@/components/inquiries/inquiries-table";
import { AccessDenied } from "@/components/layout/access-denied";
import { getPortalSection } from "@/constants/dashboard-nav";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { listInquiries } from "@/data/inquiries";
import {
  ADMIN_LIST_PAGE_SIZE,
  setAdminListPagingParams,
} from "@/validations/admin-list-query";
import { parseInquiryListQuery } from "@/validations/inquiries";

export const metadata: Metadata = {
  title: getPortalSection(ROUTES.inquiries)?.title ?? "Inquiries",
};

export default async function InquiriesPage({
  searchParams,
}: PageProps<"/dashboard/inquiries">) {
  const { session, section, allowed } = await requireSection(ROUTES.inquiries);
  if (!allowed) return <AccessDenied />;

  const query = parseInquiryListQuery(await searchParams);
  const list = await listInquiries(session, query);

  if (query.page > list.totalPages) {
    const params = new URLSearchParams();
    setAdminListPagingParams(params, {
      page: list.totalPages,
      pageSize: query.pageSize,
      defaultPageSize: ADMIN_LIST_PAGE_SIZE,
    });
    if (query.search) params.set("search", query.search);
    if (query.status !== "all") params.set("status", query.status);
    if (query.intent !== "all") params.set("intent", query.intent);
    redirect(`${ROUTES.inquiries}?${params.toString()}`);
  }

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={section.title}
        description={section.description}
      />
      <InquiriesTable
        inquiries={list.inquiries}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
