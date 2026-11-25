import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearMaintenanceProxyCache,
  isAdminClaim,
  isMaintenanceActive,
  isMaintenanceForceOff,
  resolveMaintenanceMode,
} from "@/lib/maintenance";

describe("resolveMaintenanceMode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    clearMaintenanceProxyCache();
  });

  it("passes through off and full", () => {
    expect(resolveMaintenanceMode("off")).toBe("off");
    expect(resolveMaintenanceMode("full")).toBe("full");
    expect(isMaintenanceActive("off")).toBe(false);
    expect(isMaintenanceActive("full")).toBe(true);
  });

  it("respects MAINTENANCE_FORCE_OFF", () => {
    vi.stubEnv("MAINTENANCE_FORCE_OFF", "1");
    expect(isMaintenanceForceOff()).toBe(true);
    expect(resolveMaintenanceMode("full")).toBe("off");
    expect(isMaintenanceActive("full")).toBe(false);
  });

  it("reads admin from JWT app_metadata", () => {
    expect(isAdminClaim({ app_metadata: { app_role: "admin" } })).toBe(true);
    expect(isAdminClaim({ app_metadata: { app_role: "editor" } })).toBe(false);
    expect(isAdminClaim({ app_metadata: {} })).toBe(false);
    expect(isAdminClaim(null)).toBe(false);
  });
});

describe("reportMaintenanceFetchFailure", () => {
  afterEach(() => {
    clearMaintenanceProxyCache();
  });

  it("throttles failure logging to once per interval", async () => {
    const { reportMaintenanceFetchFailure } = await import("@/lib/maintenance");
    const t0 = 1_000_000_000;
    expect(reportMaintenanceFetchFailure("HTTP 500", t0)).toBe(true);
    expect(reportMaintenanceFetchFailure("HTTP 500", t0 + 1_000)).toBe(false);
    expect(reportMaintenanceFetchFailure("HTTP 500", t0 + 5 * 60 * 1000)).toBe(
      true,
    );
  });
});
