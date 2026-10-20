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

/** RFQ §3 order — voice & messaging stays last in service sequences (RFQ §6). */
export const SERVICE_PILLARS = [
  { slug: "cloud-data-centre", title: "Cloud & Data Centre Services" },
  { slug: "cybersecurity", title: "Cybersecurity" },
  { slug: "iot-digital-services", title: "IoT & Digital Services" },
  { slug: "network-enterprise-connectivity", title: "Network & Enterprise Connectivity" },
  { slug: "interactions-voice-messaging", title: "Interactions, Voice & Messaging" },
] as const;

export const PLATFORM_STAGES = [
  {
    key: "connect",
    title: "Connect",
    summary: "Bring networks, enterprises and partners onto one platform.",
  },
  {
    key: "orchestrate",
    title: "Orchestrate",
    summary: "Coordinate services and partners through a single operating layer.",
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

export const BUYER_ROUTES = [
  {
    href: "/solutions/mobile-operators",
    title: "Mobile Operators",
    summary: "Services that extend what operators offer their own customers.",
  },
  {
    href: "/solutions/enterprises",
    title: "Enterprises",
    summary: "Connectivity, cloud and security for organisations working across markets.",
  },
  {
    href: "/solutions/governments-institutions",
    title: "Governments & Institutions",
    summary: "Infrastructure and digital services for public bodies.",
  },
  {
    href: "/solutions/wholesale-aggregators",
    title: "Wholesale & Aggregators",
    summary: "Capacity and messaging for carriers and aggregators.",
  },
] as const;
