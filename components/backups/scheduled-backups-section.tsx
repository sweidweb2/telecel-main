"use client";

import { Fragment, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { getScheduledBackupDownloadUrl } from "@/actions/scheduled-backups";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ScheduledBackupsOverview } from "@/data/scheduled-backups";

function formatTimestamp(value: string | null): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), "dd MMM yyyy HH:mm");
  } catch {
    return value;
  }
}

function formatSize(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DownloadButton({ name }: { name: string }) {
  const [pending, startTransition] = useTransition();

  function onDownload() {
    startTransition(async () => {
      const result = await getScheduledBackupDownloadUrl(name);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      window.location.assign(result.url);
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="min-h-11 sm:min-h-8"
      disabled={pending}
      onClick={onDownload}
    >
      {pending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <DownloadIcon data-icon="inline-start" />
      )}
      Download
    </Button>
  );
}

/** Placeholder until media (Storage bucket) export is built. */
export function StorageExportComingSoon() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Storage export</CardTitle>
          <Badge variant="outline">Coming soon</Badge>
        </div>
        <CardDescription>
          Download uploaded media (blog covers and author photos) as an archive.
          Table exports do not include these files.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ScheduledBackupsSection({
  overview,
}: {
  overview: ScheduledBackupsOverview;
}) {
  const { lastRun, runs, legacyFiles, retentionDays, loadError } = overview;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled backups</CardTitle>
        <CardDescription>
          A JSON backup of every table runs daily (one file per table) and is
          kept for {retentionDays} days.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-2 pt-2 text-sm">
          <span className="text-muted-foreground">Last run:</span>
          {lastRun ? (
            <>
              <Badge
                variant={
                  lastRun.status === "success" ? "secondary" : "destructive"
                }
              >
                {lastRun.status === "success" ? "Succeeded" : "Failed"}
              </Badge>
              <span>{formatTimestamp(lastRun.at)}</span>
            </>
          ) : (
            <span>Never</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loadError ? (
          <p className="text-sm text-destructive">
            Could not list backup files: {loadError}
          </p>
        ) : runs.length === 0 && legacyFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No scheduled backups stored yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <Fragment key={run.stamp}>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableCell colSpan={4} className="font-medium">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>Run {formatTimestamp(run.createdAt)}</span>
                          {run.complete ? null : (
                            <Badge variant="destructive">Incomplete</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {run.files.map((file) => (
                      <TableRow key={file.path}>
                        <TableCell className="pl-6 break-all">
                          {file.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatTimestamp(file.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatSize(file.size)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DownloadButton name={file.relativePath} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
                {legacyFiles.map((file) => (
                  <TableRow key={file.path}>
                    <TableCell className="font-medium break-all">
                      {file.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTimestamp(file.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatSize(file.size)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DownloadButton name={file.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
