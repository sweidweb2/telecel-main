import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getErrorLogPage } from "@/data/app-errors";
import type { StaffSession } from "@/data/auth";
import { ERROR_LOG_PAGE_SIZE } from "@/validations/app-errors";

type Chain = {
  select: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  range: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
  then: (
    onFulfilled: (value: unknown) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise<unknown>;
};

function createChain(result: {
  data: unknown;
  count: number | null;
  error: { message: string } | null;
}): Chain {
  const chain = {} as Chain;
  chain.select = vi.fn(() => chain);
  chain.order = vi.fn(() => chain);
  chain.range = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.or = vi.fn(() => chain);
  chain.then = (onFulfilled, onRejected) =>
    Promise.resolve(result).then(onFulfilled, onRejected);
  return chain;
}

describe("getErrorLogPage", () => {
  const fromMock = vi.fn();
  const session = {
    supabase: { from: fromMock },
  } as unknown as StaffSession;

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("filters by severity when not all", async () => {
    const chain = createChain({ data: [], count: 0, error: null });
    fromMock.mockReturnValue(chain);

    await getErrorLogPage(session, {
      page: 1,
      search: "",
      severity: "error",
      pageSize: ERROR_LOG_PAGE_SIZE,
    });

    expect(fromMock).toHaveBeenCalledWith("app_errors");
    expect(chain.eq).toHaveBeenCalledWith("severity", "error");
    expect(chain.or).not.toHaveBeenCalled();
  });

  it("applies search and skips severity filter for all", async () => {
    const chain = createChain({
      data: [
        {
          id: 9,
          created_at: "2026-10-27T00:00:00.000Z",
          severity: "warning",
          source: "actions.blogs.updateBlog",
          message: "failed",
          actor: null,
        },
      ],
      count: 1,
      error: null,
    });
    fromMock.mockReturnValue(chain);

    const list = await getErrorLogPage(session, {
      page: 1,
      search: "blogs",
      severity: "all",
      pageSize: ERROR_LOG_PAGE_SIZE,
    });

    expect(chain.eq).not.toHaveBeenCalled();
    expect(chain.or).toHaveBeenCalledWith(
      "source.ilike.%blogs%,message.ilike.%blogs%,code.ilike.%blogs%",
    );
    expect(list.totalPages).toBe(1);
    expect(list.rows[0]?.source).toBe("actions.blogs.updateBlog");
  });

  it("throws on supabase error", async () => {
    const chain = createChain({
      data: null,
      count: null,
      error: { message: "denied" },
    });
    fromMock.mockReturnValue(chain);

    await expect(
      getErrorLogPage(session, {
        page: 1,
        search: "",
        severity: "all",
        pageSize: ERROR_LOG_PAGE_SIZE,
      }),
    ).rejects.toEqual({ message: "denied" });
  });
});
