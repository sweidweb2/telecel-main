import {
  marketingChildPath,
  SERVICE_PILLAR_PAGES,
} from "@/constants/marketing-pages";
import { ROUTES } from "@/constants/routes";

/**
 * “What We Provide” cards on the services hub — six abstract product scenes.
 * Links map into the approved pillar landings where they align.
 */

export type ServicesProvideIllustration =
  "wholesale" | "messaging" | "cloud" | "iot" | "cyber" | "analytics";

export type ServicesProvideCard = {
  key: ServicesProvideIllustration;
  title: string;
  description: string;
  href: string;
};

function pillarHref(slug: (typeof SERVICE_PILLAR_PAGES)[number]["slug"]) {
  return marketingChildPath(ROUTES.services, slug);
}

export const SERVICES_PROVIDE = {
  eyebrow: "What We Provide",
  title: "One Network. Every Connection.",
  description:
    "Connectivity, messaging, cloud, IoT, security and voice — one managed platform for every market you serve.",
} as const;

export const SERVICES_PROVIDE_CARDS = [
  {
    key: "wholesale",
    title: "Global Wholesale Connectivity",
    description:
      "Carrier-grade voice and data routes across 180+ partner networks, under one commercial relationship.",
    href: pillarHref("network-enterprise-connectivity"),
  },
  {
    key: "messaging",
    title: "Enterprise Messaging",
    description:
      "Reliable A2P SMS delivery at scale for enterprise programmes, operators and omnichannel journeys.",
    href: pillarHref("interactions-voice-messaging"),
  },
  {
    key: "cloud",
    title: "Cloud & Hosting",
    description:
      "Managed cloud, hosting and data-centre infrastructure that keeps digital operations online worldwide.",
    href: pillarHref("cloud-data-centre"),
  },
  {
    key: "iot",
    title: "IoT Connectivity",
    description:
      "Secure device connectivity for fleets, meters and trackers — provisioned once, monitored live.",
    href: pillarHref("iot-digital-services"),
  },
  {
    key: "cyber",
    title: "Cybersecurity",
    description:
      "Layered protection for connected operations, from threat monitoring to secure messaging and access.",
    href: pillarHref("cybersecurity"),
  },
  {
    key: "analytics",
    title: "Voice & Digital Services",
    description:
      "International voice plus analytics that surface quality, usage and performance across every route.",
    href: pillarHref("interactions-voice-messaging"),
  },
] as const satisfies readonly ServicesProvideCard[];
