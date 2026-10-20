/**
 * Insights categories follow the RFQ service pillars plus company news, so
 * filters line up with the Services navigation. Editors may still add free
 * categories; only these get a filter tab.
 */
export const INSIGHT_CATEGORIES = [
  { id: "company-news", label: "Company News" },
  { id: "cloud-data-centre", label: "Cloud & Data Centre" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "iot-digital-services", label: "IoT & Digital Services" },
  { id: "connectivity", label: "Network & Connectivity" },
  { id: "voice-messaging", label: "Voice & Messaging" },
] as const;

export const RECOMMENDED_BLOG_CATEGORIES = INSIGHT_CATEGORIES.map(
  (category) => category.label
);

export type RecommendedBlogCategory = (typeof INSIGHT_CATEGORIES)[number]["label"];
