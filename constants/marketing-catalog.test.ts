import { describe, expect, it } from "vitest";

import { HOME_HERO } from "@/constants/home-content";
import {
  PLATFORM_FLOW_LINKS,
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  HOME_BLUEPRINT,
  PLATFORM_BLUEPRINT,
  SERVICES_HUB_BLUEPRINT,
} from "@/constants/page-blueprints";
import { PLATFORM_STAGES } from "@/constants/platform-stages";
import { ROUTES } from "@/constants/routes";
import { SERVICES_HERO } from "@/constants/services-hero";
import { SITE_LEGAL_LINKS, SITE_NAV } from "@/constants/site-nav";

describe("marketing catalog sync", () => {
  it("keeps Connect→Optimize ids aligned across stages, nav, and platform blueprint", () => {
    expect(PLATFORM_FLOW_LINKS.map((link) => link.id)).toEqual(
      PLATFORM_STAGES.map((stage) => stage.key),
    );
    expect(PLATFORM_FLOW_LINKS.map((link) => link.label)).toEqual(
      PLATFORM_STAGES.map((stage) => stage.title),
    );

    const flowSections = PLATFORM_BLUEPRINT.sections.filter((section) =>
      PLATFORM_STAGES.some((stage) => stage.key === section.id),
    );
    expect(flowSections.map((section) => section.id)).toEqual(
      PLATFORM_STAGES.map((stage) => stage.key),
    );
  });

  it("keeps home and services blueprint copy aligned with live heroes", () => {
    expect(HOME_BLUEPRINT.title).toBe(HOME_HERO.title);
    expect(HOME_BLUEPRINT.description).toBe(HOME_HERO.body);
    expect(SERVICES_HUB_BLUEPRINT.title).toBe(
      SERVICES_HERO.headline.replace(/\n/g, " "),
    );
    expect(SERVICES_HUB_BLUEPRINT.description).toBe(SERVICES_HERO.subtext);
  });

  it("keeps site-nav children on the slim marketing catalog", () => {
    const services = SITE_NAV.find(
      (section) => section.href === ROUTES.services,
    );
    expect(services?.children?.map((child) => child.href)).toEqual(
      SERVICE_PILLAR_PAGES.map((page) =>
        marketingChildPath(ROUTES.services, page.slug),
      ),
    );

    const solutions = SITE_NAV.find(
      (section) => section.href === ROUTES.solutions,
    );
    expect(solutions?.children?.map((child) => child.href)).toEqual(
      SOLUTION_PAGES.map((page) =>
        marketingChildPath(ROUTES.solutions, page.slug),
      ),
    );

    expect(SITE_LEGAL_LINKS.every((link) => link.live)).toBe(true);
  });
});
