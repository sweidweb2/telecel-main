import { SERVICE_PILLAR_PAGES } from "@/constants/marketing-pages";

type ServicePillarSlug = (typeof SERVICE_PILLAR_PAGES)[number]["slug"];

/**
 * Insights categories follow the RFQ service pillars plus company news, so
 * filters line up with the Services navigation. Editors may still add free
 * categories; only these get a filter tab.
 *
 * `pillarSlug` is the matching `SERVICE_PILLAR_PAGES` slug when the tab is
 * service-scoped (`null` for company news). Tab ids may be shorter than pillar
 * slugs — keep the map explicit so nav and insights stay aligned.
 */
export const INSIGHT_CATEGORIES = [
  { id: "company-news", label: "Company News", pillarSlug: null },
  {
    id: "cloud-data-centre",
    label: "Cloud & Data Centre",
    pillarSlug: "cloud-data-centre",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    pillarSlug: "cybersecurity",
  },
  {
    id: "iot-digital-services",
    label: "IoT & Digital Services",
    pillarSlug: "iot-digital-services",
  },
  {
    id: "connectivity",
    label: "Network & Connectivity",
    pillarSlug: "network-enterprise-connectivity",
  },
  {
    id: "voice-messaging",
    label: "Voice & Messaging",
    pillarSlug: "interactions-voice-messaging",
  },
] as const satisfies readonly {
  id: string;
  label: string;
  pillarSlug: ServicePillarSlug | null;
}[];

export const RECOMMENDED_BLOG_CATEGORIES = INSIGHT_CATEGORIES.map(
  (category) => category.label,
);

export type RecommendedBlogCategory =
  (typeof INSIGHT_CATEGORIES)[number]["label"];
