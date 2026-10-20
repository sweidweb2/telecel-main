import { INSIGHT_CATEGORIES } from "@/constants/blog-categories";
import type { BlogTabId } from "@/constants/blog-ui";

export type BlogLabels = {
  eyebrow: string;
  title: string;
  description: string;
  writtenBy: string;
  publishedOn: string;
  fileUnder: string;
  emptyState: string;
  tabs: { id: BlogTabId; label: string }[];
  previous: string;
  next: string;
};

/** English-only for Phase 1; keep copy here so i18n can be added later. */
export const BLOG_LABELS: BlogLabels = {
  eyebrow: "Insights",
  title: "News and insights",
  description: "Announcements and perspectives from Telecel Global.",
  writtenBy: "Written by",
  publishedOn: "Published on",
  fileUnder: "File under",
  emptyState: "No published articles yet. Check back soon.",
  tabs: [
    { id: "all", label: "View all" },
    ...INSIGHT_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.label,
    })),
  ],
  previous: "Previous",
  next: "Next",
};
