"use client";

import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  createBackupSetting,
  deleteBackupSetting,
  updateBackupSetting,
} from "@/actions/backups";
import {
  BackupSettingFormFields,
  type BackupSettingFormValues,
} from "@/components/backups/backup-setting-form-fields";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Spinner } from "@/components/ui/spinner";
import {
  BACKUP_EXPORT_FORMATS,
  BACKUP_EXPORT_SCOPES,
  BACKUP_EXPORT_TABLES,
} from "@/constants/backup-tables";
import type { BackupExportSetting } from "@/types/backups";
import { BACKUP_SETTING_NAME_MAX } from "@/validations/backups";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(
        BACKUP_SETTING_NAME_MAX,
        `Name must be ${BACKUP_SETTING_NAME_MAX} characters or fewer`,
      ),
    scope: z.enum(BACKUP_EXPORT_SCOPES, "Choose a scope"),
    tableName: z.enum(BACKUP_EXPORT_TABLES).nullable(),
    format: z.enum(BACKUP_EXPORT_FORMATS, "Choose a format"),
  })
  .superRefine((value, ctx) => {
    if (value.scope === "single" && !value.tableName) {
      ctx.addIssue({
        code: "custom",
        path: ["tableName"],
        message: "Choose a table to export",
      });
    }
  });

const DEFAULT_VALUES: BackupSettingFormValues = {
  name: "",
  scope: "single",
  tableName: "profiles",
  format: "csv",
};

function settingToFormValues(setting: BackupExportSetting): BackupSettingFormValues {
  return {
    name: setting.name,
    scope: setting.scope,
    tableName: setting.tableName,
    format: setting.format,
  };
}

export function CreateBackupSettingDialog() {
  const id = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<BackupSettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  function onSubmit(values: BackupSettingFormValues) {
    startTransition(async () => {
      const result = await createBackupSetting({
        name: values.name,
        scope: values.scope,
        tableName: values.scope === "single" ? values.tableName : null,
        format: values.format,
      });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.reset(DEFAULT_VALUES);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset(DEFAULT_VALUES);
      }}
    >
      <DialogTrigger
        render={
          <Button className="min-h-11 w-full sm:min-h-8 sm:w-auto" />
        }
      >
        <PlusIcon data-icon="inline-start" />
        New export setting
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New export setting</DialogTitle>
          <DialogDescription>
            Save which tables and format to export so you can re-run the same
            download later.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <BackupSettingFormFields
            idPrefix={`${id}-create`}
            control={form.control}
            watch={form.watch}
            setValue={form.setValue}
            disabled={pending}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Save setting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditBackupSettingDialog({
  setting,
}: {
  setting: BackupExportSetting;
}) {
  const id = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<BackupSettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: settingToFormValues(setting),
  });

  function onSubmit(values: BackupSettingFormValues) {
    startTransition(async () => {
      const result = await updateBackupSetting({
        id: setting.id,
        name: values.name,
        scope: values.scope,
        tableName: values.scope === "single" ? values.tableName : null,
        format: values.format,
      });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) form.reset(settingToFormValues(setting));
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 sm:min-h-8 sm:min-w-8"
            aria-label={`Edit ${setting.name}`}
          />
        }
      >
        <PencilIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit export setting</DialogTitle>
          <DialogDescription>
            Update the name, tables, or format for this saved export.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <BackupSettingFormFields
            idPrefix={`${id}-edit`}
            control={form.control}
            watch={form.watch}
            setValue={form.setValue}
            disabled={pending}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteBackupSettingDialog({
  setting,
}: {
  setting: BackupExportSetting;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteBackupSetting({ id: setting.id });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 text-destructive sm:min-h-8 sm:min-w-8"
            aria-label={`Delete ${setting.name}`}
          />
        }
      >
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete export setting?</AlertDialogTitle>
          <AlertDialogDescription>
            “{setting.name}” will be removed. This does not delete any table
            data — only the saved export configuration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={onDelete}
          >
            {pending ? <Spinner data-icon="inline-start" /> : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
