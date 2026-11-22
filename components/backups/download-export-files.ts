import type { BackupDownload } from "@/actions/backups";

/** Trigger browser downloads for one or more signed export URLs. */
export async function downloadExportFiles(downloads: BackupDownload[]) {
  for (const [index, file] of downloads.entries()) {
    const anchor = document.createElement("a");
    anchor.href = file.url;
    anchor.download = file.filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Stagger multi-file downloads so browsers do not block subsequent clicks.
    if (index < downloads.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}
