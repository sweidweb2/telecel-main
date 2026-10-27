import {
  ADMIN_LIST_PAGE_SIZE,
  parseAdminListQuery,
  type RawSearchParams,
} from "@/validations/admin-list-query";

/** Fixed page size — not configurable via URL or UI. */
export const ACTIVITY_LOG_PAGE_SIZE = ADMIN_LIST_PAGE_SIZE;

export type ActivityLogQuery = {
  page: number;
  search: string;
  pageSize: typeof ACTIVITY_LOG_PAGE_SIZE;
};

export function parseActivityLogQuery(input: RawSearchParams): ActivityLogQuery {
  return parseAdminListQuery(input);
}
