"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";

import { BlogAdminCard } from "@/components/blogs/blog-admin-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import type { BlogListItem } from "@/types/blog";
import type { BlogListQuery } from "@/validations/blog";

type BlogsAdminListProps = {
  blogs: BlogListItem[];
  total: number;
  totalPages: number;
  query: BlogListQuery;
};

export function BlogsAdminList({
  blogs,
  total,
  totalPages,
  query,
}: BlogsAdminListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateParams(patch: Record<string, string>) {
    const params = new URLSearchParams();
    const next = {
      page: String(query.page),
      search: query.search,
      status: query.status,
      ...patch,
    };
    if (next.page !== "1") params.set("page", next.page);
    if (next.search) params.set("search", next.search);
    if (next.status !== "all") params.set("status", next.status);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${ROUTES.blogs}?${qs}` : ROUTES.blogs);
    });
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            updateParams({
              search: String(form.get("search") ?? "").trim(),
              page: "1",
            });
          }}
        >
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={query.search}
              placeholder="Search title, slug, or author"
              className="min-h-11 pl-9"
              disabled={isPending}
            />
          </div>
          <Select
            value={query.status}
            onValueChange={(value) => {
              if (!value) return;
              updateParams({ status: value, page: "1" });
            }}
            disabled={isPending}
          >
            <SelectTrigger className="min-h-11 w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="secondary" className="min-h-11">
            Search
          </Button>
        </form>
        <Button
          className="min-h-11 w-full sm:w-auto"
          nativeButton={false}
          render={<Link href={`${ROUTES.blogs}/new`} />}
        >
          <PlusIcon className="size-4" />
          New blog
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {total} post{total === 1 ? "" : "s"}
      </p>

      {blogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-heading text-lg font-semibold">No blogs yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first insight post to appear on the public Insights
            pages.
          </p>
          <Button
            className="mt-6 min-h-11"
            nativeButton={false}
            render={<Link href={`${ROUTES.blogs}/new`} />}
          >
            <PlusIcon className="size-4" />
            New blog
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <BlogAdminCard blog={blog} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={isPending || query.page <= 1}
            onClick={() =>
              updateParams({ page: String(Math.max(1, query.page - 1)) })
            }
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {query.page} of {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={isPending || query.page >= totalPages}
            onClick={() =>
              updateParams({
                page: String(Math.min(totalPages, query.page + 1)),
              })
            }
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
