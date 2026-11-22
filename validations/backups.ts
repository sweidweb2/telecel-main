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
  .max(
    BACKUP_SETTING_NAME_MAX,
    `Name must be ${BACKUP_SETTING_NAME_MAX} characters or fewer`,
  );

const scopeSchema = z.enum(BACKUP_EXPORT_SCOPES, "Choose a scope");
const formatSchema = z.enum(BACKUP_EXPORT_FORMATS, "Choose a format");
const tableNameSchema = z.enum(BACKUP_EXPORT_TABLES, "Choose a table");
const tableNamesSchema = z
  .array(tableNameSchema)
  .max(BACKUP_EXPORT_TABLES.length);

type SettingFields = {
  name: string;
  scope: z.infer<typeof scopeSchema>;
  tableName?: z.infer<typeof tableNameSchema> | null;
  tableNames?: z.infer<typeof tableNameSchema>[] | null;
  format: z.infer<typeof formatSchema>;
};

/** Shared by the server schemas and the dialog form. */
export function refineSettingFields(
  value: SettingFields,
  ctx: z.RefinementCtx,
) {
  if (value.scope === "single" && !value.tableName) {
    ctx.addIssue({
      code: "custom",
      path: ["tableName"],
      message: "Choose a table to export",
    });
  }

  if (value.scope !== "single" && value.tableName) {
    ctx.addIssue({
      code: "custom",
      path: ["tableName"],
      message: "Clear the single table for this scope",
    });
  }

  if (value.scope === "multiple") {
    const unique = new Set(value.tableNames ?? []);
    if (unique.size < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["tableNames"],
        message: "Choose at least two tables",
      });
    }
  }
}

function normalizeSettingFields(value: SettingFields) {
  return {
    name: value.name,
    scope: value.scope,
    format: value.format,
    tableName: value.scope === "single" ? (value.tableName ?? null) : null,
    tableNames:
      value.scope === "multiple"
        ? BACKUP_EXPORT_TABLES.filter((t) => value.tableNames?.includes(t))
        : null,
  };
}

const settingFields = {
  name: nameSchema,
  scope: scopeSchema,
  tableName: tableNameSchema.nullable().optional(),
  tableNames: tableNamesSchema.nullable().optional(),
  format: formatSchema,
};

export const createBackupSettingSchema = z
  .object(settingFields)
  .superRefine(refineSettingFields)
  .transform(normalizeSettingFields);

export const updateBackupSettingSchema = z
  .object({ id: z.uuid("Invalid setting id"), ...settingFields })
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

export type CreateBackupSettingInput = z.input<
  typeof createBackupSettingSchema
>;
export type UpdateBackupSettingInput = z.input<
  typeof updateBackupSettingSchema
>;
export type DeleteBackupSettingInput = z.infer<
  typeof deleteBackupSettingSchema
>;
export type RunBackupExportInput = z.infer<typeof runBackupExportSchema>;
