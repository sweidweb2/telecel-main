"use client";

import { useRouter } from "nextjs-toploader/app";
import { format } from "date-fns";
import { ClipboardListIcon } from "lucide-react";

import {
  AdminDataTable,
  AdminRowNumberCell,
  actorLabel,
} from "@/components/dashboard/admin-data-table";
import {
  formatDetailJson,
  RecordDetailDialog,
} from "@/components/dashboard/record-detail-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { ActivityLogRow } from "@/types/observability";
import {
  ADMIN_LIST_PAGE_SIZE,
  setAdminListPagingParams,
  type AdminPageSize,
} from "@/validations/admin-list-query";
import type { ActivityLogQuery } from "@/validations/audit-log";

function activityHref(
  query: ActivityLogQuery,
  patch: Partial<{ page: number; pageSize: AdminPageSize; search: string }> = {},
): string {
  const page = patch.page ?? query.page;
  const pageSize = patch.pageSize ?? query.pageSize;
  const search = patch.search ?? query.search;
  const params = new URLSearchParams();
  setAdminListPagingParams(params, {
    page,
    pageSize,
    defaultPageSize: ADMIN_LIST_PAGE_SIZE,
  });
  if (search) params.set("search", search);
  const qs = params.toString();
  return qs ? `${ROUTES.activityLog}?${qs}` : ROUTES.activityLog;
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

  return (
    <AdminDataTable
      searchId="activity-search"
      searchLabel="Search activity"
      searchPlaceholder="Search action, entity, id…"
      searchValue={query.search}
      onSearchCommit={(next) => {
        router.push(activityHref(query, { search: next, page: 1 }));
      }}
      clearHref={ROUTES.activityLog}
      hasFilters={query.search !== ""}
      page={query.page}
      pageSize={query.pageSize}
      total={total}
      totalPages={totalPages}
      hrefForPage={(page) => activityHref(query, { page })}
      hrefForPageSize={(pageSize) => activityHref(query, { pageSize, page: 1 })}
      columns={[
        { key: "when", header: "When" },
        { key: "actor", header: "Actor" },
        { key: "action", header: "Action" },
        { key: "entity", header: "Entity" },
        { key: "id", header: "Id" },
        { key: "view", header: "", className: "w-24 text-right" },
      ]}
      emptyIcon={ClipboardListIcon}
      emptyTitle="No activity yet"
      emptyDescription="Successful CMS and user mutations will appear here."
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
          <TableCell className="max-w-[10rem] truncate sm:max-w-[14rem]">
            {actorLabel(row.actor)}
          </TableCell>
          <TableCell className="font-medium">{row.action}</TableCell>
          <TableCell>{row.entity_type}</TableCell>
          <TableCell className="max-w-[8rem] truncate font-mono text-xs text-muted-foreground sm:max-w-[12rem]">
            {row.entity_id ?? "—"}
          </TableCell>
          <TableCell className="pr-4 text-right">
            <RecordDetailDialog
              title="Activity details"
              description={`Record #${row.id}`}
              fields={[
                {
                  label: "When",
                  value: format(new Date(row.created_at), "dd MMM yyyy HH:mm:ss"),
                },
                { label: "Actor", value: actorLabel(row.actor) },
                { label: "Action", value: row.action },
                { label: "Entity type", value: row.entity_type },
                { label: "Entity id", value: row.entity_id ?? "—" },
                {
                  label: "Summary",
                  value: (
                    <pre className="overflow-x-auto rounded-lg bg-muted/60 p-3 font-mono text-xs">
                      {formatDetailJson(row.summary)}
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
