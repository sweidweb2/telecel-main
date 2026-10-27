import { describe, expect, it } from "vitest";

import {
  ACTIVITY_LOG_PAGE_SIZE,
  parseActivityLogQuery,
} from "@/validations/audit-log";

describe("parseActivityLogQuery", () => {
  it("defaults page and empty search", () => {
    expect(parseActivityLogQuery({})).toEqual({
      page: 1,
      search: "",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
    });
  });

  it("parses page and trims search", () => {
    expect(
      parseActivityLogQuery({ page: "3", search: "  publish  " }),
    ).toEqual({
      page: 3,
      search: "publish",
      pageSize: ACTIVITY_LOG_PAGE_SIZE,
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
});
