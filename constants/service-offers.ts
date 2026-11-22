import {
  marketingChildPath,
  SERVICE_PILLAR_PAGES,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";

/**
 * Shared B2B offer catalog for the platform stack and services “What We Provide”
 * grid. Nav pillar landings (`SERVICE_PILLAR_PAGES`) keep RFQ titles separately.
 */

export type ServiceOfferIcon =
  "globe" | "message" | "cloud" | "chip" | "shield";

export type ServiceOfferIllustration =
  "wholesale" | "messaging" | "cloud" | "iot" | "cyber" | "analytics";

type PillarSlug = (typeof SERVICE_PILLAR_PAGES)[number]["slug"];

export type ServiceOffer = {
  key: string;
  title: string;
  tag: string;
  description: string;
  icon: ServiceOfferIcon;
  illustration: Exclude<ServiceOfferIllustration, "analytics">;
  pillarSlug: PillarSlug;
};

/** Pillar landing path under `/services`. */
export function pillarPath(slug: PillarSlug) {
  return marketingChildPath(ROUTES.services, slug);
}

/** Five layers shared by `/platform` and the services provide grid. */
export const SERVICE_OFFERS = [
  {
    key: "wholesale-connectivity",
    title: "Global Wholesale Connectivity",
    tag: "Voice & Data",
    description:
      "Carrier-grade voice and data routes across partner networks, under one commercial relationship.",
    icon: "globe",
    illustration: "wholesale",
    pillarSlug: "network-enterprise-connectivity",
  },
  {
    key: "enterprise-messaging",
    title: "Enterprise Messaging",
    tag: "A2P SMS",
    description:
      "Reliable A2P SMS delivery at scale for enterprise programmes, operators and omnichannel journeys.",
    icon: "message",
    illustration: "messaging",
    pillarSlug: "interactions-voice-messaging",
  },
  {
    key: "cloud-hosting",
    title: "Cloud & Hosting",
    tag: "Infrastructure",
    description:
      "Managed cloud, hosting and data-centre infrastructure that keeps digital operations online worldwide.",
    icon: "cloud",
    illustration: "cloud",
    pillarSlug: "cloud-data-centre",
  },
  {
    key: "iot-connectivity",
    title: "IoT Connectivity",
    tag: "Devices",
    description:
      "Secure device connectivity for fleets, meters and trackers — provisioned once, monitored live.",
    icon: "chip",
    illustration: "iot",
    pillarSlug: "iot-digital-services",
  },
  {
    key: "cybersecurity",
    title: "Cybersecurity",
    tag: "Protection",
    description:
      "Layered protection for connected operations, from threat monitoring to secure messaging and access.",
    icon: "shield",
    illustration: "cyber",
    pillarSlug: "cybersecurity",
  },
] as const satisfies readonly ServiceOffer[];

/** Sixth provide-grid card — not a platform layer plate. */
export const SERVICES_PROVIDE_EXTRA = {
  key: "analytics",
  title: "Voice & Digital Services",
  description:
    "International voice plus analytics that surface quality, usage and performance across every route.",
  illustration: "analytics" as const satisfies ServiceOfferIllustration,
  pillarSlug: "interactions-voice-messaging" as const satisfies PillarSlug,
};
