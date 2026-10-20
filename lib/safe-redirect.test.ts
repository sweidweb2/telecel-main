import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/safe-redirect";

describe("safeRedirectPath", () => {
  it("keeps allowed in-app destinations", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("/dashboard/users?page=2#top")).toBe(
      "/dashboard/users?page=2#top"
    );
    expect(safeRedirectPath("/update-password")).toBe("/update-password");
  });

  it("falls back for missing or non-path values", () => {
    expect(safeRedirectPath(undefined)).toBe("/dashboard");
    expect(safeRedirectPath("")).toBe("/dashboard");
    expect(safeRedirectPath("dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("https://evil.example")).toBe("/dashboard");
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/dashboard");
  });

  it("rejects protocol-relative and backslash tricks", () => {
    for (const value of [
      "//evil.example",
      "/\\evil.example",
      "/%5Cevil.example",
      "/%2F%2Fevil.example",
      "%2F%2Fevil.example",
      "/\tevil",
      "/%09/evil.example",
    ]) {
      expect(safeRedirectPath(value), value).toBe("/dashboard");
    }
  });

  it("rejects paths outside the allowed areas", () => {
    expect(safeRedirectPath("/login")).toBe("/dashboard");
    expect(safeRedirectPath("/dashboardx")).toBe("/dashboard");
    expect(safeRedirectPath("/dashboard/../login")).toBe("/dashboard");
  });

  it("uses the provided fallback", () => {
    expect(safeRedirectPath("//evil", "/update-password")).toBe(
      "/update-password"
    );
  });
});
