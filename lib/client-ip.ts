import "server-only";

import { headers } from "next/headers";

/** Best-effort client IP from reverse-proxy headers. */
export async function clientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}
