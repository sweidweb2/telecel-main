import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegistrationsTable } from "@/components/registrations/registrations-table";
import { ROUTES } from "@/constants/routes";
import { getInterestRegistrationsPageData } from "@/data/interest-registrations";
import { parseInterestRegistrationListQuery } from "@/validations/interest-registration";

export const metadata: Metadata = {
  title: "Registrations | ASIP Admin",
};

type RegistrationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegistrationsPage({
  searchParams,
}: RegistrationsPageProps) {
  const query = parseInterestRegistrationListQuery(await searchParams);
  const result = await getInterestRegistrationsPageData(query);

  if (result.status === "forbidden") redirect(ROUTES.dashboard);

  const { list } = result;

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({
      page: String(list.totalPages),
    });
    if (query.search) params.set("search", query.search);
    redirect(`${ROUTES.registrations}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="min-w-0">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Registrations
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage interest submissions from the apply form.
        </p>
      </div>

      <RegistrationsTable
        registrations={list.registrations}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
