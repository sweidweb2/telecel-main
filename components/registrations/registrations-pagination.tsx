import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  INTEREST_REGISTRATION_PAGE_SIZE,
  type InterestRegistrationListQuery,
} from "@/validations/interest-registration";

function pageHref(query: InterestRegistrationListQuery, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  const qs = params.toString();
  return qs ? `${ROUTES.registrations}?${qs}` : ROUTES.registrations;
}

export function RegistrationsPagination({
  query,
  total,
  totalPages,
}: {
  query: InterestRegistrationListQuery;
  total: number;
  totalPages: number;
}) {
  const current = Math.min(query.page, Math.max(totalPages, 1));
  const from =
    total === 0 ? 0 : (current - 1) * INTEREST_REGISTRATION_PAGE_SIZE + 1;
  const to = Math.min(current * INTEREST_REGISTRATION_PAGE_SIZE, total);

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
                href={current > 1 ? pageHref(query, current - 1) : undefined}
                aria-disabled={current === 1}
                className={cn(current === 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={pageHref(query, current)}
                isActive
                aria-label={`Page ${current} of ${totalPages}`}
              >
                {current} / {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  current < totalPages
                    ? pageHref(query, current + 1)
                    : undefined
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
