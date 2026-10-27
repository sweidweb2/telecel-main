import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock }),
}));

import {
  recordActivity,
  recordAppError,
  scrubContext,
  truncateMessage,
} from "@/actions/observability";

describe("truncateMessage", () => {
  it("keeps short messages", () => {
    expect(truncateMessage("  hello  ")).toBe("hello");
  });

  it("truncates long messages", () => {
    const long = "x".repeat(2100);
    const result = truncateMessage(long);
    expect(result.length).toBe(2000);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("scrubContext", () => {
  it("strips secret-looking keys", () => {
    expect(
      scrubContext({
        slug: "news",
        password: "secret",
        access_token: "abc",
        role: "editor",
      }),
    ).toEqual({ slug: "news", role: "editor" });
  });

  it("returns null for empty or fully scrubbed objects", () => {
    expect(scrubContext(null)).toBeNull();
    expect(scrubContext({ password: "x" })).toBeNull();
  });
});

describe("recordActivity / recordAppError", () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
    insertMock.mockResolvedValue({ error: null });
  });

  it("inserts activity without throwing", async () => {
    await expect(
      recordActivity({
        actorId: "11111111-1111-1111-1111-111111111111",
        action: "create",
        entityType: "blog",
        entityId: "22222222-2222-2222-2222-222222222222",
        summary: { slug: "hello", password: "nope" },
      }),
    ).resolves.toBeUndefined();

    expect(fromMock).toHaveBeenCalledWith("audit_log");
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "create",
        entity_type: "blog",
        summary: { slug: "hello" },
      }),
    );
  });

  it("swallows insert failures for activity", async () => {
    insertMock.mockResolvedValue({ error: { message: "db down" } });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      recordActivity({
        actorId: null,
        action: "update",
        entityType: "user",
      }),
    ).resolves.toBeUndefined();

    spy.mockRestore();
  });

  it("swallows thrown errors for app_errors", async () => {
    insertMock.mockRejectedValue(new Error("boom"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      recordAppError({
        severity: "error",
        source: "actions.blogs.updateBlog",
        message: "failed",
      }),
    ).resolves.toBeUndefined();

    spy.mockRestore();
  });
});
