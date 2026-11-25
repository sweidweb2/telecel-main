import type {
  BackupExportFormat,
  BackupExportScope,
  BackupExportTable,
} from "@/constants/backup-tables";

export type BackupExportSetting = {
  id: string;
  name: string;
  scope: BackupExportScope;
  /** Set only for scope "single". */
  tableName: BackupExportTable | null;
  /** Set only for scope "multiple" (2+ tables); empty otherwise. */
  tableNames: BackupExportTable[];
  format: BackupExportFormat;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  lastExportedAt: string | null;
};
