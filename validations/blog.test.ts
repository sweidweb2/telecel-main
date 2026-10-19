import {
  BLOG_PAGE_SIZE,
  BLOG_STATUSES,
  createBlogSchema,
  parseBlogListQuery,
  updateBlogSchema,
} from "@/validations/blog";
import { estimateReadingTimeMinutes, slugifyTitle } from "@/lib/blog-utils";
import { toArticle } from "@/types/blog";
import { describe, expect, it } from "vitest";

describe("blog validations", () => {
  const valid = {
    title: "Improve your design skills",
    slug: "improve-design-skills",
    summary: "Tools and trends change, but good design is timeless.",
    bodyHtml: "<p>Hello world</p>",
    categories: ["Design", "Research"],
    authorName: "Amélie Laurent",
    status: "draft" as const,
    isFeatured: false,
  };

  it("accepts a valid create payload", () => {
    expect(createBlogSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid slug", () => {
    const result = createBlogSchema.safeParse({
      ...valid,
      slug: "Bad Slug!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects featuring a draft", () => {
    const result = createBlogSchema.safeParse({
      ...valid,
      isFeatured: true,
    });
    expect(result.success).toBe(false);
  });

  it("requires update id", () => {
    const result = updateBlogSchema.safeParse(valid);
    expect(result.success).toBe(false);
  });

  it("accepts update with id", () => {
    const result = updateBlogSchema.safeParse({
      ...valid,
      id: "00000000-0000-4000-8000-000000000001",
      status: "published",
      isFeatured: true,
    });
    expect(result.success).toBe(true);
  });

  it("parses list query defaults", () => {
    const query = parseBlogListQuery({});
    expect(query.page).toBe(1);
    expect(query.pageSize).toBe(BLOG_PAGE_SIZE);
    expect(query.status).toBe("all");
  });

  it("exposes blog statuses", () => {
    expect(BLOG_STATUSES).toContain("published");
  });
});

describe("blog utils", () => {
  it("slugifies titles", () => {
    expect(slugifyTitle("Improve Your Design Skills!")).toBe(
      "improve-your-design-skills",
    );
  });

  it("estimates reading time from html", () => {
    const words = Array.from({ length: 400 }, () => "word").join(" ");
    expect(estimateReadingTimeMinutes(`<p>${words}</p>`)).toBe(2);
  });
});

describe("toArticle", () => {
  it("maps categories and reading time", () => {
    const article = toArticle({
      id: "00000000-0000-4000-8000-000000000001",
      slug: "test-post",
      title: "Test",
      summary: "Summary",
      body_html: "<p>Hi</p>",
      categories: ["Design", "Research"],
      thumbnail_url: "https://example.com/a.webp",
      author_name: "Ada",
      author_avatar_url: null,
      reading_time_minutes: 5,
      published_at: "2025-01-10T12:00:00.000Z",
      updated_at: "2025-01-11T12:00:00.000Z",
      is_featured: true,
    });

    expect(article.category.name).toBe("Design");
    expect(article.tags).toHaveLength(2);
    expect(article.readingTime).toBe("5 min read");
    expect(article.bodyHtml).toBe("<p>Hi</p>");
    expect(article.isFeatured).toBe(true);
    expect(article.datePublishedIso).toBe("2025-01-10T12:00:00.000Z");
    expect(article.dateModifiedIso).toBe("2025-01-11T12:00:00.000Z");
  });
});
