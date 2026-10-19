import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Locale } from "@/constants/locales";
import { publicPath } from "@/constants/routes";
import { cn } from "@/lib/utils";

type PortfolioPaginationLabels = {
  showing: string;
  previous: string;
  next: string;
};

function pageHref(locale: Locale, page: number) {
  const base = publicPath(locale, "portfolio");
  return page > 1 ? `${base}?page=${page}` : base;
}

export function PortfolioPagination({
  locale,
  currentPage,
  totalPages,
  total,
  pageSize,
  labels,
}: {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  labels: PortfolioPaginationLabels;
}) {
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  const showing = labels.showing
    .replace("{from}", String(from))
    .replace("{to}", String(to))
    .replace("{total}", String(total));

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-center text-sm text-muted-foreground sm:text-left">
        {showing}
      </p>

      {totalPages > 1 ? (
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="flex-wrap justify-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href={
                  currentPage > 1 ? pageHref(locale, currentPage - 1) : undefined
                }
                text={labels.previous}
                aria-disabled={currentPage === 1}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={pageHref(locale, page)}
                    isActive={page === currentPage}
                    aria-label={`Page ${page} of ${totalPages}`}
                    className="min-w-9"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  currentPage < totalPages
                    ? pageHref(locale, currentPage + 1)
                    : undefined
                }
                text={labels.next}
                aria-disabled={currentPage === totalPages}
                className={cn(
                  currentPage === totalPages &&
                    "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
