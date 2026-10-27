import { describe, expect, it } from "vitest";

import {
  maintenanceFlagsSchema,
  parseMaintenanceFlags,
} from "@/validations/site-settings";

describe("maintenanceFlagsSchema", () => {
  it("passes level1 alone", () => {
    expect(maintenanceFlagsSchema.parse({ level1: true, level2: false })).toEqual({
      level1: true,
      level2: false,
    });
  });

  it("forces level1 when level2 is on", () => {
    expect(maintenanceFlagsSchema.parse({ level1: false, level2: true })).toEqual({
      level1: true,
      level2: true,
    });
  });
});

describe("parseMaintenanceFlags", () => {
  it("returns defaults for garbage", () => {
    expect(parseMaintenanceFlags(null)).toEqual({ level1: false, level2: false });
    expect(parseMaintenanceFlags({ level1: "yes" })).toEqual({
      level1: false,
      level2: false,
    });
  });

  it("parses valid jsonb", () => {
    expect(parseMaintenanceFlags({ level1: true, level2: false })).toEqual({
      level1: true,
      level2: false,
    });
  });
});
