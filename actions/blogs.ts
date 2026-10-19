"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { nanoid } from "nanoid";

import { ROUTES } from "@/constants/routes";
import { estimateReadingTimeMinutes } from "@/lib/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import { createClient } from "@/lib/supabase/server";
import { BLOGS_CACHE_TAG } from "@/data/blogs";
import {
  createBlogSchema,
  deleteBlogSchema,
  updateBlogSchema,
  type CreateBlogInput,
  type DeleteBlogInput,
  type UpdateBlogInput,
} from "@/validations/blog";

export type BlogActionResult =
  | { status: "success"; message: string; id?: string }
  | { status: "error"; message: string };

const MESSAGES = {
  unauthorized: "You do not have permission to manage blogs.",
  signedInRequired: "You must be signed in.",
  invalidDetails: "Please check the form and try again.",
  createSuccess: "Blog created successfully.",
  updateSuccess: "Blog updated successfully.",
  deleteSuccess: "Blog deleted successfully.",
  uploadSuccess: "Image uploaded successfully.",
  removeSuccess: "Image removed successfully.",
  notFound: "Blog not found.",
  genericError: "Something went wrong. Please try again.",
  slugTaken: "That slug is already in use.",
  featuredTaken: "Another post is already featured. Unfeature it first, or save again.",
  invalidImage: "Please upload a JPEG, PNG, WebP, or GIF under the size limit.",
} as const;

const COVER_BUCKET = "blogs";
const AUTHOR_BUCKET = "auther";
const COVER_MAX_BYTES = 5 * 1024 * 1024;
const AUTHOR_MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type AdminSession =
  | {
      status: "success";
      supabase: Awaited<ReturnType<typeof createClient>>;
    }
  | { status: "error"; message: string };

async function authorizeAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: MESSAGES.signedInRequired };
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    return { status: "error", message: MESSAGES.unauthorized };
  }

  return { status: "success", supabase };
}

function refreshBlogPaths(slug?: string) {
  revalidateTag(BLOGS_CACHE_TAG, "max");
  revalidatePath(ROUTES.blogs);
  revalidatePath("/en/insights");
  revalidatePath("/fr/insights");
  if (slug) {
    revalidatePath(`/en/insights/${slug}`);
    revalidatePath(`/fr/insights/${slug}`);
  }
}

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
  if (message.includes("blogs_one_featured")) return MESSAGES.featuredTaken;
  return MESSAGES.slugTaken;
}

async function clearOtherFeatured(
  supabase: Awaited<ReturnType<typeof createClient>>,
  exceptId?: string,
) {
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
    published_at:
      status === "published" ? new Date().toISOString() : null,
  };
}

export async function createBlog(
  input: CreateBlogInput,
): Promise<BlogActionResult> {
  const parsed = createBlogSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? MESSAGES.invalidDetails,
    };
  }

  const session = await authorizeAdmin();
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
    return { status: "error", message: MESSAGES.genericError };
  }

  refreshBlogPaths(data.slug);
  return {
    status: "success",
    message: MESSAGES.createSuccess,
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
      message: parsed.error.issues[0]?.message ?? MESSAGES.invalidDetails,
    };
  }

  const session = await authorizeAdmin();
  if (session.status === "error") return session;

  const { id, ...rest } = parsed.data;
  const fields = toRowFields(rest);

  // Drafts cannot be featured; clear hero flag on unpublish.
  if (fields.status === "draft") {
    fields.is_featured = false;
  }

  const { data: existing, error: existingError } = await session.supabase
    .from("blogs")
    .select("id, published_at, status")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { status: "error", message: MESSAGES.genericError };
  }
  if (!existing) {
    return { status: "error", message: MESSAGES.notFound };
  }

  if (fields.is_featured) {
    await clearOtherFeatured(session.supabase, id);
  }

  const publishedAt =
    fields.status === "published"
      ? existing.published_at ?? new Date().toISOString()
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
    return { status: "error", message: MESSAGES.genericError };
  }
  if (!data) {
    return { status: "error", message: MESSAGES.notFound };
  }

  refreshBlogPaths(data.slug);
  return { status: "success", message: MESSAGES.updateSuccess, id: data.id };
}

export async function deleteBlog(
  input: DeleteBlogInput,
): Promise<BlogActionResult> {
  const parsed = deleteBlogSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? MESSAGES.invalidDetails,
    };
  }

  const session = await authorizeAdmin();
  if (session.status === "error") return session;

  const { data: existing } = await session.supabase
    .from("blogs")
    .select("id, slug, thumbnail_url, author_avatar_url")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (!existing) {
    return { status: "error", message: MESSAGES.notFound };
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
    return { status: "error", message: MESSAGES.genericError };
  }

  refreshBlogPaths(existing.slug);
  return { status: "success", message: MESSAGES.deleteSuccess };
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

function publicObjectUrl(supabaseUrl: string, bucket: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

function storagePathFromPublicUrl(
  url: string | null | undefined,
  bucket: string,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

async function removeStorageUrlIfOwned(
  supabase: Awaited<ReturnType<typeof createClient>>,
  url: string | null | undefined,
  bucket: string,
) {
  const path = storagePathFromPublicUrl(url, bucket);
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}

async function uploadImage(options: {
  blogId: string;
  file: File;
  bucket: typeof COVER_BUCKET | typeof AUTHOR_BUCKET;
  column: "thumbnail_url" | "author_avatar_url";
  maxBytes: number;
}): Promise<BlogActionResult> {
  const { blogId, file, bucket, column, maxBytes } = options;

  if (!ALLOWED_MIME.has(file.type) || file.size <= 0 || file.size > maxBytes) {
    return { status: "error", message: MESSAGES.invalidImage };
  }

  const session = await authorizeAdmin();
  if (session.status === "error") return session;

  const { data: existing, error: existingError } = await session.supabase
    .from("blogs")
    .select("id, slug, thumbnail_url, author_avatar_url")
    .eq("id", blogId)
    .maybeSingle();

  if (existingError) {
    return { status: "error", message: MESSAGES.genericError };
  }
  if (!existing) {
    return { status: "error", message: MESSAGES.notFound };
  }

  const ext = extensionForMime(file.type);
  const path = `${blogId}/${nanoid(10)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await session.supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { status: "error", message: MESSAGES.genericError };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return { status: "error", message: MESSAGES.genericError };
  }

  const publicUrl = publicObjectUrl(supabaseUrl, bucket, path);
  const previousUrl =
    column === "thumbnail_url"
      ? (existing as { thumbnail_url: string | null }).thumbnail_url
      : (existing as { author_avatar_url: string | null }).author_avatar_url;

  const { error: updateError } =
    column === "thumbnail_url"
      ? await session.supabase
          .from("blogs")
          .update({ thumbnail_url: publicUrl })
          .eq("id", blogId)
      : await session.supabase
          .from("blogs")
          .update({ author_avatar_url: publicUrl })
          .eq("id", blogId);

  if (updateError) {
    await session.supabase.storage.from(bucket).remove([path]);
    return { status: "error", message: MESSAGES.genericError };
  }

  await removeStorageUrlIfOwned(session.supabase, previousUrl, bucket);
  refreshBlogPaths(existing.slug);
  return { status: "success", message: MESSAGES.uploadSuccess, id: blogId };
}

export async function uploadBlogThumbnail(
  blogId: string,
  formData: FormData,
): Promise<BlogActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { status: "error", message: MESSAGES.invalidImage };
  }
  return uploadImage({
    blogId,
    file,
    bucket: COVER_BUCKET,
    column: "thumbnail_url",
    maxBytes: COVER_MAX_BYTES,
  });
}

export async function uploadAuthorAvatar(
  blogId: string,
  formData: FormData,
): Promise<BlogActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { status: "error", message: MESSAGES.invalidImage };
  }
  return uploadImage({
    blogId,
    file,
    bucket: AUTHOR_BUCKET,
    column: "author_avatar_url",
    maxBytes: AUTHOR_MAX_BYTES,
  });
}

export async function removeBlogImage(input: {
  id: string;
  kind: "thumbnail" | "author";
}): Promise<BlogActionResult> {
  const session = await authorizeAdmin();
  if (session.status === "error") return session;

  const bucket = input.kind === "thumbnail" ? COVER_BUCKET : AUTHOR_BUCKET;

  const { data: existing, error: existingError } = await session.supabase
    .from("blogs")
    .select("id, slug, thumbnail_url, author_avatar_url")
    .eq("id", input.id)
    .maybeSingle();

  if (existingError) {
    return { status: "error", message: MESSAGES.genericError };
  }
  if (!existing) {
    return { status: "error", message: MESSAGES.notFound };
  }

  const url =
    input.kind === "thumbnail"
      ? existing.thumbnail_url
      : existing.author_avatar_url;
  await removeStorageUrlIfOwned(session.supabase, url, bucket);

  const { error } =
    input.kind === "thumbnail"
      ? await session.supabase
          .from("blogs")
          .update({ thumbnail_url: null })
          .eq("id", input.id)
      : await session.supabase
          .from("blogs")
          .update({ author_avatar_url: null })
          .eq("id", input.id);

  if (error) {
    return { status: "error", message: MESSAGES.genericError };
  }

  refreshBlogPaths(existing.slug);
  return { status: "success", message: MESSAGES.removeSuccess, id: input.id };
}
