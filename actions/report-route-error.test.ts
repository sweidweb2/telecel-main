import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const recordAppError = vi.fn(async (_input?: unknown) => undefined);

vi.mock("@/actions/observability", () => ({
  recordAppError: (input: unknown) => recordAppError(input),
}));

import { reportRouteError } from "@/actions/report-route-error";

describe("reportRouteError", () => {
  beforeEach(() => {
    recordAppError.mockClear();
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
});
