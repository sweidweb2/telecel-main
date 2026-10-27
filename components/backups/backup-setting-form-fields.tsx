"use client";

import { Controller, type Control, type UseFormSetValue, type UseFormWatch } from "react-hook-form";

import {
  BACKUP_EXPORT_FORMATS,
  BACKUP_EXPORT_TABLES,
  BACKUP_TABLE_LABELS,
  type BackupExportFormat,
  type BackupExportScope,
  type BackupExportTable,
} from "@/constants/backup-tables";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BACKUP_SETTING_NAME_MAX } from "@/validations/backups";

export type BackupSettingFormValues = {
  name: string;
  scope: BackupExportScope;
  tableName: BackupExportTable | null;
  format: BackupExportFormat;
};

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <FieldError>{message}</FieldError>;
}

export function BackupSettingFormFields({
  idPrefix,
  control,
  watch,
  setValue,
  disabled,
}: {
  idPrefix: string;
  control: Control<BackupSettingFormValues>;
  watch: UseFormWatch<BackupSettingFormValues>;
  setValue: UseFormSetValue<BackupSettingFormValues>;
  disabled?: boolean;
}) {
  const scope = watch("scope");

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={Boolean(fieldState.error)}>
            <Label htmlFor={`${idPrefix}-name`}>Name</Label>
            <Input
              id={`${idPrefix}-name`}
              autoComplete="off"
              maxLength={BACKUP_SETTING_NAME_MAX}
              disabled={disabled}
              aria-invalid={Boolean(fieldState.error)}
              {...field}
            />
            <FormFieldError message={fieldState.error?.message} />
          </Field>
        )}
      />

      <Controller
        name="scope"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={Boolean(fieldState.error)}>
            <Label htmlFor={`${idPrefix}-scope`}>Scope</Label>
            <Select
              value={field.value}
              onValueChange={(value) => {
                if (value !== "all" && value !== "single") return;
                field.onChange(value);
                if (value === "all") {
                  setValue("tableName", null);
                } else if (!watch("tableName")) {
                  setValue("tableName", "profiles");
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger
                id={`${idPrefix}-scope`}
                className="w-full"
                aria-invalid={Boolean(fieldState.error)}
              >
                <SelectValue placeholder="Choose scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tables</SelectItem>
                <SelectItem value="single">One table</SelectItem>
              </SelectContent>
            </Select>
            <FormFieldError message={fieldState.error?.message} />
          </Field>
        )}
      />

      {scope === "single" ? (
        <Controller
          name="tableName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <Label htmlFor={`${idPrefix}-table`}>Table</Label>
              <Select
                value={field.value ?? undefined}
                onValueChange={(value) => {
                  if (
                    typeof value === "string" &&
                    (BACKUP_EXPORT_TABLES as readonly string[]).includes(value)
                  ) {
                    field.onChange(value as BackupExportTable);
                  }
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  id={`${idPrefix}-table`}
                  className="w-full"
                  aria-invalid={Boolean(fieldState.error)}
                >
                  <SelectValue placeholder="Choose a table" />
                </SelectTrigger>
                <SelectContent>
                  {BACKUP_EXPORT_TABLES.map((table) => (
                    <SelectItem key={table} value={table}>
                      {BACKUP_TABLE_LABELS[table]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError message={fieldState.error?.message} />
            </Field>
          )}
        />
      ) : null}

      <Controller
        name="format"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={Boolean(fieldState.error)}>
            <Label htmlFor={`${idPrefix}-format`}>Format</Label>
            <Select
              value={field.value}
              onValueChange={(value) => {
                if (
                  typeof value === "string" &&
                  (BACKUP_EXPORT_FORMATS as readonly string[]).includes(value)
                ) {
                  field.onChange(value as BackupExportFormat);
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger
                id={`${idPrefix}-format`}
                className="w-full"
                aria-invalid={Boolean(fieldState.error)}
              >
                <SelectValue placeholder="Choose format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <FormFieldError message={fieldState.error?.message} />
          </Field>
        )}
      />
    </div>
  );
}
