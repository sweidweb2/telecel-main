import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getActivityLogPage } from "@/data/audit-log";
import type { StaffSession } from "@/data/auth";
import { ACTIVITY_LOG_PAGE_SIZE } from "@/validations/audit-log";

const NO_FILTERS = { action: "", entity: "", actor: "", from: "", to: "" };

type Chain = {
  select: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  range: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  gte: ReturnType<typeof vi.fn>;
  lt: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
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
  chain.or = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.gte = vi.fn(() => chain);
  chain.lt = vi.fn(() => chain);
  chain.in = vi.fn(() => chain);
  chain.limit = vi.fn(() => chain);
  chain.then = (onFulfilled, onRejected) =>
    Promise.resolve(result).then(onFulfilled, onRejected);
  return chain;
}

describe("getActivityLogPage", () => {
  const fromMock = vi.fn();
  const session = {
    supabase: { from: fromMock },
  } as unknown as StaffSession;

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("pages results and maps totalPages", async () => {
    const chain = createChain({
      data: [
        {
          id: 1,
          action: "create",
          entity_type: "blog",
          entity_id: "abc",
          created_at: "2026-10-27T00:00:00.000Z",
          actor: null,
        },
      ],
      count: 45,
      error: null,
    });
    fromMock.mockReturnValue(chain);

    const list = await getActivityLogPage(session, {
      page: 2,
      search: "",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
      ...NO_FILTERS,
    });

    expect(fromMock).toHaveBeenCalledWith("audit_log");
    expect(chain.range).toHaveBeenCalledWith(20, 39);
    expect(chain.or).not.toHaveBeenCalled();
    expect(list.total).toBe(45);
    expect(list.totalPages).toBe(3);
    expect(list.rows).toHaveLength(1);
  });

  it("applies search filter when present", async () => {
    const chain = createChain({ data: [], count: 0, error: null });
    fromMock.mockReturnValue(chain);

    await getActivityLogPage(session, {
      page: 1,
      search: "publish",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
      ...NO_FILTERS,
    });

    expect(chain.or).toHaveBeenCalledWith(
      "action.ilike.%publish%,entity_type.ilike.%publish%,entity_id.ilike.%publish%",
    );
  });

  it("throws on supabase error", async () => {
    const chain = createChain({
      data: null,
      count: null,
      error: { message: "boom" },
    });
    fromMock.mockReturnValue(chain);

    await expect(
      getActivityLogPage(session, {
        page: 1,
        search: "",
        pageSize: ACTIVITY_LOG_PAGE_SIZE,
        ...NO_FILTERS,
      }),
    ).rejects.toEqual({ message: "boom" });
  });

  it("applies action, entity, and date range filters", async () => {
    const chain = createChain({ data: [], count: 0, error: null });
    fromMock.mockReturnValue(chain);

    await getActivityLogPage(session, {
      page: 1,
      search: "",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
      ...NO_FILTERS,
      action: "sign_in",
      entity: "auth",
      from: "2026-11-01",
      to: "2026-11-30",
    });

    expect(chain.eq).toHaveBeenCalledWith("action", "sign_in");
    expect(chain.eq).toHaveBeenCalledWith("entity_type", "auth");
    expect(chain.gte).toHaveBeenCalledWith(
      "created_at",
      "2026-11-01T00:00:00Z",
    );
    expect(chain.lt).toHaveBeenCalledWith(
      "created_at",
      "2026-12-01T00:00:00.000Z",
    );
  });

  it("resolves actor filter to profile ids", async () => {
    const logChain = createChain({ data: [], count: 0, error: null });
    const profileChain = createChain({
      data: [{ id: "u1" }],
      count: null,
      error: null,
    });
    fromMock.mockImplementation((table: string) =>
      table === "profiles" ? profileChain : logChain,
    );

    await getActivityLogPage(session, {
      page: 1,
      search: "",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
      ...NO_FILTERS,
      actor: "ana",
    });

    expect(profileChain.or).toHaveBeenCalledWith(
      "email.ilike.%ana%,full_name.ilike.%ana%",
    );
    expect(logChain.in).toHaveBeenCalledWith("actor_id", ["u1"]);
  });

  it("returns empty when no actor matches", async () => {
    const logChain = createChain({ data: [{ id: 1 }], count: 1, error: null });
    const profileChain = createChain({ data: [], count: null, error: null });
    fromMock.mockImplementation((table: string) =>
      table === "profiles" ? profileChain : logChain,
    );

    const list = await getActivityLogPage(session, {
      page: 1,
      search: "",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
      ...NO_FILTERS,
      actor: "nobody",
    });

    expect(list).toEqual({ rows: [], total: 0, totalPages: 1 });
  });
});
