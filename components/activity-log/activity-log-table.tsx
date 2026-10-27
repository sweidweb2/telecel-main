"use client";

import { useRouter } from "nextjs-toploader/app";
import { format } from "date-fns";
import { ClipboardListIcon } from "lucide-react";

import {
  AdminLogTable,
  actorLabel,
} from "@/components/dashboard/admin-log-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { ActivityLogRow } from "@/types/observability";
import {
  ACTIVITY_LOG_PAGE_SIZE,
  type ActivityLogQuery,
} from "@/validations/audit-log";

function pageHref(query: ActivityLogQuery, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.search) params.set("search", query.search);
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
    <AdminLogTable
      searchId="activity-search"
      searchLabel="Search activity"
      searchPlaceholder="Search action, entity, id…"
      searchValue={query.search}
      onSearchCommit={(next) => {
        const params = new URLSearchParams();
        if (next) params.set("search", next);
        router.push(
          params.toString()
            ? `${ROUTES.activityLog}?${params.toString()}`
            : ROUTES.activityLog,
        );
      }}
      clearHref={ROUTES.activityLog}
      hasFilters={query.search !== ""}
      page={query.page}
      pageSize={ACTIVITY_LOG_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
      hrefForPage={(page) => pageHref(query, page)}
      columns={[
        { key: "when", header: "When" },
        { key: "actor", header: "Actor" },
        { key: "action", header: "Action" },
        { key: "entity", header: "Entity" },
        { key: "id", header: "Id" },
      ]}
      emptyIcon={ClipboardListIcon}
      emptyTitle="No activity yet"
      emptyDescription="Successful CMS and user mutations will appear here."
      isEmpty={rows.length === 0}
    >
      {rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell className="whitespace-nowrap pl-4 text-muted-foreground">
            {format(new Date(row.created_at), "dd MMM yyyy HH:mm")}
          </TableCell>
          <TableCell className="max-w-[10rem] truncate sm:max-w-[14rem]">
            {actorLabel(row.actor)}
          </TableCell>
          <TableCell className="font-medium">{row.action}</TableCell>
          <TableCell>{row.entity_type}</TableCell>
          <TableCell className="max-w-[8rem] truncate pr-4 font-mono text-xs text-muted-foreground sm:max-w-[12rem]">
            {row.entity_id ?? "—"}
          </TableCell>
        </TableRow>
      ))}
    </AdminLogTable>
  );
}
