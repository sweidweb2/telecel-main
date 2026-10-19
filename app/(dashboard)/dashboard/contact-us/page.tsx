import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContactMessagesTable } from "@/components/contact-messages/contact-messages-table";
import { ROUTES } from "@/constants/routes";
import { getContactMessagesPageData } from "@/data/contact-messages";
import { parseContactMessageListQuery } from "@/validations/contact-message";

export const metadata: Metadata = {
  title: "Contact us | ASIP Admin",
};

type ContactUsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactUsPage({
  searchParams,
}: ContactUsPageProps) {
  const query = parseContactMessageListQuery(await searchParams);
  const result = await getContactMessagesPageData(query);

  if (result.status === "forbidden") redirect(ROUTES.dashboard);

  const { list } = result;

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({
      page: String(list.totalPages),
    });
    if (query.search) params.set("search", query.search);
    redirect(`${ROUTES.contactUs}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="min-w-0">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Contact us
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage messages submitted from the public contact form.
        </p>
      </div>

      <ContactMessagesTable
        messages={list.messages}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
