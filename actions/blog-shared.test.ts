import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/data/auth", () => ({ authorizeAction: vi.fn() }));
vi.mock("@/actions/observability", () => ({ unexpectedActionError: vi.fn() }));
vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

import { revalidatePath, revalidateTag, updateTag } from "next/cache";

import { refreshBlogPaths } from "@/actions/blog-shared";
import { BLOGS_CACHE_TAG, blogSlugTag } from "@/lib/cache-tags";

describe("refreshBlogPaths", () => {
  beforeEach(() => vi.clearAllMocks());

  it("expires the shared blogs tag and listing paths with updateTag", () => {
    refreshBlogPaths();
    expect(updateTag).toHaveBeenCalledWith(BLOGS_CACHE_TAG);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/insights");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });

  it("expires old and new slugs once each, skipping empties", () => {
    refreshBlogPaths("old", "new", "old", null, undefined, "");
    expect(updateTag).toHaveBeenCalledWith(blogSlugTag("old"));
    expect(updateTag).toHaveBeenCalledWith(blogSlugTag("new"));
    expect(updateTag).toHaveBeenCalledTimes(3);
    expect(revalidatePath).toHaveBeenCalledWith("/insights/old");
    expect(revalidatePath).toHaveBeenCalledWith("/insights/new");
  });
});
