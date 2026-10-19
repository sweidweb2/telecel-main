export const BLOG_TAB_IDS = [
  "all",
  "design",
  "product",
  "software-engineering",
  "customer-success",
] as const;

export type BlogTabId = (typeof BLOG_TAB_IDS)[number];

export function categoryToTabId(name: string): BlogTabId {
  switch (name) {
    case "Design":
      return "design";
    case "Product":
      return "product";
    case "Software Engineering":
      return "software-engineering";
    case "Customer Success":
      return "customer-success";
    default:
      return "all";
  }
}
