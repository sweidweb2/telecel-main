import { describe, expect, it } from "vitest";

import {
  BACKUP_EXPORT_TABLES,
  BACKUP_TABLE_PRIMARY_KEYS,
} from "@/constants/backup-tables";

describe("BACKUP_TABLE_PRIMARY_KEYS", () => {
  it("maps every exportable table to its primary key", () => {
    expect(Object.keys(BACKUP_TABLE_PRIMARY_KEYS).sort()).toEqual(
      [...BACKUP_EXPORT_TABLES].sort(),
    );
  });

  it("uses `key` for site_settings and `id` elsewhere (per migrations)", () => {
    for (const table of BACKUP_EXPORT_TABLES) {
      expect(BACKUP_TABLE_PRIMARY_KEYS[table]).toBe(
        table === "site_settings" ? "key" : "id",
      );
    }
  });
});
