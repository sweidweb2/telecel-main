"use server";

import { unexpectedActionError } from "@/actions/observability";
import { authorizeAction } from "@/data/auth";
import { getBackupStorage } from "@/lib/backup-storage";
import {
  isSafeScheduledBackupPath,
  SCHEDULED_BACKUP_PREFIX,
} from "@/lib/scheduled-backup";

const SIGNED_URL_TTL_SECONDS = 60;

export type ScheduledBackupUrlResult =
  { status: "success"; url: string } | { status: "error"; message: string };

/**
 * Short-lived signed download URL for one scheduled backup file (admin only).
 * `name` is a legacy file name or `<stamp>/<table>.json` inside a run folder.
 */
export async function getScheduledBackupDownloadUrl(
  name: string,
): Promise<ScheduledBackupUrlResult> {
  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  if (typeof name !== "string" || !isSafeScheduledBackupPath(name)) {
    return { status: "error", message: "Invalid backup file." };
  }

  try {
    const url = await getBackupStorage().signedUrl(
      `${SCHEDULED_BACKUP_PREFIX}/${name}`,
      SIGNED_URL_TTL_SECONDS,
      name.replaceAll("/", "_"),
    );
    return { status: "success", url };
  } catch (error) {
    return unexpectedActionError({
      source: "actions.scheduledBackups.getDownloadUrl",
      actorId: auth.session.userId,
      error: error instanceof Error ? error : { message: String(error) },
      userMessage: "Could not create a download link.",
    });
  }
}
