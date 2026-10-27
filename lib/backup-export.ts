import type { BackupExportFormat, BackupExportTable } from "@/constants/backup-tables";

export type BackupRow = Record<string, unknown>;

export type BackupExportFile = {
  filename: string;
  mimeType: string;
  content: string;
};

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";

  const raw =
    typeof value === "string"
      ? value
      : typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value);

  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replaceAll('"', '""')}"`;
  }
  return raw;
}

/** Serialize rows to CSV with a header from the union of keys (stable first-row order). */
export function rowsToCsv(rows: BackupRow[]): string {
  if (rows.length === 0) return "";

  const columns: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }

  const lines = [
    columns.map(escapeCsvCell).join(","),
    ...rows.map((row) => columns.map((col) => escapeCsvCell(row[col])).join(",")),
  ];
  return lines.join("\n");
}

export function rowsToJson(rows: BackupRow[]): string {
  return `${JSON.stringify(rows, null, 2)}\n`;
}

export function tablesToJson(
  tables: Partial<Record<BackupExportTable, BackupRow[]>>,
): string {
  return `${JSON.stringify(tables, null, 2)}\n`;
}

export function buildExportFilename(
  base: string,
  format: BackupExportFormat,
  at = new Date(),
): string {
  const stamp = at.toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
  const safe = base.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "export";
  return `${safe}_${stamp}.${format}`;
}

export function buildSingleTableFile(
  tableName: BackupExportTable,
  rows: BackupRow[],
  format: BackupExportFormat,
): BackupExportFile {
  if (format === "csv") {
    return {
      filename: buildExportFilename(tableName, "csv"),
      mimeType: "text/csv;charset=utf-8",
      content: rowsToCsv(rows),
    };
  }

  return {
    filename: buildExportFilename(tableName, "json"),
    mimeType: "application/json;charset=utf-8",
    content: rowsToJson(rows),
  };
}

export function buildAllTablesFiles(
  tables: Partial<Record<BackupExportTable, BackupRow[]>>,
  format: BackupExportFormat,
): BackupExportFile[] {
  if (format === "json") {
    return [
      {
        filename: buildExportFilename("all_tables", "json"),
        mimeType: "application/json;charset=utf-8",
        content: tablesToJson(tables),
      },
    ];
  }

  return (Object.keys(tables) as BackupExportTable[]).map((tableName) => ({
    filename: buildExportFilename(tableName, "csv"),
    mimeType: "text/csv;charset=utf-8",
    content: rowsToCsv(tables[tableName] ?? []),
  }));
}
