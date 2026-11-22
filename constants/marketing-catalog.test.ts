import { describe, expect, it } from "vitest";

import { INSIGHT_CATEGORIES } from "@/constants/blog-categories";
import { HOME_HERO } from "@/constants/home-content";
import {
  PLATFORM_FLOW_LINKS,
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  marketingChildPath,
} from "@/constants/marketing-pages";
import {
  HOME_BLUEPRINT,
  SERVICES_HUB_BLUEPRINT,
} from "@/constants/page-blueprints";
import { PLATFORM_STAGES } from "@/constants/platform-stages";
import { ROUTES } from "@/constants/routes";
import { SERVICES_HERO } from "@/constants/services-hero";
import { SITE_LEGAL_LINKS, SITE_NAV } from "@/constants/site-nav";

describe("marketing catalog sync", () => {
  it("keeps Connect→Optimize ids aligned across stages and nav anchors", () => {
    expect(PLATFORM_FLOW_LINKS.map((link) => link.id)).toEqual(
      PLATFORM_STAGES.map((stage) => stage.key),
    );
    expect(PLATFORM_FLOW_LINKS.map((link) => link.label)).toEqual(
      PLATFORM_STAGES.map((stage) => stage.title),
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

  it("maps service-scoped insight tabs onto service pillar slugs", () => {
    const pillarSlugs = new Set(SERVICE_PILLAR_PAGES.map((page) => page.slug));

    for (const category of INSIGHT_CATEGORIES) {
      if (category.pillarSlug === null) {
        expect(category.id).toBe("company-news");
        continue;
      }
      expect(pillarSlugs.has(category.pillarSlug)).toBe(true);
    }

    expect(
      INSIGHT_CATEGORIES.filter((category) => category.pillarSlug !== null),
    ).toHaveLength(SERVICE_PILLAR_PAGES.length);
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

    // Legal stubs stay out of sitemap until approved copy ships.
    expect(SITE_LEGAL_LINKS.every((link) => !link.live)).toBe(true);

    const liveHrefs = SITE_NAV.flatMap((section) => [
      ...(section.live ? [section.href] : []),
      ...(section.children ?? [])
        .filter((child) => child.live)
        .map((child) => child.href),
    ]);
    expect(liveHrefs).toEqual([
      ROUTES.home,
      ROUTES.platform,
      ROUTES.platform,
      ROUTES.services,
      ROUTES.insights,
      ROUTES.insights,
    ]);
    expect(liveHrefs).not.toContain(ROUTES.caseStudies);
    expect(liveHrefs).not.toContain(ROUTES.solutions);
  });
});
