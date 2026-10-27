import { describe, expect, it } from "vitest";

import {
  buildAllTablesFiles,
  buildExportFilename,
  buildSingleTableFile,
  rowsToCsv,
  rowsToJson,
  tablesToJson,
} from "@/lib/backup-export";

describe("rowsToCsv", () => {
  it("returns empty string for no rows", () => {
    expect(rowsToCsv([])).toBe("");
  });

  it("escapes quotes, commas, and newlines", () => {
    const csv = rowsToCsv([
      { id: 1, name: 'Acme, "Inc"', note: "line1\nline2" },
    ]);
    expect(csv).toBe(
      'id,name,note\n1,"Acme, ""Inc""","line1\nline2"',
    );
  });

  it("stringifies nested values as JSON", () => {
    const csv = rowsToCsv([{ id: 1, meta: { a: true } }]);
    expect(csv).toBe('id,meta\n1,"{""a"":true}"');
  });
});

describe("rowsToJson / tablesToJson", () => {
  it("pretty-prints a single table array", () => {
    expect(rowsToJson([{ id: 1 }])).toBe(`${JSON.stringify([{ id: 1 }], null, 2)}\n`);
  });

  it("pretty-prints a keyed multi-table object", () => {
    const payload = { profiles: [{ id: "a" }], blogs: [] };
    expect(tablesToJson(payload)).toBe(
      `${JSON.stringify(payload, null, 2)}\n`,
    );
  });
});

describe("buildExportFilename", () => {
  it("sanitizes the base name and appends format", () => {
    const name = buildExportFilename("My Table!", "csv", new Date("2026-01-02T03:04:05.678Z"));
    expect(name).toBe("My_Table_2026-01-02T03-04-05Z.csv");
  });
});

describe("buildSingleTableFile / buildAllTablesFiles", () => {
  it("builds one CSV for a single table", () => {
    const file = buildSingleTableFile("profiles", [{ id: "1" }], "csv");
    expect(file.mimeType).toContain("text/csv");
    expect(file.filename).toMatch(/^profiles_.+\.csv$/);
    expect(file.content).toContain("id");
  });

  it("builds one JSON for all tables", () => {
    const files = buildAllTablesFiles(
      { profiles: [{ id: "1" }], blogs: [] },
      "json",
    );
    expect(files).toHaveLength(1);
    expect(files[0]?.filename).toMatch(/^all_tables_.+\.json$/);
    expect(files[0]?.content).toContain('"profiles"');
  });

  it("builds one CSV per table for all + csv", () => {
    const files = buildAllTablesFiles(
      { profiles: [{ id: "1" }], blogs: [{ id: "2" }] },
      "csv",
    );
    expect(files).toHaveLength(2);
    expect(files.every((file) => file.filename.endsWith(".csv"))).toBe(true);
  });
});
