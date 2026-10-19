"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { Loader2Icon, MailIcon } from "lucide-react";

import { ContactMessageRowActions } from "@/components/contact-messages/contact-message-dialogs";
import { ContactMessagesFilters } from "@/components/contact-messages/contact-messages-filters";
import { ContactMessagesPagination } from "@/components/contact-messages/contact-messages-pagination";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types/contact-message";
import type { ContactMessageListQuery } from "@/validations/contact-message";

export function ContactMessagesTable({
  messages,
  total,
  totalPages,
  query,
}: {
  messages: ContactMessage[];
  total: number;
  totalPages: number;
  query: ContactMessageListQuery;
}) {
  const [isSearchPending, setIsSearchPending] = useState(false);
  const onPendingChange = useCallback((pending: boolean) => {
    setIsSearchPending(pending);
  }, []);

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0">
      <ContactMessagesFilters
        query={query}
        onPendingChange={onPendingChange}
      />

      <CardContent className="relative p-0">
        {isSearchPending ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/60"
            aria-busy="true"
            aria-live="polite"
          >
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            <span className="sr-only">Updating results</span>
          </div>
        ) : null}

        <div
          className={cn(
            "overflow-x-auto transition-opacity",
            isSearchPending && "pointer-events-none opacity-60",
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-28 pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 whitespace-normal">
                      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <MailIcon className="size-5 text-muted-foreground" />
                      </span>
                      <p className="font-medium">No messages found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing the search, or wait for new submissions
                        from the contact form.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="max-w-[10rem] truncate pl-4 font-medium sm:max-w-[14rem]">
                      {message.full_name}
                    </TableCell>
                    <TableCell className="max-w-[11rem] truncate sm:max-w-[16rem]">
                      {message.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {message.phone}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate sm:max-w-[18rem]">
                      {message.subject}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {format(new Date(message.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="pr-4">
                      <ContactMessageRowActions message={message} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-transparent px-4 py-3">
        <ContactMessagesPagination
          query={query}
          total={total}
          totalPages={totalPages}
        />
      </CardFooter>
    </Card>
  );
}
