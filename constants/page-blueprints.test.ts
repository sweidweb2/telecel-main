import { describe, expect, it } from "vitest";

import {
  ALL_PAGE_BLUEPRINTS,
  SERVICE_PILLAR_BLUEPRINTS,
  blueprintPathForSlug,
  blueprintSlug,
  blueprintStaticParams,
  getBlueprintByPath,
  requireBlueprint,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

describe("page blueprint registry", () => {
  it("indexes every blueprint by unique path", () => {
    const paths = ALL_PAGE_BLUEPRINTS.map((blueprint) => blueprint.path);
    expect(new Set(paths).size).toBe(paths.length);

    for (const blueprint of ALL_PAGE_BLUEPRINTS) {
      expect(getBlueprintByPath(blueprint.path)).toEqual(blueprint);
    }
  });

  it("builds hub child paths and static params", () => {
    expect(blueprintPathForSlug(ROUTES.services, "cybersecurity")).toBe(
      "/services/cybersecurity",
    );
    expect(blueprintSlug("/services/cybersecurity", ROUTES.services)).toBe(
      "cybersecurity",
    );
    expect(
      blueprintStaticParams(SERVICE_PILLAR_BLUEPRINTS, ROUTES.services),
    ).toEqual(
      SERVICE_PILLAR_BLUEPRINTS.map((blueprint) => ({
        slug: blueprintSlug(blueprint.path, ROUTES.services),
      })),
    );
  });

  it("requireBlueprint throws for unknown paths", () => {
    expect(() => requireBlueprint("/not-a-real-page")).toThrow(
      /Missing page blueprint/,
    );
  });
});
