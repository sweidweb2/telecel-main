"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState, useTransition } from "react";
import { format } from "date-fns";
import { CircleAlertIcon, SearchIcon, XIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { ErrorLogRow } from "@/types/observability";
import {
  ERROR_LOG_PAGE_SIZE,
  type ErrorLogQuery,
} from "@/validations/app-errors";

const SEARCH_DEBOUNCE_MS = 600;

function pageHref(query: ErrorLogQuery, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  if (query.severity !== "all") params.set("severity", query.severity);
  const qs = params.toString();
  return qs ? `${ROUTES.errorLog}?${qs}` : ROUTES.errorLog;
}

function actorLabel(row: ErrorLogRow): string {
  if (!row.actor) return "—";
  return row.actor.full_name?.trim() || row.actor.email || "—";
}

export function ErrorLogTable({
  rows,
  total,
  totalPages,
  query,
}: {
  rows: ErrorLogRow[];
  total: number;
  totalPages: number;
  query: ErrorLogQuery;
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

  function navigate(changes: Partial<{ search: string; severity: string }>) {
    const params = new URLSearchParams();
    const nextSearch = changes.search ?? query.search;
    const nextSeverity = changes.severity ?? query.severity;
    if (nextSearch) params.set("search", nextSearch);
    if (nextSeverity !== "all") params.set("severity", nextSeverity);
    startTransition(() => {
      router.push(
        params.toString()
          ? `${ROUTES.errorLog}?${params.toString()}`
          : ROUTES.errorLog,
      );
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = value.trim();
      if (next === query.search) return;
      navigate({ search: next });
    }, SEARCH_DEBOUNCE_MS);
  }

  const current = Math.min(query.page, Math.max(totalPages, 1));
  const from = total === 0 ? 0 : (current - 1) * ERROR_LOG_PAGE_SIZE + 1;
  const to = Math.min(current * ERROR_LOG_PAGE_SIZE, total);
  const hasFilters = query.search !== "" || query.severity !== "all";

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Label htmlFor="error-search" className="sr-only">
            Search errors
          </Label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="error-search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search source, message, code…"
            className="h-11 pl-9"
          />
          {isPending ? (
            <Spinner className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
          ) : null}
        </div>
        <div className="w-full sm:w-40">
          <Label htmlFor="error-severity" className="sr-only">
            Severity
          </Label>
          <Select
            value={query.severity}
            onValueChange={(value) => {
              if (value) navigate({ severity: value });
            }}
          >
            <SelectTrigger id="error-severity" className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasFilters ? (
          <Link
            href={ROUTES.errorLog}
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
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="pr-4">Actor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 whitespace-normal">
                      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <CircleAlertIcon className="size-5 text-muted-foreground" />
                      </span>
                      <p className="font-medium">No errors logged</p>
                      <p className="text-sm text-muted-foreground">
                        Unexpected action failures will appear here for review.
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
                    <TableCell>
                      <Badge
                        variant={
                          row.severity === "error" ? "destructive" : "secondary"
                        }
                      >
                        {row.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[10rem] truncate font-mono text-xs sm:max-w-[16rem]">
                      {row.source}
                    </TableCell>
                    <TableCell className="max-w-[14rem] truncate sm:max-w-[24rem]">
                      {row.message}
                    </TableCell>
                    <TableCell className="max-w-[8rem] truncate pr-4 sm:max-w-[12rem]">
                      {actorLabel(row)}
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
