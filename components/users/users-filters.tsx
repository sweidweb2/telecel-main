"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { UserListQuery } from "@/validations/users";

const SEARCH_DEBOUNCE_MS = 600;

type UsersFiltersProps = {
  query: UserListQuery;
  /** Instant client-side filter (does not hit the server). */
  onSearchChange?: (value: string) => void;
};

export function UsersFilters({ query, onSearchChange }: UsersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  const [prevQuerySearch, setPrevQuerySearch] = useState(query.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFilters = query.search !== "" || query.role !== "all";

  // Sync local input when the URL search param changes (e.g. back/forward).
  if (query.search !== prevQuerySearch) {
    setPrevQuerySearch(query.search);
    setSearch(query.search);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigate(changes: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (!value || (key === "role" && value === "all")) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    next.set("page", "1");

    startTransition(() => {
      router.push(`${ROUTES.users}?${next.toString()}`);
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    onSearchChange?.(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const nextSearch = value.trim();
      if (nextSearch === query.search) return;
      navigate({ search: nextSearch });
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Label htmlFor="users-search" className="sr-only">
          Search users
        </Label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="users-search"
          type="search"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Filter by name or email…"
          maxLength={100}
          autoComplete="off"
          className="min-h-11 pl-8 sm:min-h-8"
        />
        {isPending ? (
          <Loader2Icon className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="users-role" className="sr-only">
          Role
        </Label>
        <Select
          value={query.role}
          onValueChange={(value) => {
            if (value) navigate({ role: value });
          }}
          disabled={isPending}
        >
          <SelectTrigger
            id="users-role"
            className="min-h-11 w-full sm:min-h-8 sm:w-36"
          >
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters || search ? (
          <Link
            href={ROUTES.users}
            aria-disabled={isPending}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "min-h-11 shrink-0 sm:min-h-8",
              isPending && "pointer-events-none opacity-50",
            )}
            onClick={() => {
              setSearch("");
              onSearchChange?.("");
            }}
          >
            <XIcon />
            Clear
          </Link>
        ) : null}
      </div>
    </div>
  );
}
