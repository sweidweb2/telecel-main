import { z } from "zod";

export const BLOG_PAGE_SIZE = 12;
export const BLOG_TITLE_MAX = 200;
export const BLOG_SUMMARY_MAX = 500;
export const BLOG_SLUG_MAX = 120;
export const BLOG_AUTHOR_NAME_MAX = 100;
export const BLOG_CATEGORY_MAX = 40;
export const BLOG_CATEGORIES_MAX = 8;
export const BLOG_BODY_MAX = 200_000;

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatusInput = (typeof BLOG_STATUSES)[number];

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(BLOG_SLUG_MAX, `Slug must be at most ${BLOG_SLUG_MAX} characters`)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and hyphens",
  );

const categorySchema = z
  .string()
  .trim()
  .min(1, "Category cannot be empty")
  .max(BLOG_CATEGORY_MAX, `Category must be at most ${BLOG_CATEGORY_MAX} characters`);

export const blogFieldsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(BLOG_TITLE_MAX, `Title must be at most ${BLOG_TITLE_MAX} characters`),
    slug: slugSchema,
    summary: z
      .string()
      .trim()
      .min(2, "Summary must be at least 2 characters")
      .max(
        BLOG_SUMMARY_MAX,
        `Summary must be at most ${BLOG_SUMMARY_MAX} characters`,
      ),
    bodyHtml: z.string().max(BLOG_BODY_MAX, "Body is too long"),
    categories: z
      .array(categorySchema)
      .max(
        BLOG_CATEGORIES_MAX,
        `At most ${BLOG_CATEGORIES_MAX} categories allowed`,
      ),
    authorName: z
      .string()
      .trim()
      .min(2, "Author name must be at least 2 characters")
      .max(
        BLOG_AUTHOR_NAME_MAX,
        `Author name must be at most ${BLOG_AUTHOR_NAME_MAX} characters`,
      ),
    status: z.enum(BLOG_STATUSES),
    isFeatured: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.isFeatured && value.status !== "published") {
      ctx.addIssue({
        code: "custom",
        path: ["isFeatured"],
        message: "Only published posts can be featured.",
      });
    }
  });

export const createBlogSchema = blogFieldsSchema;

export const updateBlogSchema = blogFieldsSchema.and(
  z.object({
    id: z.uuid("Invalid blog id"),
  }),
);

export const deleteBlogSchema = z.object({
  id: z.uuid("Invalid blog id"),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type DeleteBlogInput = z.infer<typeof deleteBlogSchema>;

const blogListQueryInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  search: z
    .string()
    .trim()
    .max(100)
    .regex(/^[^,%_()]*$/)
    .catch(""),
  status: z.enum(["all", ...BLOG_STATUSES]).catch("all"),
});

export type BlogListQuery = z.infer<typeof blogListQueryInputSchema> & {
  pageSize: typeof BLOG_PAGE_SIZE;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseBlogListQuery(input: RawSearchParams): BlogListQuery {
  const parsed = blogListQueryInputSchema.parse({
    page: first(input.page) ?? "1",
    search: first(input.search) ?? "",
    status: first(input.status) ?? "all",
  });

  return {
    ...parsed,
    pageSize: BLOG_PAGE_SIZE,
  };
}
