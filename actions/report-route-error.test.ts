import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const recordAppError = vi.fn<(input: unknown) => Promise<void>>(
  async () => undefined,
);

vi.mock("@/actions/observability", () => ({
  recordAppError: (input: unknown) => recordAppError(input),
}));

vi.mock("@/lib/client-ip", () => ({
  clientIp: async () => "203.0.113.7",
}));

import { reportRouteError } from "@/actions/report-route-error";
import { resetRateLimitBuckets } from "@/lib/rate-limit";

describe("reportRouteError", () => {
  beforeEach(() => {
    recordAppError.mockClear();
    resetRateLimitBuckets();
  });

  it("forwards boundary errors into app_errors", async () => {
    await reportRouteError({
      message: "boom",
      digest: "abc123",
      name: "TypeError",
    });

    expect(recordAppError).toHaveBeenCalledWith({
      severity: "error",
      source: "app.route-error",
      code: "abc123",
      message: "boom",
      requestId: "abc123",
      context: { name: "TypeError", digest: "abc123" },
    });
  });

  it("falls back when digest is missing", async () => {
    await reportRouteError({ message: "", name: "Error" });

    expect(recordAppError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "Error",
        message: "Uncaught route error",
        requestId: null,
      }),
    );
  });

  it("caps oversized and non-string input", async () => {
    await reportRouteError({
      message: "x".repeat(50_000),
      digest: { evil: true } as unknown as string,
      name: "n".repeat(500),
    });

    const call = recordAppError.mock.calls[0]?.[0] as {
      message: string;
      code: string;
      requestId: string | null;
    };
    expect(call.message).toHaveLength(1000);
    expect(call.code).toHaveLength(120);
    expect(call.requestId).toBeNull();
  });

  it("rate limits per client IP", async () => {
    for (let i = 0; i < 25; i += 1) {
      await reportRouteError({ message: `boom ${i}` });
    }
    expect(recordAppError).toHaveBeenCalledTimes(20);
  });
});
