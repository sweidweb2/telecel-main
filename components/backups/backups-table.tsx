"use client";

import { useTransition } from "react";
import { format, parseISO } from "date-fns";
import { useRouter } from "nextjs-toploader/app";
import { DatabaseBackupIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { runBackupExport } from "@/actions/backups";
import {
  DeleteBackupSettingDialog,
  EditBackupSettingDialog,
} from "@/components/backups/backup-setting-dialogs";
import { downloadExportFiles } from "@/components/backups/download-export-files";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BACKUP_TABLE_LABELS } from "@/constants/backup-tables";
import type { BackupExportSetting } from "@/types/backups";

function scopeLabel(setting: BackupExportSetting): string {
  if (setting.scope === "all") return "All tables";
  return setting.tableName
    ? BACKUP_TABLE_LABELS[setting.tableName]
    : "One table";
}

function formatTimestamp(value: string | null): string {
  if (!value) return "Never";
  try {
    return format(parseISO(value), "dd MMM yyyy HH:mm");
  } catch {
    return value;
  }
}

function ExportButton({ setting }: { setting: BackupExportSetting }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onExport() {
    startTransition(async () => {
      const result = await runBackupExport({ id: setting.id });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      try {
        await downloadExportFiles(result.files);
        toast.success(result.message);
        router.refresh();
      } catch {
        toast.error("Export built but the browser download failed.");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="min-h-11 w-full sm:min-h-8 sm:w-auto"
      disabled={pending}
      onClick={onExport}
    >
      {pending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <DownloadIcon data-icon="inline-start" />
      )}
      Export
    </Button>
  );
}

export function BackupsTable({ settings }: { settings: BackupExportSetting[] }) {
  if (settings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <DatabaseBackupIcon className="size-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium text-ink">No export settings yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create a setting to choose one table or all tables, pick CSV or
              JSON, then download anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Last exported</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium">{setting.name}</TableCell>
                  <TableCell>{scopeLabel(setting)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {setting.format.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTimestamp(setting.lastExportedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <ExportButton setting={setting} />
                      <EditBackupSettingDialog setting={setting} />
                      <DeleteBackupSettingDialog setting={setting} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium text-ink">{setting.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scopeLabel(setting)} · {setting.format.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last exported {formatTimestamp(setting.lastExportedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <EditBackupSettingDialog setting={setting} />
                  <DeleteBackupSettingDialog setting={setting} />
                </div>
              </div>
              <ExportButton setting={setting} />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
