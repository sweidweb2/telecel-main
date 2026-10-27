import { describe, expect, it } from "vitest";

import {
  maintenanceModeSchema,
  parseMaintenanceMode,
} from "@/validations/site-settings";

describe("maintenanceModeSchema", () => {
  it("accepts off and full", () => {
    expect(maintenanceModeSchema.parse("off")).toBe("off");
    expect(maintenanceModeSchema.parse("full")).toBe("full");
  });
});

describe("parseMaintenanceMode", () => {
  it("returns off for garbage", () => {
    expect(parseMaintenanceMode(null)).toBe("off");
    expect(parseMaintenanceMode({ mode: "yes" })).toBe("off");
    expect(parseMaintenanceMode({ level1: "yes" })).toBe("off");
  });

  it("parses current jsonb shape", () => {
    expect(parseMaintenanceMode({ mode: "full" })).toBe("full");
    expect(parseMaintenanceMode({ mode: "off" })).toBe("off");
  });

  it("maps legacy level2 to full; level1-only to off", () => {
    expect(parseMaintenanceMode({ level1: true, level2: true })).toBe("full");
    expect(parseMaintenanceMode({ level1: false, level2: true })).toBe("full");
    expect(parseMaintenanceMode({ level1: true, level2: false })).toBe("off");
  });
});
