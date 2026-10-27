import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { AccessDenied } from "@/components/layout/access-denied";
import { CreateUserDialog } from "@/components/users/user-dialogs";
import { UserStatsCards } from "@/components/users/user-stats";
import { UsersTable } from "@/components/users/users-table";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { getUsersPageData } from "@/data/users";
import {
  setAdminListPagingParams,
  USER_LIST_PAGE_SIZE,
} from "@/validations/admin-list-query";
import { parseUserListQuery } from "@/validations/users";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage({
  searchParams,
}: PageProps<"/dashboard/users">) {
  const { session, section, allowed } = await requireSection(ROUTES.users);
  if (!allowed) return <AccessDenied />;

  const query = parseUserListQuery(await searchParams);
  const { list, stats } = await getUsersPageData(session, query);

  if (query.page > list.totalPages) {
    const params = new URLSearchParams();
    setAdminListPagingParams(params, {
      page: list.totalPages,
      pageSize: query.pageSize,
      defaultPageSize: USER_LIST_PAGE_SIZE,
    });
    if (query.search) params.set("search", query.search);
    if (query.role !== "all") params.set("role", query.role);
    redirect(`${ROUTES.users}?${params.toString()}`);
  }

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={section.title}
        description={section.description}
        actions={<CreateUserDialog />}
      />
      <UserStatsCards stats={stats} />
      <UsersTable
        users={list.users}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
        currentUserId={session.userId}
      />
    </main>
  );
}
