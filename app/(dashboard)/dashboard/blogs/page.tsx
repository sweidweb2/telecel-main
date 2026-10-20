import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BlogsAdminList } from "@/components/blogs/blogs-admin-list";
import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { getBlogsPageData } from "@/data/blogs";
import { parseBlogListQuery } from "@/validations/blog";

export const metadata: Metadata = {
  title: "News",
};

export default async function BlogsPage({
  searchParams,
}: PageProps<"/dashboard/blogs">) {
  const { session, section } = await requireSection(ROUTES.blogs);
  const query = parseBlogListQuery(await searchParams);
  const list = await getBlogsPageData(session, query);

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({ page: String(list.totalPages) });
    if (query.search) params.set("search", query.search);
    if (query.status !== "all") params.set("status", query.status);
    redirect(`${ROUTES.blogs}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <PortalPageHeader title={section.title} description={section.description} />
      <BlogsAdminList
        blogs={list.blogs}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
