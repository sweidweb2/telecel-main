import { z } from "zod";

/** Fixed page size — not configurable via URL or UI. */
export const ERROR_LOG_PAGE_SIZE = 20;

const errorLogQueryInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  search: z
    .string()
    .trim()
    .max(100, "Search must be 100 characters or fewer")
    .regex(/^[^,%_()]*$/, "Search contains unsupported characters")
    .catch(""),
  severity: z.enum(["all", "warning", "error"]).catch("all"),
});

export type ErrorLogQuery = z.infer<typeof errorLogQueryInputSchema> & {
  pageSize: typeof ERROR_LOG_PAGE_SIZE;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseErrorLogQuery(input: RawSearchParams): ErrorLogQuery {
  const parsed = errorLogQueryInputSchema.parse({
    page: first(input.page) ?? "1",
    search: first(input.search) ?? "",
    severity: first(input.severity) ?? "all",
  });

  return {
    ...parsed,
    pageSize: ERROR_LOG_PAGE_SIZE,
  };
}
