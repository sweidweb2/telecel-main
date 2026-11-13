/**
 * Five platform service layers — interactive stack on `/platform`.
 * Copy is provisional until the approved Telecel Global Text Pack lands.
 */
export const PLATFORM_LAYERS = [
  {
    key: "wholesale-connectivity",
    title: "Global Wholesale Connectivity",
    tag: "Voice & Data",
    description:
      "Carrier-grade voice and data routes across 180+ partner networks.",
    icon: "globe",
  },
  {
    key: "enterprise-messaging",
    title: "Enterprise Messaging",
    tag: "A2P SMS",
    description:
      "Reliable A2P SMS delivery for enterprise and operator messaging programmes.",
    icon: "message",
  },
  {
    key: "cloud-hosting",
    title: "Cloud & Hosting",
    tag: "Infrastructure",
    description:
      "Managed cloud and hosting infrastructure for digital operations.",
    icon: "cloud",
  },
  {
    key: "iot-connectivity",
    title: "IoT Connectivity",
    tag: "Devices",
    description: "Secure device connectivity for IoT programmes at scale.",
    icon: "chip",
  },
  {
    key: "cybersecurity",
    title: "Cybersecurity",
    tag: "Protection",
    description:
      "Layered protection for connected operations and digital services.",
    icon: "shield",
  },
] as const;

export type PlatformLayer = (typeof PLATFORM_LAYERS)[number];
export type PlatformLayerIcon = PlatformLayer["icon"];
