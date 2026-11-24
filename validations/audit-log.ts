import { z } from "zod";

import {
  ADMIN_LIST_PAGE_SIZE,
  firstSearchParam,
  parseAdminListQuery,
  type AdminPageSize,
  type RawSearchParams,
} from "@/validations/admin-list-query";

/**
 * Actor search: unlike the generic list search, `_` and `%` are allowed
 * (emails like `jane_doe@…`) and escaped for ILIKE by `escapeIlikeTerm`.
 * PostgREST-unsafe `, ( )` and the escape char `\` are still rejected.
 */
export const actorSearchSchema = z
  .string()
  .trim()
  .max(100, "Search must be 100 characters or fewer")
  .regex(/^[^,()\\]*$/, "Search contains unsupported characters")
  .catch("");

/** Escape ILIKE wildcards so `_` / `%` match literally. */
export function escapeIlikeTerm(term: string): string {
  return term.replace(/[%_]/g, (ch) => `\\${ch}`);
}

/** Default activity log page size (overridable via URL `limit`: 10 | 20 | 50). */
export const ACTIVITY_LOG_PAGE_SIZE = ADMIN_LIST_PAGE_SIZE;

/** Known action values offered in the filter (URL accepts any slug). */
export const ACTIVITY_ACTION_OPTIONS = [
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "invite",
  "role_change",
  "suspend",
  "reactivate",
  "export",
  "sign_in",
  "sign_in_failed",
  "sign_in_blocked",
  "sign_in_started",
  "sign_out",
  "password_update",
  "email_link_verified",
] as const;

/** Known entity types offered in the filter (URL accepts any slug). */
export const ACTIVITY_ENTITY_OPTIONS = [
  "auth",
  "blog",
  "inquiry",
  "user",
  "site_settings",
  "backup_export_setting",
] as const;

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z][a-z0-9_]{0,63}$/)
  .catch("");

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)))
  .catch("");

export type ActivityLogQuery = {
  page: number;
  search: string;
  pageSize: AdminPageSize;
  /** Exact action slug, or "" for all. */
  action: string;
  /** Exact entity type slug, or "" for all. */
  entity: string;
  /** Actor name/email fragment, or "" for all. */
  actor: string;
  /** Inclusive start date (YYYY-MM-DD, UTC), or "". */
  from: string;
  /** Inclusive end date (YYYY-MM-DD, UTC), or "". */
  to: string;
};

export function parseActivityLogQuery(
  input: RawSearchParams,
): ActivityLogQuery {
  const base = parseAdminListQuery(input, ADMIN_LIST_PAGE_SIZE);
  let from = dateSchema.parse(firstSearchParam(input.from) ?? "");
  let to = dateSchema.parse(firstSearchParam(input.to) ?? "");
  if (from && to && from > to) [from, to] = [to, from];

  return {
    ...base,
    action: slugSchema.parse(firstSearchParam(input.action) ?? ""),
    entity: slugSchema.parse(firstSearchParam(input.entity) ?? ""),
    actor: actorSearchSchema.parse(firstSearchParam(input.actor) ?? ""),
    from,
    to,
  };
}

export function hasActivityFilters(query: ActivityLogQuery): boolean {
  return Boolean(
    query.search ||
    query.action ||
    query.entity ||
    query.actor ||
    query.from ||
    query.to,
  );
}

/** URL params for the non-paging filters (shared by page redirect + table links). */
export function setActivityFilterParams(
  params: URLSearchParams,
  query: Pick<
    ActivityLogQuery,
    "search" | "action" | "entity" | "actor" | "from" | "to"
  >,
): void {
  for (const key of [
    "search",
    "action",
    "entity",
    "actor",
    "from",
    "to",
  ] as const) {
    if (query[key]) params.set(key, query[key]);
  }
}

/** Exclusive upper bound ISO timestamp for an inclusive `to` date. */
export function endOfDayExclusive(date: string): string {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
}
