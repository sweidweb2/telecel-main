/**
 * Connect → Optimize sequence — single source for rail copy, nav anchors,
 * and platform blueprint section ids.
 */
export const PLATFORM_STAGES = [
  {
    key: "connect",
    title: "Connect",
    summary: "Bring networks, enterprises and partners onto one platform.",
    blueprintNote:
      "Bring the right networks, platforms and service components together.",
  },
  {
    key: "orchestrate",
    title: "Orchestrate",
    summary:
      "Coordinate services and partners through a single operating layer.",
    blueprintNote:
      "Align technical and commercial requirements through one managed relationship.",
  },
  {
    key: "deliver",
    title: "Deliver",
    summary: "Put connectivity and digital services in customers’ hands.",
    blueprintNote:
      "Launch the agreed solution with clear ownership and implementation control.",
  },
  {
    key: "monitor",
    title: "Monitor",
    summary: "Keep sight of service quality and security as it runs.",
    blueprintNote: "Maintain operational visibility and service continuity.",
  },
  {
    key: "optimize",
    title: "Optimize",
    summary: "Refine cost, reliability and reach as needs change.",
    blueprintNote:
      "Improve performance, efficiency and commercial value over time.",
  },
] as const;

export type PlatformStage = (typeof PLATFORM_STAGES)[number];

/** In-page platform flow anchors for the public nav. */
export const PLATFORM_FLOW_LINKS = PLATFORM_STAGES.map((stage) => ({
  id: stage.key,
  label: stage.title,
}));
