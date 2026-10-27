import "server-only";

export const COVER_BUCKET = "blogs";
export const AUTHOR_BUCKET = "authors";
export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const AUTHOR_MAX_BYTES = 2 * 1024 * 1024;
/** Must match allowed_mime_types on the storage buckets (insights migration). */
export const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

type StorageClient = {
  storage: {
    from: (bucket: string) => {
      remove: (paths: string[]) => Promise<unknown>;
    };
  };
};

export function extensionForMime(mime: string): string {
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
) {
  const path = storagePathFromPublicUrl(url, bucket);
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}
