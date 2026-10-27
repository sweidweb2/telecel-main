import { z } from "zod";

import {
  ADMIN_LIST_PAGE_SIZE,
  firstSearchParam,
  parseAdminListQuery,
  type AdminPageSize,
  type RawSearchParams,
} from "@/validations/admin-list-query";

/** Default error log page size (overridable via URL `limit`: 10 | 20 | 50). */
export const ERROR_LOG_PAGE_SIZE = ADMIN_LIST_PAGE_SIZE;

const severitySchema = z.enum(["all", "warning", "error"]).catch("all");

export type ErrorLogQuery = {
  page: number;
  search: string;
  severity: z.infer<typeof severitySchema>;
  pageSize: AdminPageSize;
};

export function parseErrorLogQuery(input: RawSearchParams): ErrorLogQuery {
  const base = parseAdminListQuery(input, ADMIN_LIST_PAGE_SIZE);
  const severity = severitySchema.parse(
    firstSearchParam(input.severity) ?? "all",
  );

  return {
    ...base,
    severity,
  };
}
