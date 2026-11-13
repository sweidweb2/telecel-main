import { describe, expect, it } from "vitest";

import {
  LEGAL_PAGES,
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  USE_CASE_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  ALL_PAGE_BLUEPRINTS,
  LEGAL_BLUEPRINTS,
  SERVICE_PILLAR_BLUEPRINTS,
  SOLUTION_BLUEPRINTS,
  USE_CASE_BLUEPRINTS,
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
      SERVICE_PILLAR_PAGES.map((page) => ({
        slug: page.slug,
      })),
    );
  });

  it("keeps family blueprints aligned with the slim marketing catalog", () => {
    expect(
      SERVICE_PILLAR_BLUEPRINTS.map((blueprint) => ({
        path: blueprint.path,
        title: blueprint.title,
      })),
    ).toEqual(
      SERVICE_PILLAR_PAGES.map((page) => ({
        path: marketingChildPath(ROUTES.services, page.slug),
        title: page.title,
      })),
    );

    expect(
      SOLUTION_BLUEPRINTS.map((blueprint) => ({
        path: blueprint.path,
        title: blueprint.title,
      })),
    ).toEqual(
      SOLUTION_PAGES.map((page) => ({
        path: marketingChildPath(ROUTES.solutions, page.slug),
        title: page.title,
      })),
    );

    expect(
      USE_CASE_BLUEPRINTS.map((blueprint) => ({
        path: blueprint.path,
        title: blueprint.title,
      })),
    ).toEqual(
      USE_CASE_PAGES.map((page) => ({
        path: marketingChildPath(ROUTES.useCases, page.slug),
        title: page.title,
      })),
    );

    expect(
      LEGAL_BLUEPRINTS.map((blueprint) => ({
        path: blueprint.path,
        title: blueprint.title,
      })),
    ).toEqual(
      LEGAL_PAGES.map((page) => ({
        path: page.path,
        title: page.title,
      })),
    );
  });

  it("requireBlueprint throws for unknown paths", () => {
    expect(() => requireBlueprint("/not-a-real-page")).toThrow(
      /Missing page blueprint/,
    );
  });
});
