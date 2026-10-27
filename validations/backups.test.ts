import { describe, expect, it } from "vitest";

import {
  createBackupSettingSchema,
  deleteBackupSettingSchema,
  runBackupExportSchema,
  updateBackupSettingSchema,
} from "@/validations/backups";

describe("createBackupSettingSchema", () => {
  it("accepts a single-table CSV setting", () => {
    const result = createBackupSettingSchema.safeParse({
      name: "Profiles CSV",
      scope: "single",
      tableName: "profiles",
      format: "csv",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Profiles CSV",
        scope: "single",
        tableName: "profiles",
        format: "csv",
      });
    }
  });

  it("accepts all-tables JSON and clears tableName", () => {
    const result = createBackupSettingSchema.safeParse({
      name: "Full dump",
      scope: "all",
      tableName: null,
      format: "json",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tableName).toBeNull();
    }
  });

  it("rejects an unknown table name", () => {
    const result = createBackupSettingSchema.safeParse({
      name: "Bad table",
      scope: "single",
      tableName: "auth.users",
      format: "csv",
    });
    expect(result.success).toBe(false);
  });

  it("rejects single scope without a table", () => {
    const result = createBackupSettingSchema.safeParse({
      name: "Missing table",
      scope: "single",
      tableName: null,
      format: "json",
    });
    expect(result.success).toBe(false);
  });

  it("rejects all scope with a table set", () => {
    const result = createBackupSettingSchema.safeParse({
      name: "Conflict",
      scope: "all",
      tableName: "blogs",
      format: "csv",
    });
    expect(result.success).toBe(false);
  });
});

describe("update / delete / run schemas", () => {
  const id = "11111111-1111-4111-8111-111111111111";

  it("requires an id for update", () => {
    const result = updateBackupSettingSchema.safeParse({
      id,
      name: "Updated",
      scope: "all",
      tableName: null,
      format: "json",
    });
    expect(result.success).toBe(true);
  });

  it("accepts delete and run payloads", () => {
    expect(deleteBackupSettingSchema.safeParse({ id }).success).toBe(true);
    expect(runBackupExportSchema.safeParse({ id }).success).toBe(true);
  });
});
