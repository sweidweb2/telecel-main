"use client";

import { useRouter } from "nextjs-toploader/app";
import { format } from "date-fns";
import { CircleAlertIcon } from "lucide-react";

import {
  AdminDataTable,
  AdminRowNumberCell,
  actorLabel,
} from "@/components/dashboard/admin-data-table";
import {
  formatDetailJson,
  RecordDetailDialog,
} from "@/components/dashboard/record-detail-dialog";
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
  ADMIN_LIST_PAGE_SIZE,
  setAdminListPagingParams,
  type AdminPageSize,
} from "@/validations/admin-list-query";
import type { ErrorLogQuery } from "@/validations/app-errors";

function errorHref(
  query: ErrorLogQuery,
  patch: Partial<{
    page: number;
    pageSize: AdminPageSize;
    search: string;
    severity: string;
  }> = {},
): string {
  const page = patch.page ?? query.page;
  const pageSize = patch.pageSize ?? query.pageSize;
  const search = patch.search ?? query.search;
  const severity = patch.severity ?? query.severity;
  const params = new URLSearchParams();
  setAdminListPagingParams(params, {
    page,
    pageSize,
    defaultPageSize: ADMIN_LIST_PAGE_SIZE,
  });
  if (search) params.set("search", search);
  if (severity !== "all") params.set("severity", severity);
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

  return (
    <AdminDataTable
      searchId="error-search"
      searchLabel="Search errors"
      searchPlaceholder="Search source, message, code…"
      searchValue={query.search}
      onSearchCommit={(next) => {
        router.push(errorHref(query, { search: next, page: 1 }));
      }}
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
              if (!value) return;
              startTransition(() => {
                router.push(errorHref(query, { severity: value, page: 1 }));
              });
            }}
          >
            <SelectTrigger
              id="error-severity"
              className="min-h-11 w-full sm:min-h-8"
            >
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
      pageSize={query.pageSize}
      total={total}
      totalPages={totalPages}
      hrefForPage={(page) => errorHref(query, { page })}
      hrefForPageSize={(pageSize) => errorHref(query, { pageSize, page: 1 })}
      columns={[
        { key: "when", header: "When" },
        { key: "severity", header: "Severity" },
        { key: "source", header: "Source" },
        { key: "message", header: "Message" },
        { key: "actor", header: "Actor" },
        { key: "view", header: "", className: "w-24 text-right" },
      ]}
      emptyIcon={CircleAlertIcon}
      emptyTitle="No errors logged"
      emptyDescription="Unexpected action failures will appear here for review."
      isEmpty={rows.length === 0}
    >
      {rows.map((row, index) => (
        <TableRow key={row.id}>
          <AdminRowNumberCell
            page={query.page}
            pageSize={query.pageSize}
            index={index}
          />
          <TableCell className="whitespace-nowrap text-muted-foreground">
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
          <TableCell className="max-w-[8rem] truncate sm:max-w-[12rem]">
            {actorLabel(row.actor)}
          </TableCell>
          <TableCell className="pr-4 text-right">
            <RecordDetailDialog
              title="Error details"
              description={`Record #${row.id}`}
              fields={[
                {
                  label: "When",
                  value: format(new Date(row.created_at), "dd MMM yyyy HH:mm:ss"),
                },
                { label: "Severity", value: row.severity },
                { label: "Source", value: row.source },
                { label: "Message", value: row.message },
                { label: "Code", value: row.code ?? "—" },
                { label: "Request id", value: row.request_id ?? "—" },
                { label: "Actor", value: actorLabel(row.actor) },
                {
                  label: "Context",
                  value: (
                    <pre className="overflow-x-auto rounded-lg bg-muted/60 p-3 font-mono text-xs">
                      {formatDetailJson(row.context)}
                    </pre>
                  ),
                },
              ]}
            />
          </TableCell>
        </TableRow>
      ))}
    </AdminDataTable>
  );
}
