"use server";

import { recordActivity, recordAppError } from "@/actions/observability";
import {
  authorizeStaff,
  blogUnexpectedError,
  BLOG_MESSAGES,
  refreshBlogPaths,
  type BlogActionResult,
} from "@/actions/blog-shared";
import { estimateReadingTimeMinutes } from "@/lib/blog-utils";
import {
  AUTHOR_BUCKET,
  COVER_BUCKET,
  removeStoragePrefix,
} from "@/lib/blog-storage";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import {
  createBlogSchema,
  deleteBlogSchema,
  updateBlogSchema,
  type CreateBlogInput,
  type DeleteBlogInput,
  type UpdateBlogInput,
} from "@/validations/blog";

export type { BlogActionResult };

type SaveBlogRow = {
  id: string;
  slug: string;
  previous_slug: string | null;
  previous_status: "draft" | "published" | null;
};

function uniqueConstraintMessage(error: {
  code?: string;
  message?: string;
}): string | null {
  const message = (error.message ?? "").toLowerCase();
  const isUnique =
    error.code === "23505" ||
    message.includes("blogs_slug") ||
    message.includes("blogs_one_featured");
  if (!isUnique) return null;
  if (message.includes("blogs_one_featured")) return BLOG_MESSAGES.featuredTaken;
  return BLOG_MESSAGES.slugTaken;
}

function toRpcFields(input: CreateBlogInput) {
  const bodyHtml = sanitizeBlogHtml(input.bodyHtml);
  const status = input.status;
  // Drafts cannot be featured — also enforced in save_blog + DB check.
  const isFeatured = status === "draft" ? false : input.isFeatured;
  return {
    p_title: input.title,
    p_slug: input.slug,
    p_summary: input.summary,
    p_body_html: bodyHtml,
    p_categories: input.categories,
    p_author_name: input.authorName,
    p_status: status,
    p_is_featured: isFeatured,
    p_reading_time_minutes: estimateReadingTimeMinutes(bodyHtml),
  };
}

async function logStorageCleanupFailure(
  source: string,
  actorId: string,
  context: Record<string, unknown>,
  errorMessage?: string,
) {
  await recordAppError({
    severity: "warning",
    source,
    actorId,
    message: errorMessage ?? "Storage cleanup failed",
    context,
  });
}

export async function createBlog(
  input: CreateBlogInput,
): Promise<BlogActionResult> {
  const parsed = createBlogSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? BLOG_MESSAGES.invalidDetails,
    };
  }

  const session = await authorizeStaff();
  if (session.status === "error") return session;

  const fields = toRpcFields(parsed.data);
  const { data, error } = await session.supabase.rpc("save_blog", fields);

  if (error) {
    const uniqueMessage = uniqueConstraintMessage(error);
    if (uniqueMessage) {
      return { status: "error", message: uniqueMessage };
    }
    return blogUnexpectedError(
      "actions.blogs.createBlog",
      session.session.userId,
      error,
    );
  }

  const row = (Array.isArray(data) ? data[0] : data) as SaveBlogRow | null;
  if (!row?.id) {
    return blogUnexpectedError(
      "actions.blogs.createBlog",
      session.session.userId,
      { message: "save_blog returned no row" },
    );
  }

  await recordActivity({
    actorId: session.session.userId,
    action: fields.p_status === "published" ? "publish" : "create",
    entityType: "blog",
    entityId: row.id,
    summary: { slug: row.slug, status: fields.p_status },
  });

  refreshBlogPaths(row.slug);
  return {
    status: "success",
    message: BLOG_MESSAGES.createSuccess,
    id: row.id,
  };
}

export async function updateBlog(
  input: UpdateBlogInput,
): Promise<BlogActionResult> {
  const parsed = updateBlogSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? BLOG_MESSAGES.invalidDetails,
    };
  }

  const session = await authorizeStaff();
  if (session.status === "error") return session;

  const { id, ...rest } = parsed.data;
  const fields = toRpcFields(rest);

  const { data, error } = await session.supabase.rpc("save_blog", {
    ...fields,
    p_id: id,
  });

  if (error) {
    const message = (error.message ?? "").toLowerCase();
    if (error.code === "P0002" || message.includes("blog not found")) {
      return { status: "error", message: BLOG_MESSAGES.notFound };
    }
    const uniqueMessage = uniqueConstraintMessage(error);
    if (uniqueMessage) {
      return { status: "error", message: uniqueMessage };
    }
    return blogUnexpectedError(
      "actions.blogs.updateBlog",
      session.session.userId,
      error,
    );
  }

  const row = (Array.isArray(data) ? data[0] : data) as SaveBlogRow | null;
  if (!row?.id) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
  }

  const previousStatus = row.previous_status;
  const action =
    previousStatus !== "published" && fields.p_status === "published"
      ? "publish"
      : previousStatus === "published" && fields.p_status === "draft"
        ? "unpublish"
        : "update";

  await recordActivity({
    actorId: session.session.userId,
    action,
    entityType: "blog",
    entityId: row.id,
    summary: { slug: row.slug, status: fields.p_status },
  });

  refreshBlogPaths(row.previous_slug, row.slug);
  return {
    status: "success",
    message: BLOG_MESSAGES.updateSuccess,
    id: row.id,
  };
}

export async function deleteBlog(
  input: DeleteBlogInput,
): Promise<BlogActionResult> {
  const parsed = deleteBlogSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? BLOG_MESSAGES.invalidDetails,
    };
  }

  const session = await authorizeStaff();
  if (session.status === "error") return session;

  // Returning columns from DELETE drops the pre-select round trip.
  // Uploads always live under `{blogId}/…`, so prefix sweep is enough.
  const { data: existing, error } = await session.supabase
    .from("blogs")
    .delete()
    .eq("id", parsed.data.id)
    .select("id, slug")
    .maybeSingle();

  if (error) {
    return blogUnexpectedError(
      "actions.blogs.deleteBlog",
      session.session.userId,
      error,
    );
  }
  if (!existing) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
  }

  const [coverCleanup, authorCleanup] = await Promise.all([
    removeStoragePrefix(session.supabase, COVER_BUCKET, existing.id),
    removeStoragePrefix(session.supabase, AUTHOR_BUCKET, existing.id),
  ]);

  await Promise.all([
    coverCleanup.ok
      ? Promise.resolve()
      : logStorageCleanupFailure(
          "actions.blogs.deleteBlog",
          session.session.userId,
          { blogId: existing.id, bucket: COVER_BUCKET },
          coverCleanup.errorMessage,
        ),
    authorCleanup.ok
      ? Promise.resolve()
      : logStorageCleanupFailure(
          "actions.blogs.deleteBlog",
          session.session.userId,
          { blogId: existing.id, bucket: AUTHOR_BUCKET },
          authorCleanup.errorMessage,
        ),
  ]);

  await recordActivity({
    actorId: session.session.userId,
    action: "delete",
    entityType: "blog",
    entityId: existing.id,
    summary: { slug: existing.slug },
  });

  refreshBlogPaths(existing.slug);
  return { status: "success", message: BLOG_MESSAGES.deleteSuccess };
}
