"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { format } from "date-fns";
import { UserRoundSearchIcon } from "lucide-react";

import {
  AdminDataTable,
  AdminRowNumberCell,
} from "@/components/dashboard/admin-data-table";
import { UserRowActions } from "@/components/users/user-dialogs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { Profile } from "@/types/profile";
import {
  setAdminListPagingParams,
  USER_LIST_PAGE_SIZE,
  type AdminPageSize,
} from "@/validations/admin-list-query";
import type { UserListQuery } from "@/validations/users";

const ROLE_VARIANT = {
  admin: "default",
  editor: "secondary",
} as const;

function usersHref(
  query: UserListQuery,
  patch: Partial<{
    page: number;
    pageSize: AdminPageSize;
    search: string;
    role: string;
  }> = {},
): string {
  const page = patch.page ?? query.page;
  const pageSize = patch.pageSize ?? query.pageSize;
  const search = patch.search ?? query.search;
  const role = patch.role ?? query.role;
  const params = new URLSearchParams();
  setAdminListPagingParams(params, {
    page,
    pageSize,
    defaultPageSize: USER_LIST_PAGE_SIZE,
  });
  if (search) params.set("search", search);
  if (role !== "all") params.set("role", role);
  const qs = params.toString();
  return qs ? `${ROUTES.users}?${qs}` : ROUTES.users;
}

export function UsersTable({
  users,
  total,
  totalPages,
  query,
  currentUserId,
}: {
  users: Profile[];
  total: number;
  totalPages: number;
  query: UserListQuery;
  currentUserId: string;
}) {
  const router = useRouter();
  const [clientSearch, setClientSearch] = useState(query.search);
  const [prevQuerySearch, setPrevQuerySearch] = useState(query.search);

  if (query.search !== prevQuerySearch) {
    setPrevQuerySearch(query.search);
    setClientSearch(query.search);
  }

  const onSearchChange = useCallback((value: string) => {
    setClientSearch(value);
  }, []);

  const visibleUsers = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    if (!term || term === query.search.toLowerCase()) return users;
    return users.filter((user) => {
      const name = (user.full_name ?? "").toLowerCase();
      return name.includes(term) || user.email.toLowerCase().includes(term);
    });
  }, [clientSearch, query.search, users]);

  return (
    <AdminDataTable
      searchId="users-search"
      searchLabel="Search users"
      searchPlaceholder="Filter by name or email…"
      searchValue={query.search}
      onSearchCommit={(next) => {
        router.push(usersHref(query, { search: next, page: 1 }));
      }}
      onSearchChange={onSearchChange}
      clearHref={ROUTES.users}
      hasFilters={query.search !== "" || query.role !== "all"}
      filters={({ startTransition }) => (
        <div className="w-full sm:w-36">
          <Label htmlFor="users-role" className="sr-only">
            Role
          </Label>
          <Select
            value={query.role}
            onValueChange={(value) => {
              if (!value) return;
              startTransition(() => {
                router.push(usersHref(query, { role: value, page: 1 }));
              });
            }}
          >
            <SelectTrigger
              id="users-role"
              className="min-h-11 w-full sm:min-h-8"
            >
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      page={query.page}
      pageSize={query.pageSize}
      total={total}
      totalPages={totalPages}
      hrefForPage={(page) => usersHref(query, { page })}
      hrefForPageSize={(pageSize) => usersHref(query, { pageSize, page: 1 })}
      columns={[
        { key: "name", header: "Full name" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        { key: "created", header: "Created" },
        { key: "updated", header: "Updated" },
        { key: "actions", header: "Actions", className: "w-28 text-right" },
      ]}
      emptyIcon={UserRoundSearchIcon}
      emptyTitle="No users found"
      emptyDescription="Try changing the search or role filter, or create a new user."
      isEmpty={visibleUsers.length === 0}
    >
      {visibleUsers.map((user, index) => (
        <TableRow key={user.id}>
          <AdminRowNumberCell
            page={query.page}
            pageSize={query.pageSize}
            index={index}
          />
          <TableCell className="max-w-[10rem] truncate font-medium sm:max-w-[14rem]">
            {user.full_name || "—"}
          </TableCell>
          <TableCell className="max-w-[11rem] truncate sm:max-w-[16rem]">
            {user.email}
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-1">
              <Badge variant={user.role ? ROLE_VARIANT[user.role] : "outline"}>
                {user.role ?? "no access"}
              </Badge>
              {user.is_active ? null : (
                <Badge variant="destructive">suspended</Badge>
              )}
            </div>
          </TableCell>
          <TableCell className="whitespace-nowrap text-muted-foreground">
            {format(new Date(user.created_at), "MMM d, yyyy")}
          </TableCell>
          <TableCell className="whitespace-nowrap text-muted-foreground">
            {format(new Date(user.updated_at), "MMM d, yyyy")}
          </TableCell>
          <TableCell className="pr-4 text-right">
            <UserRowActions
              user={user}
              isCurrentUser={user.id === currentUserId}
            />
          </TableCell>
        </TableRow>
      ))}
    </AdminDataTable>
  );
}
