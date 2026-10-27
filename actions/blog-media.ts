"use server";

import { nanoid } from "nanoid";

import { recordActivity } from "@/actions/observability";
import {
  authorizeStaff,
  blogUnexpectedError,
  BLOG_MESSAGES,
  refreshBlogPaths,
  type BlogActionResult,
} from "@/actions/blog-shared";
import {
  ALLOWED_MIME,
  AUTHOR_BUCKET,
  AUTHOR_MAX_BYTES,
  COVER_BUCKET,
  COVER_MAX_BYTES,
  extensionForMime,
  publicObjectUrl,
  removeStorageUrlIfOwned,
} from "@/lib/blog-storage";

async function uploadImage(options: {
  blogId: string;
  file: File;
  bucket: typeof COVER_BUCKET | typeof AUTHOR_BUCKET;
  column: "thumbnail_url" | "author_avatar_url";
  maxBytes: number;
}): Promise<BlogActionResult> {
  const { blogId, file, bucket, column, maxBytes } = options;

  if (!ALLOWED_MIME.has(file.type) || file.size <= 0 || file.size > maxBytes) {
    return { status: "error", message: BLOG_MESSAGES.invalidImage };
  }

  const session = await authorizeStaff();
  if (session.status === "error") return session;

  const { data: existing, error: existingError } = await session.supabase
    .from("blogs")
    .select("id, slug, thumbnail_url, author_avatar_url")
    .eq("id", blogId)
    .maybeSingle();

  if (existingError) {
    return blogUnexpectedError(
      "actions.blog-media.uploadImage",
      session.session.userId,
      existingError,
    );
  }
  if (!existing) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
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
    return blogUnexpectedError(
      "actions.blog-media.uploadImage",
      session.session.userId,
      uploadError,
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return blogUnexpectedError(
      "actions.blog-media.uploadImage",
      session.session.userId,
      { message: "Missing NEXT_PUBLIC_SUPABASE_URL" },
    );
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
    return blogUnexpectedError(
      "actions.blog-media.uploadImage",
      session.session.userId,
      updateError,
    );
  }

  await removeStorageUrlIfOwned(session.supabase, previousUrl, bucket);
  await recordActivity({
    actorId: session.session.userId,
    action: "update",
    entityType: "blog",
    entityId: blogId,
    summary: { image: column },
  });
  refreshBlogPaths(existing.slug);
  return {
    status: "success",
    message: BLOG_MESSAGES.uploadSuccess,
    id: blogId,
  };
}

export async function uploadBlogThumbnail(
  blogId: string,
  formData: FormData,
): Promise<BlogActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { status: "error", message: BLOG_MESSAGES.invalidImage };
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
    return { status: "error", message: BLOG_MESSAGES.invalidImage };
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
  const session = await authorizeStaff();
  if (session.status === "error") return session;

  const bucket = input.kind === "thumbnail" ? COVER_BUCKET : AUTHOR_BUCKET;

  const { data: existing, error: existingError } = await session.supabase
    .from("blogs")
    .select("id, slug, thumbnail_url, author_avatar_url")
    .eq("id", input.id)
    .maybeSingle();

  if (existingError) {
    return blogUnexpectedError(
      "actions.blog-media.removeBlogImage",
      session.session.userId,
      existingError,
    );
  }
  if (!existing) {
    return { status: "error", message: BLOG_MESSAGES.notFound };
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
    return blogUnexpectedError(
      "actions.blog-media.removeBlogImage",
      session.session.userId,
      error,
    );
  }

  await recordActivity({
    actorId: session.session.userId,
    action: "update",
    entityType: "blog",
    entityId: input.id,
    summary: { removedImage: input.kind },
  });

  refreshBlogPaths(existing.slug);
  return {
    status: "success",
    message: BLOG_MESSAGES.removeSuccess,
    id: input.id,
  };
}
