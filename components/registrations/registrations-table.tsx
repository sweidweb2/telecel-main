"use client";

import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { ClipboardListIcon } from "lucide-react";

import { RegistrationRowActions } from "@/components/registrations/registration-dialogs";
import { RegistrationsFilters } from "@/components/registrations/registrations-filters";
import { RegistrationsPagination } from "@/components/registrations/registrations-pagination";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InterestRegistration } from "@/types/interest-registration";
import type { InterestRegistrationListQuery } from "@/validations/interest-registration";

export function RegistrationsTable({
  registrations,
  total,
  totalPages,
  query,
}: {
  registrations: InterestRegistration[];
  total: number;
  totalPages: number;
  query: InterestRegistrationListQuery;
}) {
  const [clientSearch, setClientSearch] = useState(query.search);
  const [prevQuerySearch, setPrevQuerySearch] = useState(query.search);

  if (query.search !== prevQuerySearch) {
    setPrevQuerySearch(query.search);
    setClientSearch(query.search);
  }

  const onSearchChange = useCallback((value: string) => {
    setClientSearch(value);
  }, []);

  const visibleRegistrations = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    if (!term || term === query.search.toLowerCase()) return registrations;
    return registrations.filter((row) => {
      return (
        row.full_name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.company_name.toLowerCase().includes(term)
      );
    });
  }, [clientSearch, query.search, registrations]);

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <RegistrationsFilters query={query} onSearchChange={onSearchChange} />

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-28 pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 whitespace-normal">
                      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <ClipboardListIcon className="size-5 text-muted-foreground" />
                      </span>
                      <p className="font-medium">No registrations found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing the search, or wait for new interest
                        submissions from the apply form.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="max-w-[10rem] truncate pl-4 font-medium sm:max-w-[14rem]">
                      {registration.full_name}
                    </TableCell>
                    <TableCell className="max-w-[11rem] truncate sm:max-w-[16rem]">
                      {registration.email}
                    </TableCell>
                    <TableCell className="max-w-[10rem] truncate sm:max-w-[14rem]">
                      {registration.company_name}
                    </TableCell>
                    <TableCell className="max-w-[8rem] truncate">
                      {registration.sector}
                    </TableCell>
                    <TableCell className="max-w-[8rem] truncate">
                      {registration.country}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {format(
                        new Date(registration.created_at),
                        "MMM d, yyyy",
                      )}
                    </TableCell>
                    <TableCell className="pr-4">
                      <RegistrationRowActions registration={registration} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-transparent px-4 py-3">
        <RegistrationsPagination
          query={query}
          total={total}
          totalPages={totalPages}
        />
      </CardFooter>
    </Card>
  );
}
