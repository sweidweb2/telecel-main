import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearMaintenanceProxyCache,
  isLoginBlocked,
  isMaintenanceForceOff,
  isPublicBlocked,
  resolveMaintenanceFlags,
} from "@/lib/maintenance";

describe("resolveMaintenanceFlags", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    clearMaintenanceProxyCache();
  });

  it("forces level1 when level2 is on", () => {
    expect(resolveMaintenanceFlags({ level1: false, level2: true })).toEqual({
      level1: true,
      level2: true,
    });
  });

  it("respects MAINTENANCE_FORCE_OFF", () => {
    vi.stubEnv("MAINTENANCE_FORCE_OFF", "1");
    expect(isMaintenanceForceOff()).toBe(true);
    expect(resolveMaintenanceFlags({ level1: true, level2: true })).toEqual({
      level1: false,
      level2: false,
    });
    expect(isLoginBlocked({ level1: true, level2: true })).toBe(false);
    expect(isPublicBlocked({ level1: true, level2: true })).toBe(false);
  });

  it("reports login vs public blocks", () => {
    expect(isLoginBlocked({ level1: true, level2: false })).toBe(true);
    expect(isPublicBlocked({ level1: true, level2: false })).toBe(false);
    expect(isPublicBlocked({ level1: true, level2: true })).toBe(true);
  });
});
