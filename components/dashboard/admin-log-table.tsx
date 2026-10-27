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

export function actorLabel(actor: ActivityLogActor): string {
  if (!actor) return "—";
  return actor.full_name?.trim() || actor.email || "—";
}

export type AdminLogColumn = {
  key: string;
  header: string;
  className?: string;
};

export type AdminLogFilterContext = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

type AdminLogTableProps = {
  searchId: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchCommit: (next: string) => void;
  clearHref: string;
  hasFilters: boolean;
  /** Extra filter controls; receive the shared pending transition. */
  filters?: ReactNode | ((ctx: AdminLogFilterContext) => ReactNode);
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  columns: AdminLogColumn[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  isEmpty: boolean;
  children: ReactNode;
};

/**
 * Shared Card + search + table + pagination shell for admin log surfaces.
 * Domain tables supply columns, row children, and optional extra filters.
 */
export function AdminLogTable({
  searchId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchCommit,
  clearHref,
  hasFilters,
  filters,
  page,
  pageSize,
  total,
  totalPages,
  hrefForPage,
  columns,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  isEmpty,
  children,
}: AdminLogTableProps) {
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

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Label htmlFor={searchId} className="sr-only">
            {searchLabel}
          </Label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={searchId}
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 pl-9"
          />
          {isPending ? (
            <Spinner className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
          ) : null}
        </div>
        {filterNode}
        {hasFilters ? (
          <Link
            href={clearHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "min-h-11",
            )}
          >
            <XIcon className="size-4" />
            Clear
          </Link>
        ) : null}
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    index === 0 && "pl-4",
                    index === columns.length - 1 && "pr-4",
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
                  colSpan={columns.length}
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

      <CardFooter className="border-t px-4 py-3">
        <ListPagination
          hrefForPage={hrefForPage}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
        />
      </CardFooter>
    </Card>
  );
}
