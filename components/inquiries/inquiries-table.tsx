"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { format } from "date-fns";
import { InboxIcon } from "lucide-react";

import {
  AdminDataTable,
  AdminRowNumberCell,
} from "@/components/dashboard/admin-data-table";
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
import {
  AREA_OF_INTEREST_OPTIONS,
  INQUIRY_INTENTS,
  INQUIRY_STATUSES,
} from "@/constants/inquiries";
import { ROUTES } from "@/constants/routes";
import type { InquiryListItem } from "@/types/inquiry";
import {
  ADMIN_LIST_PAGE_SIZE,
  setAdminListPagingParams,
  type AdminPageSize,
} from "@/validations/admin-list-query";
import type { InquiryListQuery } from "@/validations/inquiries";

const STATUS_VARIANT = {
  new: "default",
  contacted: "secondary",
  qualified: "outline",
  closed: "ghost",
  spam: "destructive",
} as const;

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function inquiriesHref(
  query: InquiryListQuery,
  patch: Partial<{
    page: number;
    pageSize: AdminPageSize;
    search: string;
    status: string;
    intent: string;
  }> = {},
): string {
  const page = patch.page ?? query.page;
  const pageSize = patch.pageSize ?? query.pageSize;
  const search = patch.search ?? query.search;
  const status = patch.status ?? query.status;
  const intent = patch.intent ?? query.intent;
  const params = new URLSearchParams();
  setAdminListPagingParams(params, {
    page,
    pageSize,
    defaultPageSize: ADMIN_LIST_PAGE_SIZE,
  });
  if (search) params.set("search", search);
  if (status !== "all") params.set("status", status);
  if (intent !== "all") params.set("intent", intent);
  const qs = params.toString();
  return qs ? `${ROUTES.inquiries}?${qs}` : ROUTES.inquiries;
}

export function InquiriesTable({
  inquiries,
  total,
  totalPages,
  query,
}: {
  inquiries: InquiryListItem[];
  total: number;
  totalPages: number;
  query: InquiryListQuery;
}) {
  const router = useRouter();

  return (
    <AdminDataTable
      searchId="inquiry-search"
      searchLabel="Search inquiries"
      searchPlaceholder="Name, email or company"
      searchValue={query.search}
      onSearchCommit={(next) => {
        router.push(inquiriesHref(query, { search: next, page: 1 }));
      }}
      clearHref={ROUTES.inquiries}
      hasFilters={
        query.search !== "" || query.status !== "all" || query.intent !== "all"
      }
      filters={({ startTransition }) => (
        <>
          <div className="w-full sm:w-40">
            <Label htmlFor="inquiry-status" className="sr-only">
              Status
            </Label>
            <Select
              value={query.status}
              onValueChange={(value) => {
                if (!value) return;
                startTransition(() => {
                  router.push(inquiriesHref(query, { status: value, page: 1 }));
                });
              }}
            >
              <SelectTrigger
                id="inquiry-status"
                className="min-h-11 w-full sm:min-h-8"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {INQUIRY_STATUSES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
            <Label htmlFor="inquiry-intent" className="sr-only">
              Intent
            </Label>
            <Select
              value={query.intent}
              onValueChange={(value) => {
                if (!value) return;
                startTransition(() => {
                  router.push(inquiriesHref(query, { intent: value, page: 1 }));
                });
              }}
            >
              <SelectTrigger
                id="inquiry-intent"
                className="min-h-11 w-full sm:min-h-8"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All intents</SelectItem>
                {INQUIRY_INTENTS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      page={query.page}
      pageSize={query.pageSize}
      total={total}
      totalPages={totalPages}
      hrefForPage={(page) => inquiriesHref(query, { page })}
      hrefForPageSize={(pageSize) =>
        inquiriesHref(query, { pageSize, page: 1 })
      }
      columns={[
        { key: "name", header: "Name" },
        { key: "company", header: "Company" },
        { key: "intent", header: "Intent" },
        { key: "area", header: "Area" },
        { key: "status", header: "Status" },
        { key: "received", header: "Received" },
      ]}
      emptyIcon={InboxIcon}
      emptyTitle="No inquiries yet"
      emptyDescription="Submissions from the public contact form will show up here."
      isEmpty={inquiries.length === 0}
    >
      {inquiries.map((inquiry, index) => (
        <TableRow key={inquiry.id}>
          <AdminRowNumberCell
            page={query.page}
            pageSize={query.pageSize}
            index={index}
          />
          <TableCell className="max-w-[10rem] sm:max-w-[14rem]">
            <Link
              href={`${ROUTES.inquiries}/${inquiry.id}`}
              className="font-medium underline-offset-4 hover:underline"
            >
              <span className="block truncate">{inquiry.full_name}</span>
            </Link>
            <span className="block truncate text-sm text-muted-foreground">
              {inquiry.email}
            </span>
          </TableCell>
          <TableCell className="max-w-[10rem] truncate sm:max-w-[14rem]">
            {inquiry.company}
          </TableCell>
          <TableCell>{labelFor(INQUIRY_INTENTS, inquiry.intent)}</TableCell>
          <TableCell className="max-w-[12rem] truncate">
            {labelFor(AREA_OF_INTEREST_OPTIONS, inquiry.area_of_interest)}
          </TableCell>
          <TableCell>
            <Badge variant={STATUS_VARIANT[inquiry.status]}>
              {labelFor(INQUIRY_STATUSES, inquiry.status)}
            </Badge>
          </TableCell>
          <TableCell className="whitespace-nowrap pr-4 text-muted-foreground">
            {format(new Date(inquiry.created_at), "MMM d, yyyy HH:mm")}
          </TableCell>
        </TableRow>
      ))}
    </AdminDataTable>
  );
}
