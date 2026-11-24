import { describe, expect, it } from "vitest";

import {
  ACTIVITY_LOG_PAGE_SIZE,
  endOfDayExclusive,
  hasActivityFilters,
  parseActivityLogQuery,
  setActivityFilterParams,
} from "@/validations/audit-log";

describe("parseActivityLogQuery", () => {
  it("defaults page and empty search", () => {
    expect(parseActivityLogQuery({})).toEqual({
      page: 1,
      search: "",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
      action: "",
      entity: "",
      actor: "",
      from: "",
      to: "",
    });
  });

  it("parses page, search, and limit", () => {
    expect(
      parseActivityLogQuery({ page: "3", search: "  publish  ", limit: "10" }),
    ).toEqual({
      page: 3,
      search: "publish",
      pageSize: 10,
      action: "",
      entity: "",
      actor: "",
      from: "",
      to: "",
    });
  });

  it("falls back on invalid page", () => {
    expect(parseActivityLogQuery({ page: "0" }).page).toBe(1);
    expect(parseActivityLogQuery({ page: "nope" }).page).toBe(1);
  });

  it("strips search values with PostgREST filter metacharacters", () => {
    expect(parseActivityLogQuery({ search: "a,b" }).search).toBe("");
    expect(parseActivityLogQuery({ search: "a(b)" }).search).toBe("");
  });

  it("parses action, entity, actor, and date filters", () => {
    expect(
      parseActivityLogQuery({
        action: "sign_in",
        entity: "auth",
        actor: " ana ",
        from: "2026-11-01",
        to: "2026-11-30",
      }),
    ).toMatchObject({
      action: "sign_in",
      entity: "auth",
      actor: "ana",
      from: "2026-11-01",
      to: "2026-11-30",
    });
  });

  it("drops invalid filter values and swaps reversed dates", () => {
    const query = parseActivityLogQuery({
      action: "DROP TABLE",
      entity: "a,b",
      actor: "x(y",
      from: "2026-12-01",
      to: "2026-11-01",
    });
    expect(query).toMatchObject({ action: "", entity: "", actor: "" });
    expect(query.from).toBe("2026-11-01");
    expect(query.to).toBe("2026-12-01");
    expect(parseActivityLogQuery({ from: "yesterday" }).from).toBe("");
  });

  it("detects active filters and serialises them", () => {
    const query = parseActivityLogQuery({ entity: "blog", to: "2026-11-02" });
    expect(hasActivityFilters(query)).toBe(true);
    expect(hasActivityFilters(parseActivityLogQuery({}))).toBe(false);
    const params = new URLSearchParams();
    setActivityFilterParams(params, query);
    expect(params.toString()).toBe("entity=blog&to=2026-11-02");
    expect(endOfDayExclusive("2026-12-31")).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("actor search escaping", () => {
  it("keeps underscores and escapes them for ILIKE", async () => {
    const { escapeIlikeTerm } = await import("@/validations/audit-log");
    const query = parseActivityLogQuery({ actor: "jane_doe@example.com" });
    expect(query.actor).toBe("jane_doe@example.com");
    expect(escapeIlikeTerm(query.actor)).toBe("jane\\_doe@example.com");
    expect(escapeIlikeTerm("100%")).toBe("100\\%");
  });

  it("still rejects PostgREST-unsafe characters", () => {
    expect(parseActivityLogQuery({ actor: "a,b" }).actor).toBe("");
    expect(parseActivityLogQuery({ actor: "a(b)" }).actor).toBe("");
  });
});
