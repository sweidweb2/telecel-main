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
    const params = new URLSearchParams({ page: String(list.totalPages) });
    if (query.search) params.set("search", query.search);
    if (query.role !== "all") params.set("role", query.role);
    redirect(`${ROUTES.users}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
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
