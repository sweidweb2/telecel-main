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
  PLATFORM_BLUEPRINT,
  SERVICE_PILLAR_BLUEPRINTS,
  SERVICES_HUB_BLUEPRINT,
  SOLUTION_BLUEPRINTS,
  USE_CASE_BLUEPRINTS,
  blueprintSlug,
  blueprintStaticParams,
  getBlueprintByPath,
  PRIVACY_BLUEPRINT,
} from "@/constants/page-blueprints";
import { PLATFORM_LAYERS } from "@/constants/platform-layers";
import { ROUTES } from "@/constants/routes";
import { SERVICE_OFFERS } from "@/constants/service-offers";
import { SERVICES_PROVIDE_CARDS } from "@/constants/services-provide";

describe("page blueprint registry", () => {
  it("indexes every blueprint by unique path", () => {
    const paths = ALL_PAGE_BLUEPRINTS.map((blueprint) => blueprint.path);
    expect(new Set(paths).size).toBe(paths.length);

    for (const blueprint of ALL_PAGE_BLUEPRINTS) {
      expect(getBlueprintByPath(blueprint.path)).toEqual(blueprint);
    }
  });

  it("builds hub child paths and static params", () => {
    expect(marketingChildPath(ROUTES.services, "cybersecurity")).toBe(
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
    expect(PRIVACY_BLUEPRINT.path).toBe(ROUTES.privacy);
  });

  it("keeps live hubs meta-only so routes own designed composition", () => {
    expect(PLATFORM_BLUEPRINT.sections).toBeUndefined();
    expect(SERVICES_HUB_BLUEPRINT.sections).toBeUndefined();
  });
});

describe("shared service offers", () => {
  it("keeps platform layers and provide cards on one catalog", () => {
    expect(PLATFORM_LAYERS.map((layer) => layer.title)).toEqual(
      SERVICE_OFFERS.map((offer) => offer.title),
    );
    expect(
      SERVICES_PROVIDE_CARDS.slice(0, SERVICE_OFFERS.length).map(
        (card) => card.title,
      ),
    ).toEqual(SERVICE_OFFERS.map((offer) => offer.title));
    expect(SERVICES_PROVIDE_CARDS).toHaveLength(SERVICE_OFFERS.length + 1);
  });
});
