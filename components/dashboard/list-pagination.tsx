import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type ListPaginationProps = {
  /** Absolute or path URL builder for a 1-based page. */
  hrefForPage: (page: number) => string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/** Shared CMS list footer: result range + prev/next. */
export function ListPagination({
  hrefForPage,
  page,
  pageSize,
  total,
  totalPages,
}: ListPaginationProps) {
  const current = Math.min(page, Math.max(totalPages, 1));
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
      </p>

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
