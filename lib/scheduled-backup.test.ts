import { describe, expect, it } from "vitest";

import {
  DEFAULT_RETENTION_DAYS,
  isAuthorizedCronRequest,
  parseRetentionDays,
  selectExpiredBackups,
  sortBackupsNewestFirst,
  type StoredBackup,
} from "@/lib/scheduled-backup";

const backup = (name: string, createdAt: string | null): StoredBackup => ({
  path: `scheduled/${name}`,
  name,
  createdAt,
  size: 10,
});

describe("isAuthorizedCronRequest", () => {
  it("accepts the exact bearer secret", () => {
    expect(isAuthorizedCronRequest("Bearer s3cret", "s3cret")).toBe(true);
  });

  it("rejects wrong, missing or malformed headers", () => {
    expect(isAuthorizedCronRequest("Bearer nope", "s3cret")).toBe(false);
    expect(isAuthorizedCronRequest("s3cret", "s3cret")).toBe(false);
    expect(isAuthorizedCronRequest("Bearer s3cret ", "s3cret")).toBe(false);
    expect(isAuthorizedCronRequest(null, "s3cret")).toBe(false);
  });

  it("denies everything when the secret is unset or blank", () => {
    expect(isAuthorizedCronRequest("Bearer ", "")).toBe(false);
    expect(isAuthorizedCronRequest("Bearer undefined", undefined)).toBe(false);
    expect(isAuthorizedCronRequest("Bearer    ", "   ")).toBe(false);
  });
});

describe("parseRetentionDays", () => {
  it("defaults to 30", () => {
    expect(parseRetentionDays(undefined)).toBe(DEFAULT_RETENTION_DAYS);
    expect(DEFAULT_RETENTION_DAYS).toBe(30);
  });

  it("parses positive integers and rejects junk", () => {
    expect(parseRetentionDays("7")).toBe(7);
    expect(parseRetentionDays("0")).toBe(30);
    expect(parseRetentionDays("-3")).toBe(30);
    expect(parseRetentionDays("abc")).toBe(30);
    expect(parseRetentionDays("7.5")).toBe(30);
  });
});

describe("selectExpiredBackups", () => {
  const now = new Date("2026-11-22T02:00:00Z");

  it("selects only backups older than the retention window", () => {
    const list = [
      backup("new", "2026-11-21T02:00:00Z"),
      backup("edge", "2026-10-23T02:00:00Z"), // exactly 30 days: kept
      backup("old", "2026-10-23T01:59:59Z"),
      backup("ancient", "2025-01-01T00:00:00Z"),
    ];
    expect(selectExpiredBackups(list, 30, now).map((b) => b.name)).toEqual([
      "old",
      "ancient",
    ]);
  });

  it("never deletes undated or unparseable entries", () => {
    const list = [backup("a", null), backup("b", "not-a-date")];
    expect(selectExpiredBackups(list, 1, now)).toEqual([]);
  });
});

describe("sortBackupsNewestFirst", () => {
  it("orders newest first with undated last", () => {
    const sorted = sortBackupsNewestFirst([
      backup("x", null),
      backup("old", "2026-01-01T00:00:00Z"),
      backup("new", "2026-11-01T00:00:00Z"),
    ]);
    expect(sorted.map((b) => b.name)).toEqual(["new", "old", "x"]);
  });
});
