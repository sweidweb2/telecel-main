import {
  SERVICE_PILLAR_PAGES,
  SOLUTION_PAGES,
} from "@/constants/marketing-pages";

/**
 * PROVISIONAL pillar content. Sub-service names follow the RFQ service list;
 * the one-line descriptions say what each service *is* (no metrics, customers
 * or coverage). Replace wording with the approved text pack before launch.
 */

type PillarSlug = (typeof SERVICE_PILLAR_PAGES)[number]["slug"];
type SolutionSlug = (typeof SOLUTION_PAGES)[number]["slug"];

export type SubService = { name: string; summary: string };

export type ServicePillar = {
  slug: PillarSlug;
  /** Short mono code used in the editorial index, e.g. NEC. */
  code: string;
  intro: string;
  subServices: readonly SubService[];
  /** Buyer pages this pillar is most relevant to. */
  buyers: readonly SolutionSlug[];
  ctaLabel: string;
};

export const SERVICE_PILLARS: Record<PillarSlug, ServicePillar> = {
  "network-enterprise-connectivity": {
    slug: "network-enterprise-connectivity",
    code: "NEC",
    intro:
      "International and enterprise networking delivered and managed by one team, from transit capacity between carriers to private networks between your sites.",
    subServices: [
      {
        name: "International data connectivity",
        summary: "Point-to-point and multipoint capacity between markets.",
      },
      {
        name: "IP transit",
        summary:
          "Upstream internet access for operators and service providers.",
      },
      {
        name: "SD-WAN",
        summary: "Software-defined networking across branches and clouds.",
      },
      {
        name: "IP-VPN",
        summary: "Private, segmented connectivity between enterprise sites.",
      },
      {
        name: "Satellite",
        summary: "Reach for remote and hard-to-wire locations.",
      },
      {
        name: "Roaming",
        summary: "Roaming services and agreements for mobile operators.",
      },
      {
        name: "Enterprise networking",
        summary: "Design, delivery and management of LAN and WAN estates.",
      },
    ],
    buyers: ["mobile-operators", "wholesale-aggregators", "enterprises"],
    ctaLabel: "Talk to Sales",
  },
  "interactions-voice-messaging": {
    slug: "interactions-voice-messaging",
    code: "IVM",
    intro:
      "Voice and messaging for carriers and the businesses that talk to their customers, with the controls to keep traffic clean and billable.",
    subServices: [
      {
        name: "International voice",
        summary: "Wholesale voice termination and carriage.",
      },
      {
        name: "A2P messaging",
        summary:
          "Application-to-person SMS for alerts, OTPs and notifications.",
      },
      {
        name: "P2P and P2A messaging",
        summary: "Person-to-person and person-to-application traffic.",
      },
      {
        name: "SMS Firewall",
        summary:
          "Filtering that protects operator networks from grey routes and fraud.",
      },
      { name: "CPaaS", summary: "Programmable voice and messaging APIs." },
      {
        name: "Omnichannel engagement",
        summary: "SMS, chat apps and voice orchestrated from one platform.",
      },
      {
        name: "Managed services",
        summary: "Operation of messaging and voice platforms on your behalf.",
      },
    ],
    buyers: ["mobile-operators", "wholesale-aggregators", "enterprises"],
    ctaLabel: "Talk to Sales",
  },
  "cloud-data-centre": {
    slug: "cloud-data-centre",
    code: "CDC",
    intro:
      "Cloud and data centre services that move workloads closer to the markets you serve, with one accountable team for the platform underneath.",
    subServices: [
      {
        name: "Managed cloud",
        summary: "Day-to-day operation of your cloud environments.",
      },
      {
        name: "Public cloud",
        summary: "Access to and management of hyperscale cloud platforms.",
      },
      {
        name: "Private cloud",
        summary:
          "Dedicated infrastructure for regulated or sensitive workloads.",
      },
      {
        name: "Colocation",
        summary: "Space, power and cooling for your own equipment.",
      },
      {
        name: "Professional services",
        summary: "Migration, architecture and optimisation projects.",
      },
    ],
    buyers: ["enterprises", "governments-institutions", "mobile-operators"],
    ctaLabel: "Request a quote",
  },
  cybersecurity: {
    slug: "cybersecurity",
    code: "CYB",
    intro:
      "Layered security for connected operations: prevent what you can, watch for what you can't, and test both regularly.",
    subServices: [
      {
        name: "Prevention",
        summary: "Controls that stop threats at the network and endpoint.",
      },
      {
        name: "Threat monitoring",
        summary: "Continuous detection and response for your estate.",
      },
      {
        name: "Penetration testing",
        summary: "Scheduled and on-demand testing by specialists.",
      },
      {
        name: "Secure connectivity",
        summary: "Encrypted, policy-driven access between sites and users.",
      },
    ],
    buyers: ["enterprises", "governments-institutions", "mobile-operators"],
    ctaLabel: "Request a quote",
  },
  "iot-digital-services": {
    slug: "iot-digital-services",
    code: "IDS",
    intro:
      "Digital services that turn an operator's connectivity into new products, and give enterprises connected operations they can see.",
    subServices: [
      {
        name: "IoT",
        summary: "Connectivity and platforms for connected devices and assets.",
      },
      {
        name: "Telecom VAS",
        summary: "Value-added services operators offer their subscribers.",
      },
      {
        name: "Fintech",
        summary: "Payment and financial services built on mobile reach.",
      },
      {
        name: "Digital content",
        summary: "Content services distributed through operator channels.",
      },
      {
        name: "Travel eSIM",
        summary: "Data for travellers without a physical SIM swap.",
      },
    ],
    buyers: ["mobile-operators", "enterprises"],
    ctaLabel: "Talk to Sales",
  },
};

export function getServicePillar(slug: string): ServicePillar | undefined {
  return Object.hasOwn(SERVICE_PILLARS, slug)
    ? SERVICE_PILLARS[slug as PillarSlug]
    : undefined;
}

/** Contact link that carries the pillar through to the inquiry form. */
export function pillarContactHref(slug: string): string {
  return `/contact?${new URLSearchParams({ intent: "sales", area: slug })}`;
}
