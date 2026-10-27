import { ListPagination } from "@/components/dashboard/list-pagination";
import { ROUTES } from "@/constants/routes";
import { USER_PAGE_SIZE, type UserListQuery } from "@/validations/users";

function pageHref(query: UserListQuery, page: number): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.search) params.set("search", query.search);
  if (query.role !== "all") params.set("role", query.role);
  const qs = params.toString();
  return qs ? `${ROUTES.users}?${qs}` : ROUTES.users;
}

export function UsersPagination({
  query,
  total,
  totalPages,
}: {
  query: UserListQuery;
  total: number;
  totalPages: number;
}) {
  return (
    <ListPagination
      hrefForPage={(page) => pageHref(query, page)}
      page={query.page}
      pageSize={USER_PAGE_SIZE}
      total={total}
      totalPages={totalPages}
    />
  );
}
