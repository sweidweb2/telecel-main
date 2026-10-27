import { z } from "zod";

/** Default page size for admin list UIs (activity, errors, etc.). */
export const ADMIN_LIST_PAGE_SIZE = 20;

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

/**
 * Parse common admin list query fields (`page`, `search`) plus fixed page size.
 * Domain schemas can extend with extra URL keys (e.g. severity).
 */
export function parseAdminListQuery(input: RawSearchParams): {
  page: number;
  search: string;
  pageSize: typeof ADMIN_LIST_PAGE_SIZE;
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
    pageSize: ADMIN_LIST_PAGE_SIZE,
  };
}
