"use client";

import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ADMIN_PAGE_SIZE_OPTIONS,
  type AdminPageSize,
} from "@/validations/admin-list-query";

type ListPaginationProps = {
  /** Absolute or path URL builder for a 1-based page. */
  hrefForPage: (page: number) => string;
  /** When set, shows a rows-per-page control. */
  hrefForPageSize?: (pageSize: AdminPageSize) => string;
  pageSizeOptions?: readonly AdminPageSize[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/** Shared CMS list footer: result range + limit + prev/next. */
export function ListPagination({
  hrefForPage,
  hrefForPageSize,
  pageSizeOptions = ADMIN_PAGE_SIZE_OPTIONS,
  page,
  pageSize,
  total,
  totalPages,
}: ListPaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const current = Math.min(page, Math.max(totalPages, 1));
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
        </p>
        {hrefForPageSize ? (
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm text-muted-foreground">
              Rows
            </Label>
            <Select
              value={String(pageSize)}
              disabled={isPending}
              onValueChange={(value) => {
                if (!value) return;
                const next = Number(value) as AdminPageSize;
                startTransition(() => {
                  router.push(hrefForPageSize(next));
                });
              }}
            >
              <SelectTrigger
                id="rows-per-page"
                className="min-h-11 w-[4.5rem] sm:min-h-8"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={current > 1 ? hrefForPage(current - 1) : undefined}
                aria-disabled={current === 1}
                className={cn(current === 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={hrefForPage(current)}
                isActive
                aria-label={`Page ${current} of ${totalPages}`}
              >
                {current} / {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  current < totalPages ? hrefForPage(current + 1) : undefined
                }
                aria-disabled={current === totalPages}
                className={cn(
                  current === totalPages && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
