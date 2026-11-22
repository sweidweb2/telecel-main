import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
} from "@/lib/format";

describe("format", () => {
  it("formats dates and currency for en-GB", () => {
    expect(formatDate("2026-11-13T12:00:00.000Z")).toMatch(/13 Nov 2026/);
    expect(formatDateTime("2026-11-13T12:00:00.000Z")).toMatch(/13 Nov 2026/);
    expect(formatCurrency(12.5)).toMatch(/£12\.50/);
    expect(formatNumber(1200)).toBe("1,200");
  });

  it("keeps date-only ISO strings on the calendar day", () => {
    expect(formatDate("2026-11-13")).toBe("13 Nov 2026");
  });

  it("returns em dash for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("—");
  });
});
