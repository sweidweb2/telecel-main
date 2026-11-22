import "server-only";

export const COVER_BUCKET = "blogs";
export const AUTHOR_BUCKET = "authors";
export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const AUTHOR_MAX_BYTES = 2 * 1024 * 1024;
/** Must match allowed_mime_types on the storage buckets (insights migration). */
export const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

type StorageBucket = {
  remove: (
    paths: string[],
  ) => Promise<{ data: unknown; error: { message?: string } | null }>;
  list: (
    path?: string,
    options?: { limit?: number; offset?: number },
  ) => Promise<{
    data: { name: string }[] | null;
    error: { message?: string } | null;
  }>;
};

type StorageClient = {
  storage: {
    from: (bucket: string) => StorageBucket;
  };
};

export type StorageCleanupResult = {
  ok: boolean;
  errorMessage?: string;
};

export function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function publicObjectUrl(
  supabaseUrl: string,
  bucket: string,
  path: string,
) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function storagePathFromPublicUrl(
  url: string | null | undefined,
  bucket: string,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function removeStorageUrlIfOwned(
  supabase: StorageClient,
  url: string | null | undefined,
  bucket: string,
): Promise<StorageCleanupResult> {
  const path = storagePathFromPublicUrl(url, bucket);
  if (!path) return { ok: true };

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    return {
      ok: false,
      errorMessage: error.message ?? "Storage remove failed",
    };
  }
  return { ok: true };
}

/** Best-effort delete of every object under `{prefix}/` (e.g. a blog id). */
export async function removeStoragePrefix(
  supabase: StorageClient,
  bucket: string,
  prefix: string,
): Promise<StorageCleanupResult> {
  const normalized = prefix.replace(/^\/+|\/+$/g, "");
  if (!normalized) return { ok: true };

  const pageSize = 100;
  let offset = 0;
  const paths: string[] = [];

  for (;;) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(normalized, { limit: pageSize, offset });

    if (error) {
      return {
        ok: false,
        errorMessage: error.message ?? "Storage list failed",
      };
    }

    const batch = data ?? [];
    for (const item of batch) {
      if (item.name) paths.push(`${normalized}/${item.name}`);
    }

    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  if (paths.length === 0) return { ok: true };

  const { error: removeError } = await supabase.storage
    .from(bucket)
    .remove(paths);

  if (removeError) {
    return {
      ok: false,
      errorMessage: removeError.message ?? "Storage remove failed",
    };
  }

  return { ok: true };
}
