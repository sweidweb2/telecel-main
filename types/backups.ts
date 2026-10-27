import type {
  BackupExportFormat,
  BackupExportScope,
  BackupExportTable,
} from "@/constants/backup-tables";

export type BackupExportSetting = {
  id: string;
  name: string;
  scope: BackupExportScope;
  tableName: BackupExportTable | null;
  format: BackupExportFormat;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  lastExportedAt: string | null;
};
