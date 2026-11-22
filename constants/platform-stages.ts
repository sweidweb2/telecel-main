/**
 * Connect → Optimize sequence — single source for rail copy and nav anchors.
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

/** In-page platform flow anchors for the public nav (`/platform#connect`, …). */
export const PLATFORM_FLOW_LINKS = PLATFORM_STAGES.map((stage) => ({
  id: stage.key,
  label: stage.title,
}));
