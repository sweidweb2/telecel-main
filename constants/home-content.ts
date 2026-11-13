import { SERVICE_PILLAR_PAGES } from "@/constants/marketing-pages";

export {
  PLATFORM_STAGES,
  type PlatformStage,
} from "@/constants/platform-stages";

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

/** RFQ §3 order — derived from the slim marketing catalog (voice & messaging last). */
export const SERVICE_PILLARS = SERVICE_PILLAR_PAGES.map((pillar) => ({
  slug: pillar.slug,
  title: pillar.title,
}));
