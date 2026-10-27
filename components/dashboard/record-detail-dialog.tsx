"use client";

import type { ReactNode } from "react";
import { EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type RecordDetailField = {
  label: string;
  value: ReactNode;
};

type RecordDetailDialogProps = {
  title: string;
  description?: string;
  fields: RecordDetailField[];
  triggerLabel?: string;
};

/**
 * Shared read-only detail modal for portal list rows (logs, errors, etc.).
 */
export function RecordDetailDialog({
  title,
  description,
  fields,
  triggerLabel = "View",
}: RecordDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11 gap-1.5 sm:min-h-8"
          />
        }
      >
        <EyeIcon className="size-4" />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <dl className="grid gap-3">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {field.label}
              </dt>
              <dd className="text-sm break-words whitespace-pre-wrap text-foreground">
                {field.value ?? "—"}
              </dd>
            </div>
          ))}
        </dl>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

/** Pretty-print JSON-ish values for detail fields. */
export function formatDetailJson(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
