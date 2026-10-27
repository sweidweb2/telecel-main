import { describe, expect, it } from "vitest";

import {
  ADMIN_LIST_PAGE_SIZE,
  parseAdminListQuery,
  parseAdminPageSize,
  sanitizedSearchSchema,
  USER_LIST_PAGE_SIZE,
} from "@/validations/admin-list-query";

describe("parseAdminListQuery", () => {
  it("defaults page, empty search, and default page size", () => {
    expect(parseAdminListQuery({})).toEqual({
      page: 1,
      search: "",
      pageSize: ADMIN_LIST_PAGE_SIZE,
    });
  });

  it("parses page, search, and allowed limit", () => {
    expect(
      parseAdminListQuery({ page: "3", search: "  publish  ", limit: "50" }),
    ).toEqual({
      page: 3,
      search: "publish",
      pageSize: 50,
    });
  });

  it("falls back on invalid page or limit", () => {
    expect(parseAdminListQuery({ page: "0" }).page).toBe(1);
    expect(parseAdminListQuery({ page: "nope" }).page).toBe(1);
    expect(parseAdminListQuery({ limit: "999" }).pageSize).toBe(
      ADMIN_LIST_PAGE_SIZE,
    );
  });

  it("accepts a table-specific default page size", () => {
    expect(parseAdminListQuery({}, USER_LIST_PAGE_SIZE).pageSize).toBe(
      USER_LIST_PAGE_SIZE,
    );
  });
});

describe("parseAdminPageSize", () => {
  it("only allows 10, 20, or 50", () => {
    expect(parseAdminPageSize("10")).toBe(10);
    expect(parseAdminPageSize("20")).toBe(20);
    expect(parseAdminPageSize("50")).toBe(50);
    expect(parseAdminPageSize("25", 10)).toBe(10);
  });
});

describe("sanitizedSearchSchema", () => {
  it("strips PostgREST filter metacharacters", () => {
    expect(sanitizedSearchSchema.parse("a,b")).toBe("");
    expect(sanitizedSearchSchema.parse("a(b)")).toBe("");
    expect(sanitizedSearchSchema.parse("x%y")).toBe("");
  });
});
