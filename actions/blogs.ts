"use server";

import { recordActivity } from "@/actions/observability";
import {
  authorizeStaff,
  blogUnexpectedError,
  BLOG_MESSAGES,
  refreshBlogPaths,
  type BlogActionResult,
  type StaffClient,
} from "@/actions/blog-shared";
import { estimateReadingTimeMinutes } from "@/lib/blog-utils";
import {
  AUTHOR_BUCKET,
  COVER_BUCKET,
  removeStorageUrlIfOwned,
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

async function clearOtherFeatured(supabase: StaffClient, exceptId?: string) {
  let request = supabase
    .from("blogs")
    .update({ is_featured: false })
    .eq("is_featured", true);
  if (exceptId) {
    request = request.neq("id", exceptId);
  }
  const { error } = await request;
  if (error) throw error;
}

function toRowFields(input: CreateBlogInput) {
  const bodyHtml = sanitizeBlogHtml(input.bodyHtml);
  const status = input.status;
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    body_html: bodyHtml,
    categories: input.categories,
    author_name: input.authorName,
    status,
    is_featured: input.isFeatured,
    reading_time_minutes: estimateReadingTimeMinutes(bodyHtml),
    published_at: status === "published" ? new Date().toISOString() : null,
  };
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

  const fields = toRowFields(parsed.data);
  if (fields.is_featured) {
    await clearOtherFeatured(session.supabase);
  }

  const { data, error } = await session.supabase
    .from("blogs")
    .insert(fields)
    .select("id, slug")
    .single();

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

  await recordActivity({
    actorId: session.session.userId,
    action: fields.status === "published" ? "publish" : "create",
    entityType: "blog",
    entityId: data.id,
    summary: { slug: data.slug, status: fields.status },
  });

  refreshBlogPaths(data.slug);
  return {
    status: "success",
    message: BLOG_MESSAGES.createSuccess,
    id: data.id,
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
  const fields = toRowFields(rest);

  // Drafts cannot be featured; clear hero flag on unpublish.
  if (fields.status === "draft") {
    fields.is_featured = false;
  }

  const { data: existing, error: existingError } = await session.supabase
    .from("blogs")
    .select("id, slug, published_at, status")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return blogUnexpectedError(
      "actions.blogs.updateBlog",
      session.session.userId,
      existingError,
    );
  }
  if (!existing) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
  }

  if (fields.is_featured) {
    await clearOtherFeatured(session.supabase, id);
  }

  const publishedAt =
    fields.status === "published"
      ? (existing.published_at ?? new Date().toISOString())
      : existing.published_at;

  const { data, error } = await session.supabase
    .from("blogs")
    .update({
      ...fields,
      published_at: publishedAt,
    })
    .eq("id", id)
    .select("id, slug")
    .maybeSingle();

  if (error) {
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
  if (!data) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
  }

  const action =
    existing.status !== "published" && fields.status === "published"
      ? "publish"
      : existing.status === "published" && fields.status === "draft"
        ? "unpublish"
        : "update";

  await recordActivity({
    actorId: session.session.userId,
    action,
    entityType: "blog",
    entityId: data.id,
    summary: { slug: data.slug, status: fields.status },
  });

  refreshBlogPaths(existing.slug, data.slug);
  return {
    status: "success",
    message: BLOG_MESSAGES.updateSuccess,
    id: data.id,
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

  const { data: existing } = await session.supabase
    .from("blogs")
    .select("id, slug, thumbnail_url, author_avatar_url")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (!existing) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
  }

  await removeStorageUrlIfOwned(
    session.supabase,
    existing.thumbnail_url,
    COVER_BUCKET,
  );
  await removeStorageUrlIfOwned(
    session.supabase,
    existing.author_avatar_url,
    AUTHOR_BUCKET,
  );

  const { error } = await session.supabase
    .from("blogs")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return blogUnexpectedError(
      "actions.blogs.deleteBlog",
      session.session.userId,
      error,
    );
  }

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
