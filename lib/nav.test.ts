import { describe, expect, it } from "vitest";

import { isNavActive } from "@/lib/nav";

describe("isNavActive", () => {
  it("matches exact and nested paths", () => {
    expect(isNavActive("/services", "/services")).toBe(true);
    expect(isNavActive("/services/cybersecurity", "/services")).toBe(true);
    expect(isNavActive("/solutions", "/services")).toBe(false);
  });
});
