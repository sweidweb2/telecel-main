import { describe, expect, it } from "vitest";

import {
  ERROR_LOG_PAGE_SIZE,
  parseErrorLogQuery,
} from "@/validations/app-errors";

describe("parseErrorLogQuery", () => {
  it("defaults page, search, and severity", () => {
    expect(parseErrorLogQuery({})).toEqual({
      page: 1,
      search: "",
      severity: "all",
      pageSize: ERROR_LOG_PAGE_SIZE,
    });
  });

  it("parses severity and search", () => {
    expect(
      parseErrorLogQuery({
        page: "2",
        search: " blogs ",
        severity: "warning",
      }),
    ).toEqual({
      page: 2,
      search: "blogs",
      severity: "warning",
      pageSize: ERROR_LOG_PAGE_SIZE,
    });
  });

  it("falls back on invalid severity", () => {
    expect(parseErrorLogQuery({ severity: "critical" }).severity).toBe("all");
  });

  it("strips search values with PostgREST filter metacharacters", () => {
    expect(parseErrorLogQuery({ search: "x%y" }).search).toBe("");
  });
});
