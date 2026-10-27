"use client";

import { useRouter } from "nextjs-toploader/app";
import { format } from "date-fns";
import { CircleAlertIcon } from "lucide-react";

import {
  AdminLogTable,
  actorLabel,
} from "@/components/dashboard/admin-log-table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { ErrorLogRow } from "@/types/observability";
import {
  ERROR_LOG_PAGE_SIZE,
  type ErrorLogQuery,
} from "@/validations/app-errors";

function pageHref(query: ErrorLogQuery, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  if (query.severity !== "all") params.set("severity", query.severity);
  const qs = params.toString();
  return qs ? `${ROUTES.errorLog}?${qs}` : ROUTES.errorLog;
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

  function navigate(changes: Partial<{ search: string; severity: string }>) {
    const params = new URLSearchParams();
    const nextSearch = changes.search ?? query.search;
    const nextSeverity = changes.severity ?? query.severity;
    if (nextSearch) params.set("search", nextSearch);
    if (nextSeverity !== "all") params.set("severity", nextSeverity);
    router.push(
      params.toString()
        ? `${ROUTES.errorLog}?${params.toString()}`
        : ROUTES.errorLog,
    );
  }

  return (
    <AdminLogTable
      searchId="error-search"
      searchLabel="Search errors"
      searchPlaceholder="Search source, message, code…"
      searchValue={query.search}
      onSearchCommit={(next) => navigate({ search: next })}
      clearHref={ROUTES.errorLog}
      hasFilters={query.search !== "" || query.severity !== "all"}
      filters={({ startTransition }) => (
        <div className="w-full sm:w-40">
          <Label htmlFor="error-severity" className="sr-only">
            Severity
          </Label>
          <Select
            value={query.severity}
            onValueChange={(value) => {
              if (value) {
                startTransition(() => {
                  navigate({ severity: value });
                });
              }
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
      )}
      page={query.page}
      pageSize={ERROR_LOG_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
      hrefForPage={(page) => pageHref(query, page)}
      columns={[
        { key: "when", header: "When" },
        { key: "severity", header: "Severity" },
        { key: "source", header: "Source" },
        { key: "message", header: "Message" },
        { key: "actor", header: "Actor" },
      ]}
      emptyIcon={CircleAlertIcon}
      emptyTitle="No errors logged"
      emptyDescription="Unexpected action failures will appear here for review."
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell className="whitespace-nowrap pl-4 text-muted-foreground">
            {format(new Date(row.created_at), "dd MMM yyyy HH:mm")}
          </TableCell>
          <TableCell>
            <Badge
              variant={row.severity === "error" ? "destructive" : "secondary"}
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
            {actorLabel(row.actor)}
          </TableCell>
        </TableRow>
      ))}
    </AdminLogTable>
  );
}
