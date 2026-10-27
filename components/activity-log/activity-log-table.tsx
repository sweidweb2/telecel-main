"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState, useTransition } from "react";
import { format } from "date-fns";
import { ClipboardListIcon, SearchIcon, XIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ActivityLogRow } from "@/types/observability";
import {
  ACTIVITY_LOG_PAGE_SIZE,
  type ActivityLogQuery,
} from "@/validations/audit-log";

const SEARCH_DEBOUNCE_MS = 600;

function pageHref(query: ActivityLogQuery, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  const qs = params.toString();
  return qs ? `${ROUTES.activityLog}?${qs}` : ROUTES.activityLog;
}

function actorLabel(row: ActivityLogRow): string {
  if (!row.actor) return "—";
  return row.actor.full_name?.trim() || row.actor.email || "—";
}

export function ActivityLogTable({
  rows,
  total,
  totalPages,
  query,
}: {
  rows: ActivityLogRow[];
  total: number;
  totalPages: number;
  query: ActivityLogQuery;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  const [prevSearch, setPrevSearch] = useState(query.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (query.search !== prevSearch) {
    setPrevSearch(query.search);
    setSearch(query.search);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigateSearch(value: string) {
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    startTransition(() => {
      router.push(
        params.toString()
          ? `${ROUTES.activityLog}?${params.toString()}`
          : ROUTES.activityLog,
      );
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = value.trim();
      if (next === query.search) return;
      navigateSearch(next);
    }, SEARCH_DEBOUNCE_MS);
  }

  const current = Math.min(query.page, Math.max(totalPages, 1));
  const from = total === 0 ? 0 : (current - 1) * ACTIVITY_LOG_PAGE_SIZE + 1;
  const to = Math.min(current * ACTIVITY_LOG_PAGE_SIZE, total);

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Label htmlFor="activity-search" className="sr-only">
            Search activity
          </Label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="activity-search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search action, entity, id…"
            className="h-11 pl-9"
          />
          {isPending ? (
            <Spinner className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
          ) : null}
        </div>
        {query.search ? (
          <Link
            href={ROUTES.activityLog}
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "min-h-11")}
          >
            <XIcon className="size-4" />
            Clear
          </Link>
        ) : null}
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead className="pr-4">Id</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 whitespace-normal">
                      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <ClipboardListIcon className="size-5 text-muted-foreground" />
                      </span>
                      <p className="font-medium">No activity yet</p>
                      <p className="text-sm text-muted-foreground">
                        Successful CMS and user mutations will appear here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap pl-4 text-muted-foreground">
                      {format(new Date(row.created_at), "dd MMM yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="max-w-[10rem] truncate sm:max-w-[14rem]">
                      {actorLabel(row)}
                    </TableCell>
                    <TableCell className="font-medium">{row.action}</TableCell>
                    <TableCell>{row.entity_type}</TableCell>
                    <TableCell className="max-w-[8rem] truncate pr-4 font-mono text-xs text-muted-foreground sm:max-w-[12rem]">
                      {row.entity_id ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="border-t px-4 py-3">
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
                    className={cn(
                      current === 1 && "pointer-events-none opacity-50",
                    )}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={pageHref(query, current)} isActive>
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
      </CardFooter>
    </Card>
  );
}
