import { describe, expect, it } from "vitest";

import {
  buildRunStamp,
  createTablePartWriter,
  DEFAULT_RETENTION_DAYS,
  isAuthorizedCronRequest,
  isSafeScheduledBackupPath,
  parseRetentionDays,
  parseRunStamp,
  runManifestPath,
  runTablePartPath,
  runTablePath,
  selectExpiredBackups,
  selectExpiredRuns,
  sortBackupsNewestFirst,
  sortRunStampsNewestFirst,
  toCompactJson,
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

describe("run folders", () => {
  const at = new Date("2026-11-22T02:00:05.123Z");

  it("builds folder-safe stamps and round-trips them", () => {
    const stamp = buildRunStamp(at);
    expect(stamp).toBe("2026-11-22T02-00-05Z");
    expect(parseRunStamp(stamp)?.toISOString()).toBe(
      "2026-11-22T02:00:05.000Z",
    );
    expect(parseRunStamp("all_tables_2026.json")).toBeNull();
  });

  it("lays out one file per table plus a manifest", () => {
    expect(runTablePath("2026-11-22T02-00-05Z", "blogs")).toBe(
      "scheduled/2026-11-22T02-00-05Z/blogs.json",
    );
    expect(runManifestPath("2026-11-22T02-00-05Z")).toBe(
      "scheduled/2026-11-22T02-00-05Z/manifest.json",
    );
  });

  it("writes compact JSON without indentation", () => {
    expect(toCompactJson([{ a: 1, b: [2] }])).toBe('[{"a":1,"b":[2]}]');
  });

  it("expires whole run folders past retention and keeps unknown folders", () => {
    const now = new Date("2026-11-22T02:00:00Z");
    expect(
      selectExpiredRuns(
        [
          "2026-11-21T02-00-00Z",
          "2026-10-23T02-00-00Z", // exactly 30 days: kept
          "2026-10-01T02-00-00Z",
          "misc",
        ],
        30,
        now,
      ),
    ).toEqual(["2026-10-01T02-00-00Z"]);
  });

  it("sorts runs newest first and drops non-run folders", () => {
    expect(
      sortRunStampsNewestFirst([
        "2026-01-01T00-00-00Z",
        "misc",
        "2026-11-01T00-00-00Z",
      ]),
    ).toEqual(["2026-11-01T00-00-00Z", "2026-01-01T00-00-00Z"]);
  });

  it("validates download paths (legacy files and run files only)", () => {
    expect(isSafeScheduledBackupPath("all_tables_2026-11-01.json")).toBe(true);
    expect(isSafeScheduledBackupPath("2026-11-22T02-00-05Z/blogs.json")).toBe(
      true,
    );
    expect(isSafeScheduledBackupPath("../secrets.json")).toBe(false);
    expect(isSafeScheduledBackupPath("misc/blogs.json")).toBe(false);
    expect(isSafeScheduledBackupPath("2026-11-22T02-00-05Z/..")).toBe(false);
    expect(isSafeScheduledBackupPath("a/b/c.json")).toBe(false);
    expect(isSafeScheduledBackupPath("..")).toBe(false);
  });
});

describe("createTablePartWriter", () => {
  const stamp = "2026-11-22T02-00-05Z";

  function collect() {
    const uploads: { path: string; content: string }[] = [];
    return {
      uploads,
      upload: async (path: string, content: string) => {
        uploads.push({ path, content });
      },
    };
  }

  it("splits rows into numbered parts by row count", async () => {
    const sink = collect();
    const writer = createTablePartWriter({
      stamp,
      table: "blogs",
      upload: sink.upload,
      maxRows: 2,
    });
    await writer.write([{ id: 1 }, { id: 2 }, { id: 3 }]);
    await writer.write([{ id: 4 }, { id: 5 }]);
    const parts = await writer.finish();
    expect(parts.map((p) => [p.path, p.rows])).toEqual([
      ["scheduled/2026-11-22T02-00-05Z/blogs.0001.json", 2],
      ["scheduled/2026-11-22T02-00-05Z/blogs.0002.json", 2],
      ["scheduled/2026-11-22T02-00-05Z/blogs.0003.json", 1],
    ]);
    expect(sink.uploads.flatMap((u) => JSON.parse(u.content))).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ]);
  });

  it("flushes on the byte budget", async () => {
    const sink = collect();
    const writer = createTablePartWriter({
      stamp,
      table: "blogs",
      upload: sink.upload,
      maxBytes: 10,
    });
    await writer.write([{ v: "aaaaaaaaaa" }, { v: "b" }]);
    const parts = await writer.finish();
    expect(parts).toHaveLength(2);
    expect(parts[0].bytes).toBe(sink.uploads[0].content.length);
  });

  it("writes one empty part for an empty table", async () => {
    const sink = collect();
    const writer = createTablePartWriter({
      stamp,
      table: "inquiries",
      upload: sink.upload,
    });
    const parts = await writer.finish();
    expect(parts).toEqual([
      {
        path: "scheduled/2026-11-22T02-00-05Z/inquiries.0001.json",
        rows: 0,
        bytes: 2,
      },
    ]);
    expect(sink.uploads[0].content).toBe("[]");
  });

  it("accepts part files as safe download paths", () => {
    expect(runTablePartPath(stamp, "blogs", 12)).toBe(
      "scheduled/2026-11-22T02-00-05Z/blogs.0012.json",
    );
    expect(isSafeScheduledBackupPath(`${stamp}/blogs.0012.json`)).toBe(true);
  });
});
