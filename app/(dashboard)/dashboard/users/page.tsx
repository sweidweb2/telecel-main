import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CreateUserDialog } from "@/components/users/user-dialogs";
import { UserStatsCards } from "@/components/users/user-stats";
import { UsersTable } from "@/components/users/users-table";
import { ROUTES } from "@/constants/routes";
import { getUsersPageData } from "@/data/users";
import { parseUserListQuery } from "@/validations/users";

export const metadata: Metadata = {
  title: "Users | ASIP Admin",
};

type UsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const query = parseUserListQuery(await searchParams);
  const result = await getUsersPageData(query);

  if (result.status === "forbidden") redirect(ROUTES.dashboard);

  const { list, stats } = result;

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({
      page: String(list.totalPages),
    });
    if (query.search) params.set("search", query.search);
    if (query.role !== "all") params.set("role", query.role);
    redirect(`${ROUTES.users}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Users
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create accounts and manage profile access across the CMS.
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <UserStatsCards stats={stats} />

      <UsersTable
        users={list.users}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
