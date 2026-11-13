import {
  SERVICE_PILLAR_BLUEPRINTS,
  blueprintSlug,
} from "@/constants/page-blueprints";
import { ROUTES } from "@/constants/routes";

/**
 * PROVISIONAL home copy — structure from the RFQ §3 sitemap; every sentence
 * must be replaced by the approved Telecel Global Text Pack before launch
 * (RFQ §4.3: no unsupported claims, metrics, customers or coverage).
 * Kept here so the CMS "Pages" section can take it over later.
 */

export const HOME_HERO = {
  eyebrow: "Telecel Global",
  title: "One partner for international connectivity and digital services",
  body: "Telecel Global brings networks, cloud, security, IoT and messaging together on one B2B platform for operators, enterprises and institutions.",
} as const;

/** RFQ §3 order — derived from service pillar blueprints (voice & messaging last). */
export const SERVICE_PILLARS = SERVICE_PILLAR_BLUEPRINTS.map((pillar) => ({
  slug: blueprintSlug(pillar.path, ROUTES.services),
  title: pillar.title,
}));

export const PLATFORM_STAGES = [
  {
    key: "connect",
    title: "Connect",
    summary: "Bring networks, enterprises and partners onto one platform.",
  },
  {
    key: "orchestrate",
    title: "Orchestrate",
    summary:
      "Coordinate services and partners through a single operating layer.",
  },
  {
    key: "deliver",
    title: "Deliver",
    summary: "Put connectivity and digital services in customers’ hands.",
  },
  {
    key: "monitor",
    title: "Monitor",
    summary: "Keep sight of service quality and security as it runs.",
  },
  {
    key: "optimize",
    title: "Optimize",
    summary: "Refine cost, reliability and reach as needs change.",
  },
] as const;
