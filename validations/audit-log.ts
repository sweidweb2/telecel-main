import {
  ADMIN_LIST_PAGE_SIZE,
  parseAdminListQuery,
  type AdminPageSize,
  type RawSearchParams,
} from "@/validations/admin-list-query";

/** Default activity log page size (overridable via URL `limit`: 10 | 20 | 50). */
export const ACTIVITY_LOG_PAGE_SIZE = ADMIN_LIST_PAGE_SIZE;

export type ActivityLogQuery = {
  page: number;
  search: string;
  pageSize: AdminPageSize;
};

export function parseActivityLogQuery(input: RawSearchParams): ActivityLogQuery {
  return parseAdminListQuery(input, ADMIN_LIST_PAGE_SIZE);
}
