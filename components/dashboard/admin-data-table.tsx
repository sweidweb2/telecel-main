"use client";

import Link from "next/link";
import {
  useTransition,
  type ReactNode,
  type TransitionStartFunction,
} from "react";
import { SearchIcon, XIcon, type LucideIcon } from "lucide-react";

import { ListPagination } from "@/components/dashboard/list-pagination";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedSearchParam } from "@/hooks/use-debounced-search-param";
import { cn } from "@/lib/utils";
import type { ActivityLogActor } from "@/types/observability";
import {
  ADMIN_PAGE_SIZE_OPTIONS,
  type AdminPageSize,
} from "@/validations/admin-list-query";

export function actorLabel(actor: ActivityLogActor): string {
  if (!actor) return "—";
  return actor.full_name?.trim() || actor.email || "—";
}

/** 1-based row number for the current page. */
export function adminRowNumber(
  page: number,
  pageSize: number,
  index: number,
): number {
  return (page - 1) * pageSize + index + 1;
}

export type AdminDataColumn = {
  key: string;
  header: string;
  className?: string;
};

export type AdminDataFilterContext = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

type AdminDataTableProps = {
  searchId: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchCommit: (next: string) => void;
  /** Instant local filter while debounce waits (e.g. users table). */
  onSearchChange?: (value: string) => void;
  clearHref: string;
  hasFilters: boolean;
  /** Extra filter controls; receive the shared pending transition. */
  filters?: ReactNode | ((ctx: AdminDataFilterContext) => ReactNode);
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: AdminPageSize) => string;
  pageSizeOptions?: readonly AdminPageSize[];
  /** Data columns only — `#` is prepended automatically. */
  columns: AdminDataColumn[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  isEmpty: boolean;
  children: ReactNode;
};

/**
 * Shared Card + aligned filters + numbered table + pagination for portal lists.
 */
export function AdminDataTable({
  searchId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchCommit,
  onSearchChange,
  clearHref,
  hasFilters,
  filters,
  page,
  pageSize,
  total,
  totalPages,
  hrefForPage,
  hrefForPageSize,
  pageSizeOptions = ADMIN_PAGE_SIZE_OPTIONS,
  columns,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  isEmpty,
  children,
}: AdminDataTableProps) {
  const [isPending, startTransition] = useTransition();
  const { search, handleSearchChange } = useDebouncedSearchParam({
    committedValue: searchValue,
    onCommit: (next) => {
      startTransition(() => {
        onSearchCommit(next);
      });
    },
  });

  const filterNode =
    typeof filters === "function"
      ? filters({ isPending, startTransition })
      : filters;

  const allColumns: AdminDataColumn[] = [
    { key: "#", header: "#", className: "w-12 pl-4 tabular-nums" },
    ...columns,
  ];

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Label htmlFor={searchId} className="sr-only">
            {searchLabel}
          </Label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              handleSearchChange(value);
              onSearchChange?.(value);
            }}
            placeholder={searchPlaceholder}
            maxLength={100}
            autoComplete="off"
            className="min-h-11 pl-8 sm:min-h-8"
          />
          {isPending ? (
            <Spinner className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground" />
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {filterNode}
          {hasFilters || search ? (
            <Link
              href={clearHref}
              aria-disabled={isPending}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "min-h-11 shrink-0 sm:min-h-8",
                isPending && "pointer-events-none opacity-50",
              )}
              onClick={() => onSearchChange?.("")}
            >
              <XIcon />
              Clear
            </Link>
          ) : null}
        </div>
      </div>

      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {allColumns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    index === allColumns.length - 1 && "pr-4",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-48 text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2 whitespace-normal">
                    <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <EmptyIcon className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">{emptyTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {emptyDescription}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              children
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="border-t bg-transparent px-4 py-3">
        <ListPagination
          hrefForPage={hrefForPage}
          hrefForPageSize={hrefForPageSize}
          pageSizeOptions={pageSizeOptions}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
        />
      </CardFooter>
    </Card>
  );
}

export function AdminRowNumberCell({
  page,
  pageSize,
  index,
}: {
  page: number;
  pageSize: number;
  index: number;
}) {
  return (
    <TableCell className="pl-4 tabular-nums text-muted-foreground">
      {adminRowNumber(page, pageSize, index)}
    </TableCell>
  );
}
