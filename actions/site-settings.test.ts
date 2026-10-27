import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const upsertMock = vi.fn();
const fromMock = vi.fn(() => ({ upsert: upsertMock }));

vi.mock("@/data/auth", () => ({
  authorizeAction: vi.fn(),
}));

vi.mock("@/actions/observability", () => ({
  recordActivity: vi.fn(async () => undefined),
  unexpectedActionError: vi.fn(async ({ userMessage }: { userMessage: string }) => ({
    status: "error" as const,
    message: userMessage,
  })),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/maintenance", async () => {
  const actual = await vi.importActual<typeof import("@/lib/maintenance")>(
    "@/lib/maintenance",
  );
  return {
    ...actual,
    clearMaintenanceProxyCache: vi.fn(),
  };
});

import { authorizeAction } from "@/data/auth";
import { recordActivity } from "@/actions/observability";
import { updateMaintenanceMode } from "@/actions/site-settings";

describe("updateMaintenanceMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    upsertMock.mockResolvedValue({ error: null });
    fromMock.mockReturnValue({ upsert: upsertMock });
  });

  it("rejects non-admins", async () => {
    vi.mocked(authorizeAction).mockResolvedValue({
      status: "error",
      message: "Only administrators can do this.",
    });

    const result = await updateMaintenanceMode("full");
    expect(result).toEqual({
      status: "error",
      message: "Only administrators can do this.",
    });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("upserts and records activity for admins", async () => {
    vi.mocked(authorizeAction).mockResolvedValue({
      status: "success",
      session: {
        userId: "11111111-1111-1111-1111-111111111111",
        email: "admin@example.com",
        role: "admin",
        isActive: true,
        sessionFresh: true,
        supabase: { from: fromMock } as never,
      },
    });

    const result = await updateMaintenanceMode("full");

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.mode).toBe("full");
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "maintenance",
        value: { mode: "full" },
      }),
      { onConflict: "key" },
    );
    expect(recordActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "update",
        entityType: "site_settings",
        entityId: "maintenance",
        summary: { mode: "full" },
      }),
    );
  });
});
