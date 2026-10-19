import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BlogsAdminList } from "@/components/blogs/blogs-admin-list";
import { ROUTES } from "@/constants/routes";
import { getBlogsPageData } from "@/data/blogs";
import { parseBlogListQuery } from "@/validations/blog";

export const metadata: Metadata = {
  title: "Blogs | ASIP Admin",
};

type BlogsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const query = parseBlogListQuery(await searchParams);
  const result = await getBlogsPageData(query);

  if (result.status === "forbidden") redirect(ROUTES.dashboard);

  const { list } = result;

  if (query.page > list.totalPages) {
    const params = new URLSearchParams({
      page: String(list.totalPages),
    });
    if (query.search) params.set("search", query.search);
    if (query.status !== "all") params.set("status", query.status);
    redirect(`${ROUTES.blogs}?${params.toString()}`);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="min-w-0">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Blogs
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage Insights articles shown on the public site.
        </p>
      </div>

      <BlogsAdminList
        blogs={list.blogs}
        total={list.total}
        totalPages={list.totalPages}
        query={query}
      />
    </main>
  );
}
