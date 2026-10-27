import type { BackupExportFile } from "@/lib/backup-export";

/** Trigger browser downloads for one or more export files. */
export async function downloadExportFiles(files: BackupExportFile[]) {
  for (const [index, file] of files.entries()) {
    const blob = new Blob([file.content], { type: file.mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    // Stagger multi-file downloads so browsers do not block subsequent clicks.
    if (index < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}
