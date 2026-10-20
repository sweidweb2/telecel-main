import { INSIGHT_CATEGORIES } from "@/constants/blog-categories";

export type BlogTabId = "all" | (typeof INSIGHT_CATEGORIES)[number]["id"];

export const BLOG_TAB_IDS: readonly BlogTabId[] = [
  "all",
  ...INSIGHT_CATEGORIES.map((category) => category.id),
];

export function categoryToTabId(name: string): BlogTabId {
  return INSIGHT_CATEGORIES.find((category) => category.label === name)?.id ?? "all";
}
