import { describe, expect, it, vi } from "vitest";

import { toArticle, toArticleList } from "@/types/blog";
import { estimateReadingTimeMinutes, slugifyTitle } from "@/lib/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("blog helpers used by insights", () => {
  it("maps published blogs to articles", () => {
    const article = toArticle({
      id: "00000000-0000-4000-8000-000000000001",
      slug: "ux-review-presentations",
      title: "UX review presentations",
      summary: "How do you create compelling presentations?",
      body_html: "<p>Hello</p>",
      categories: ["Design"],
      thumbnail_url: null,
      author_name: "Olivia Rhye",
      author_avatar_url: null,
      reading_time_minutes: 8,
      published_at: "2025-01-20T00:00:00.000Z",
      updated_at: "2025-01-21T00:00:00.000Z",
      is_featured: true,
    });

    expect(article.slug).toBe("ux-review-presentations");
    expect(article.category.name).toBe("Design");
    expect(article.bodyHtml).toContain("Hello");
    expect(article.datePublishedIso).toBe("2025-01-20T00:00:00.000Z");
  });

  it("maps list rows without body", () => {
    const item = toArticleList({
      id: "00000000-0000-4000-8000-000000000002",
      slug: "list-item",
      title: "List",
      summary: "Summary",
      categories: ["Product"],
      thumbnail_url: null,
      author_name: "Ada",
      author_avatar_url: null,
      reading_time_minutes: 3,
      published_at: "2025-01-20T00:00:00.000Z",
      is_featured: false,
    });

    expect(item.slug).toBe("list-item");
    expect(item).not.toHaveProperty("bodyHtml");
  });

  it("slugifies and estimates reading time", () => {
    expect(slugifyTitle("UX Review Presentations")).toBe(
      "ux-review-presentations",
    );
    expect(estimateReadingTimeMinutes("<p>one two three</p>")).toBe(1);
  });

  it("sanitizes script tags from html", () => {
    const clean = sanitizeBlogHtml('<p>Hi</p><script>alert(1)</script>');
    expect(clean).toContain("<p>Hi</p>");
    expect(clean).not.toContain("script");
  });
});
