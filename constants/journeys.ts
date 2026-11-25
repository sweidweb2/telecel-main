import type {
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
  USE_CASE_PAGES,
} from "@/constants/marketing-pages";

type PillarSlug = (typeof SERVICE_PILLAR_PAGES)[number]["slug"];
type SolutionSlug = (typeof SOLUTION_PAGES)[number]["slug"];
type UseCaseSlug = (typeof USE_CASE_PAGES)[number]["slug"];

/** How a buyer or outcome page routes into services and the inquiry form. */
export type Journey = {
  /** Service pillars in priority order. */
  pillars: readonly PillarSlug[];
  ctaLabel: string;
  /** Related use cases (solutions) or audiences (use cases). */
  related: readonly string[];
};

/** DESIGN.md: operator/carrier pages say "Discuss interconnection". */
export const SOLUTION_JOURNEYS: Record<
  SolutionSlug,
  Journey & { related: readonly UseCaseSlug[] }
> = {
  "mobile-operators": {
    pillars: [
      "interactions-voice-messaging",
      "network-enterprise-connectivity",
      "iot-digital-services",
    ],
    ctaLabel: "Discuss interconnection",
    related: [
      "grow-international-revenue",
      "secure-messaging-traffic",
      "launch-new-digital-services",
    ],
  },
  enterprises: {
    pillars: [
      "cloud-data-centre",
      "cybersecurity",
      "network-enterprise-connectivity",
      "interactions-voice-messaging",
    ],
    ctaLabel: "Request a quote",
    related: [
      "scale-across-markets",
      "modernize-customer-engagement",
      "build-resilient-infrastructure",
    ],
  },
  "governments-institutions": {
    pillars: [
      "cybersecurity",
      "cloud-data-centre",
      "network-enterprise-connectivity",
    ],
    ctaLabel: "Talk to Sales",
    related: ["build-resilient-infrastructure", "scale-across-markets"],
  },
  "wholesale-aggregators": {
    pillars: [
      "interactions-voice-messaging",
      "network-enterprise-connectivity",
    ],
    ctaLabel: "Discuss interconnection",
    related: ["grow-international-revenue", "secure-messaging-traffic"],
  },
};

export const USE_CASE_JOURNEYS: Record<
  UseCaseSlug,
  Journey & { related: readonly SolutionSlug[] }
> = {
  "grow-international-revenue": {
    pillars: [
      "interactions-voice-messaging",
      "network-enterprise-connectivity",
      "iot-digital-services",
    ],
    ctaLabel: "Talk to Sales",
    related: ["mobile-operators", "wholesale-aggregators"],
  },
  "modernize-customer-engagement": {
    pillars: ["interactions-voice-messaging", "cloud-data-centre"],
    ctaLabel: "Talk to Sales",
    related: ["enterprises", "mobile-operators"],
  },
  "secure-messaging-traffic": {
    pillars: ["interactions-voice-messaging", "cybersecurity"],
    ctaLabel: "Talk to Sales",
    related: ["mobile-operators", "wholesale-aggregators"],
  },
  "scale-across-markets": {
    pillars: ["network-enterprise-connectivity", "cloud-data-centre"],
    ctaLabel: "Talk to Sales",
    related: ["enterprises", "governments-institutions"],
  },
  "build-resilient-infrastructure": {
    pillars: [
      "cloud-data-centre",
      "cybersecurity",
      "network-enterprise-connectivity",
    ],
    ctaLabel: "Talk to Sales",
    related: ["enterprises", "governments-institutions"],
  },
  "launch-new-digital-services": {
    pillars: ["iot-digital-services", "cloud-data-centre"],
    ctaLabel: "Talk to Sales",
    related: ["mobile-operators", "enterprises"],
  },
};

export function contactHref(
  area?: PillarSlug,
  intent: "sales" | "demo" = "sales",
): string {
  const params = new URLSearchParams({ intent });
  if (area) params.set("area", area);
  return `/contact?${params}`;
}
