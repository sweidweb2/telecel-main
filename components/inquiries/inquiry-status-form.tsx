"use client";

import { useTransition } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

import { updateInquiryStatus } from "@/actions/inquiries";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { INQUIRY_STATUSES } from "@/constants/inquiries";
import type { InquiryStatus } from "@/types/inquiry";

export function InquiryStatusForm({
  inquiryId,
  status,
}: {
  inquiryId: string;
  status: InquiryStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string | null) {
    if (!next || next === status) return;
    startTransition(async () => {
      const result = await updateInquiryStatus({
        id: inquiryId,
        status: next as InquiryStatus,
      });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message ?? "Status updated.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="inquiry-status-update">Status</Label>
      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={handleChange} disabled={isPending}>
          <SelectTrigger id="inquiry-status-update" className="h-11 w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INQUIRY_STATUSES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending ? <Spinner className="size-4" /> : null}
      </div>
    </div>
  );
}
