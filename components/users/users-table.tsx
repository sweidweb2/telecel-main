"use client";

import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { UserRoundSearchIcon } from "lucide-react";

import { UserRowActions } from "@/components/users/user-dialogs";
import { UsersFilters } from "@/components/users/users-filters";
import { UsersPagination } from "@/components/users/users-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Profile } from "@/types/profile";
import type { UserListQuery } from "@/validations/users";

const ROLE_VARIANT = {
  admin: "default",
  editor: "secondary",
} as const;

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
  const [clientSearch, setClientSearch] = useState(query.search);
  const [prevQuerySearch, setPrevQuerySearch] = useState(query.search);

  // Keep instant client filter aligned when URL search changes (back/forward, clear).
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
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <UsersFilters query={query} onSearchChange={onSearchChange} />

      <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Full name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-28 pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 whitespace-normal">
                      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <UserRoundSearchIcon className="size-5 text-muted-foreground" />
                      </span>
                      <p className="font-medium">No users found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing the search or role filter, or create a new
                        user.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visibleUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="max-w-[10rem] truncate pl-4 font-medium sm:max-w-[14rem]">
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
                    <TableCell className="pr-4">
                      <UserRowActions user={user} isCurrentUser={user.id === currentUserId} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </CardContent>

      <CardFooter className="border-t bg-transparent px-4 py-3">
        <UsersPagination
          query={query}
          total={total}
          totalPages={totalPages}
        />
      </CardFooter>
    </Card>
  );
}
