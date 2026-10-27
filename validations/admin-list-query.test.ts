import { describe, expect, it } from "vitest";

import {
  ADMIN_LIST_PAGE_SIZE,
  parseAdminListQuery,
  sanitizedSearchSchema,
} from "@/validations/admin-list-query";

describe("parseAdminListQuery", () => {
  it("defaults page and empty search", () => {
    expect(parseAdminListQuery({})).toEqual({
      page: 1,
      search: "",
      pageSize: ADMIN_LIST_PAGE_SIZE,
    });
  });

  it("parses page and trims search", () => {
    expect(
      parseAdminListQuery({ page: "3", search: "  publish  " }),
    ).toEqual({
      page: 3,
      search: "publish",
      pageSize: ADMIN_LIST_PAGE_SIZE,
    });
  });

  it("falls back on invalid page", () => {
    expect(parseAdminListQuery({ page: "0" }).page).toBe(1);
    expect(parseAdminListQuery({ page: "nope" }).page).toBe(1);
  });
});

describe("sanitizedSearchSchema", () => {
  it("strips PostgREST filter metacharacters", () => {
    expect(sanitizedSearchSchema.parse("a,b")).toBe("");
    expect(sanitizedSearchSchema.parse("a(b)")).toBe("");
    expect(sanitizedSearchSchema.parse("x%y")).toBe("");
  });
});
