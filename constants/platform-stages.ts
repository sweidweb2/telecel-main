/**
 * Connect → Optimize sequence copy for the platform rail.
 * Kept separate from `home-content` so client islands can import a small
 * module without pulling provisional homepage copy.
 */
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

export type PlatformStage = (typeof PLATFORM_STAGES)[number];
