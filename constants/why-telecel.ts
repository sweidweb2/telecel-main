/**
 * PROVISIONAL differentiators (RFQ: operator-led understanding, one
 * accountable relationship, reach, agility, proximity). Replace with the
 * approved text pack; no metrics or coverage claims here.
 */
export const DIFFERENTIATORS = [
  {
    title: "Operator-led understanding",
    body: "We start from how operators run networks, contracts and services.",
  },
  {
    title: "One accountable relationship",
    body: "One team owns your services from design to daily operation.",
  },
  {
    title: "International reach",
    body: "Connectivity and digital services for organisations working across borders.",
  },
  {
    title: "Agility",
    body: "Services scoped and changed around your plans, not a fixed catalogue.",
  },
  {
    title: "Proximity",
    body: "Engagement shaped around your markets and regulatory context.",
  },
] as const;

/** Leadership profiles — supplied by the leadership workstream. */
export type Leader = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};
export const LEADERS: readonly Leader[] = [];
