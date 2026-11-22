"use client";

import { useRouter } from "nextjs-toploader/app";
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
import { Input } from "@/components/ui/input";
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
import { formatDateTime } from "@/lib/format";
import type { ActivityLogRow } from "@/types/observability";
import {
  ADMIN_LIST_PAGE_SIZE,
  setAdminListPagingParams,
  type AdminPageSize,
} from "@/validations/admin-list-query";
import {
  ACTIVITY_ACTION_OPTIONS,
  ACTIVITY_ENTITY_OPTIONS,
  hasActivityFilters,
  setActivityFilterParams,
  type ActivityLogQuery,
} from "@/validations/audit-log";

type ActivityPatch = Partial<
  Pick<
    ActivityLogQuery,
    | "page"
    | "pageSize"
    | "search"
    | "action"
    | "entity"
    | "actor"
    | "from"
    | "to"
  >
>;

const ALL = "all";

function humanize(slug: string): string {
  const text = slug.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function optionItems(label: string, options: readonly string[]) {
  return Object.fromEntries([
    [ALL, label],
    ...options.map((option) => [option, humanize(option)]),
  ]) as Record<string, string>;
}

const ACTION_ITEMS = optionItems("All actions", ACTIVITY_ACTION_OPTIONS);
const ENTITY_ITEMS = optionItems("All entities", ACTIVITY_ENTITY_OPTIONS);

function activityHref(
  query: ActivityLogQuery,
  patch: ActivityPatch = {},
): string {
  const next = { ...query, ...patch };
  const params = new URLSearchParams();
  setAdminListPagingParams(params, {
    page: next.page,
    pageSize: next.pageSize as AdminPageSize,
    defaultPageSize: ADMIN_LIST_PAGE_SIZE,
  });
  setActivityFilterParams(params, next);
  const qs = params.toString();
  return qs ? `${ROUTES.activityLog}?${qs}` : ROUTES.activityLog;
}

export function ActivityLogTable({
  rows,
  total,
  totalPages,
  actorsCapped = false,
  query,
}: {
  rows: ActivityLogRow[];
  total: number;
  totalPages: number;
  actorsCapped?: boolean;
  query: ActivityLogQuery;
}) {
  const router = useRouter();

  return (
    <>
      {actorsCapped ? (
        <p role="status" className="text-muted-foreground mb-2 text-sm">
          Too many matching actors — refine the filter.
        </p>
      ) : null}
      <AdminDataTable
        searchId="activity-search"
        searchLabel="Search activity"
        searchPlaceholder="Search action, entity, id…"
        searchValue={query.search}
        onSearchCommit={(next) => {
          router.push(activityHref(query, { search: next, page: 1 }));
        }}
        clearHref={ROUTES.activityLog}
        hasFilters={hasActivityFilters(query)}
        filters={({ startTransition }) => {
          const go = (patch: ActivityPatch) =>
            startTransition(() => {
              router.push(activityHref(query, { ...patch, page: 1 }));
            });
          return (
            <>
              <div className="w-full sm:w-44">
                <Label htmlFor="activity-action" className="sr-only">
                  Action
                </Label>
                <Select
                  items={ACTION_ITEMS}
                  value={query.action || ALL}
                  onValueChange={(value) => {
                    if (!value) return;
                    go({ action: value === ALL ? "" : value });
                  }}
                >
                  <SelectTrigger
                    id="activity-action"
                    className="min-h-11 w-full sm:min-h-8"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_ITEMS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-44">
                <Label htmlFor="activity-entity" className="sr-only">
                  Entity
                </Label>
                <Select
                  items={ENTITY_ITEMS}
                  value={query.entity || ALL}
                  onValueChange={(value) => {
                    if (!value) return;
                    go({ entity: value === ALL ? "" : value });
                  }}
                >
                  <SelectTrigger
                    id="activity-entity"
                    className="min-h-11 w-full sm:min-h-8"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ENTITY_ITEMS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-44">
                <Label htmlFor="activity-actor" className="sr-only">
                  Actor
                </Label>
                <Input
                  key={`actor-${query.actor}`}
                  id="activity-actor"
                  placeholder="Actor name or email"
                  defaultValue={query.actor}
                  maxLength={100}
                  className="min-h-11 sm:min-h-8"
                  onBlur={(event) => {
                    const value = event.currentTarget.value.trim();
                    if (value !== query.actor) go({ actor: value });
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      const value = event.currentTarget.value.trim();
                      if (value !== query.actor) go({ actor: value });
                    }
                  }}
                />
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Label htmlFor="activity-from" className="sr-only">
                  From date
                </Label>
                <Input
                  id="activity-from"
                  type="date"
                  value={query.from}
                  max={query.to || undefined}
                  className="min-h-11 sm:min-h-8 sm:w-36"
                  onChange={(event) => go({ from: event.currentTarget.value })}
                />
                <span aria-hidden className="text-muted-foreground">
                  –
                </span>
                <Label htmlFor="activity-to" className="sr-only">
                  To date
                </Label>
                <Input
                  id="activity-to"
                  type="date"
                  value={query.to}
                  min={query.from || undefined}
                  className="min-h-11 sm:min-h-8 sm:w-36"
                  onChange={(event) => go({ to: event.currentTarget.value })}
                />
              </div>
            </>
          );
        }}
        page={query.page}
        pageSize={query.pageSize}
        total={total}
        totalPages={totalPages}
        hrefForPage={(page) => activityHref(query, { page })}
        hrefForPageSize={(pageSize) =>
          activityHref(query, { pageSize, page: 1 })
        }
        columns={[
          { key: "when", header: "When" },
          { key: "actor", header: "Actor" },
          { key: "action", header: "Action" },
          { key: "entity", header: "Entity" },
          { key: "id", header: "Id" },
          { key: "view", header: "", className: "w-24 text-right" },
        ]}
        emptyIcon={ClipboardListIcon}
        emptyTitle={
          hasActivityFilters(query) ? "No matching activity" : "No activity yet"
        }
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
              {formatDateTime(row.created_at)}
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
                    value: formatDateTime(
                      row.created_at,
                      "dd MMM yyyy HH:mm:ss",
                    ),
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
    </>
  );
}
