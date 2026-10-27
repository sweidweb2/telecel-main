import { z } from "zod";

/** Fixed page size — not configurable via URL or UI. */
export const ACTIVITY_LOG_PAGE_SIZE = 20;

const activityLogQueryInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  search: z
    .string()
    .trim()
    .max(100, "Search must be 100 characters or fewer")
    .regex(/^[^,%_()]*$/, "Search contains unsupported characters")
    .catch(""),
});

export type ActivityLogQuery = z.infer<typeof activityLogQueryInputSchema> & {
  pageSize: typeof ACTIVITY_LOG_PAGE_SIZE;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseActivityLogQuery(input: RawSearchParams): ActivityLogQuery {
  const parsed = activityLogQueryInputSchema.parse({
    page: first(input.page) ?? "1",
    search: first(input.search) ?? "",
  });

  return {
    ...parsed,
    pageSize: ACTIVITY_LOG_PAGE_SIZE,
  };
}
