import { z } from "zod";

import {
  ADMIN_LIST_PAGE_SIZE,
  firstSearchParam,
  parseAdminListQuery,
  type RawSearchParams,
} from "@/validations/admin-list-query";

/** Fixed page size — not configurable via URL or UI. */
export const ERROR_LOG_PAGE_SIZE = ADMIN_LIST_PAGE_SIZE;

const severitySchema = z.enum(["all", "warning", "error"]).catch("all");

export type ErrorLogQuery = {
  page: number;
  search: string;
  severity: z.infer<typeof severitySchema>;
  pageSize: typeof ERROR_LOG_PAGE_SIZE;
};

export function parseErrorLogQuery(input: RawSearchParams): ErrorLogQuery {
  const base = parseAdminListQuery(input);
  const severity = severitySchema.parse(
    firstSearchParam(input.severity) ?? "all",
  );

  return {
    ...base,
    severity,
  };
}
