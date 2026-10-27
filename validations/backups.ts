import { z } from "zod";

import {
  BACKUP_EXPORT_FORMATS,
  BACKUP_EXPORT_SCOPES,
  BACKUP_EXPORT_TABLES,
} from "@/constants/backup-tables";

export const BACKUP_SETTING_NAME_MAX = 120;

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(BACKUP_SETTING_NAME_MAX, `Name must be ${BACKUP_SETTING_NAME_MAX} characters or fewer`);

const scopeSchema = z.enum(BACKUP_EXPORT_SCOPES, "Choose a scope");
const formatSchema = z.enum(BACKUP_EXPORT_FORMATS, "Choose a format");
const tableNameSchema = z.enum(BACKUP_EXPORT_TABLES, "Choose a table");

type SettingFields = {
  name: string;
  scope: z.infer<typeof scopeSchema>;
  tableName?: z.infer<typeof tableNameSchema> | null;
  format: z.infer<typeof formatSchema>;
};

function refineSettingFields(
  value: SettingFields,
  ctx: z.RefinementCtx,
) {
  if (value.scope === "single") {
    if (!value.tableName) {
      ctx.addIssue({
        code: "custom",
        path: ["tableName"],
        message: "Choose a table to export",
      });
    }
    return;
  }

  if (value.tableName) {
    ctx.addIssue({
      code: "custom",
      path: ["tableName"],
      message: "Clear the table when exporting all tables",
    });
  }
}

function normalizeSettingFields(value: SettingFields) {
  return {
    name: value.name,
    scope: value.scope,
    format: value.format,
    tableName: value.scope === "single" ? (value.tableName ?? null) : null,
  };
}

export const createBackupSettingSchema = z
  .object({
    name: nameSchema,
    scope: scopeSchema,
    tableName: tableNameSchema.nullable().optional(),
    format: formatSchema,
  })
  .superRefine(refineSettingFields)
  .transform(normalizeSettingFields);

export const updateBackupSettingSchema = z
  .object({
    id: z.uuid("Invalid setting id"),
    name: nameSchema,
    scope: scopeSchema,
    tableName: tableNameSchema.nullable().optional(),
    format: formatSchema,
  })
  .superRefine(refineSettingFields)
  .transform((value) => ({
    id: value.id,
    ...normalizeSettingFields(value),
  }));

export const deleteBackupSettingSchema = z.object({
  id: z.uuid("Invalid setting id"),
});

export const runBackupExportSchema = z.object({
  id: z.uuid("Invalid setting id"),
});

export type CreateBackupSettingInput = z.infer<typeof createBackupSettingSchema>;
export type UpdateBackupSettingInput = z.infer<typeof updateBackupSettingSchema>;
export type DeleteBackupSettingInput = z.infer<typeof deleteBackupSettingSchema>;
export type RunBackupExportInput = z.infer<typeof runBackupExportSchema>;
