import { z } from "zod";

/** Allowed page sizes for admin list tables (URL `limit`). */
export const ADMIN_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export type AdminPageSize = (typeof ADMIN_PAGE_SIZE_OPTIONS)[number];

/** Default page size for activity / errors / inquiries. */
export const ADMIN_LIST_PAGE_SIZE: AdminPageSize = 20;

/** Default page size for the users table. */
export const USER_LIST_PAGE_SIZE: AdminPageSize = 10;

/** Coerced page with safe fallback — not configurable beyond URL. */
export const adminPageSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(10_000)
  .catch(1);

/**
 * Search string safe for PostgREST `.or()` filters.
 * Rejects `, % _ ( )` which break or widen filter expressions.
 */
export const sanitizedSearchSchema = z
  .string()
  .trim()
  .max(100, "Search must be 100 characters or fewer")
  .regex(/^[^,%_()]*$/, "Search contains unsupported characters")
  .catch("");

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseAdminPageSize(
  raw: string | undefined,
  fallback: AdminPageSize = ADMIN_LIST_PAGE_SIZE,
): AdminPageSize {
  const n = Number(raw);
  if ((ADMIN_PAGE_SIZE_OPTIONS as readonly number[]).includes(n)) {
    return n as AdminPageSize;
  }
  return fallback;
}

/**
 * Parse common admin list query fields (`page`, `search`, `limit`) plus page size.
 * Domain schemas can extend with extra URL keys (e.g. severity).
 */
export function parseAdminListQuery(
  input: RawSearchParams,
  defaultPageSize: AdminPageSize = ADMIN_LIST_PAGE_SIZE,
): {
  page: number;
  search: string;
  pageSize: AdminPageSize;
} {
  const parsed = z
    .object({
      page: adminPageSchema,
      search: sanitizedSearchSchema,
    })
    .parse({
      page: firstSearchParam(input.page) ?? "1",
      search: firstSearchParam(input.search) ?? "",
    });

  return {
    ...parsed,
    pageSize: parseAdminPageSize(
      firstSearchParam(input.limit),
      defaultPageSize,
    ),
  };
}

/** Append `page` / `limit` to a URLSearchParams when they differ from defaults. */
export function setAdminListPagingParams(
  params: URLSearchParams,
  {
    page,
    pageSize,
    defaultPageSize,
  }: {
    page: number;
    pageSize: number;
    defaultPageSize: AdminPageSize;
  },
) {
  if (page > 1) params.set("page", String(page));
  if (pageSize !== defaultPageSize) params.set("limit", String(pageSize));
}
