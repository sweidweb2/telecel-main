import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import { unexpectedActionError } from "@/actions/observability";
import { ACTION_GENERIC_ERROR } from "@/constants/action-messages";
import { insightPath, ROUTES } from "@/constants/routes";
import { authorizeAction, MAINTENANCE_ACTION_BLOCKED } from "@/data/auth";
import { BLOGS_CACHE_TAG, blogSlugTag } from "@/lib/cache-tags";

export type BlogActionResult =
  | { status: "success"; message: string; id?: string }
  | { status: "error"; message: string };

export const BLOG_MESSAGES = {
  unauthorized: "You do not have permission to manage blogs.",
  signedInRequired: "You must be signed in.",
  invalidDetails: "Please check the form and try again.",
  createSuccess: "Blog created successfully.",
  updateSuccess: "Blog updated successfully.",
  deleteSuccess: "Blog deleted successfully.",
  uploadSuccess: "Image uploaded successfully.",
  removeSuccess: "Image removed successfully.",
  notFound: "Blog not found.",
  genericError: ACTION_GENERIC_ERROR,
  slugTaken: "That slug is already in use.",
  featuredTaken:
    "Another post is already featured. Unfeature it first, or save again.",
  invalidImage: "Please upload a JPEG, PNG or WebP image under the size limit.",
} as const;

export type StaffAuth = Extract<
  Awaited<ReturnType<typeof authorizeAction>>,
  { status: "success" }
>["session"];

export type StaffClient = StaffAuth["supabase"];

/** Admins and editors manage Insights; RLS (is_staff) re-checks in the DB. */
export async function authorizeStaff(): Promise<
  | { status: "success"; session: StaffAuth; supabase: StaffClient }
  | { status: "error"; message: string }
> {
  const auth = await authorizeAction("staff");
  if (auth.status === "error") return auth;
  return {
    status: "success",
    session: auth.session,
    supabase: auth.session.supabase,
  };
}

/** Postgres insufficient_privilege (42501) or a Storage RLS rejection. */
export function isRlsDenied(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false;
  return (
    error.code === "42501" ||
    (error.message ?? "").toLowerCase().includes("row-level security")
  );
}

export async function blogUnexpectedError(
  source: string,
  actorId: string | null | undefined,
  error: { code?: string; message?: string } | null,
): Promise<BlogActionResult> {
  // Staff passed the app gate but RLS denied the write: with
  // MAINTENANCE_FORCE_OFF set, the DB maintenance_on() row still blocks
  // non-admin writes, so surface the maintenance message, not a generic error.
  if (isRlsDenied(error)) {
    return { status: "error", message: MAINTENANCE_ACTION_BLOCKED };
  }
  return unexpectedActionError({
    source,
    actorId,
    error,
    userMessage: BLOG_MESSAGES.genericError,
  });
}

/**
 * Expires every public blog read after a create/update/delete/publish/media
 * change. `updateTag` (Server Actions only) makes the next request wait for
 * fresh data instead of serving stale content. Pass old and new slugs on rename.
 */
export function refreshBlogPaths(...slugs: (string | null | undefined)[]) {
  updateTag(BLOGS_CACHE_TAG);
  revalidatePath(ROUTES.blogs);
  revalidatePath(ROUTES.insights);
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(
    slugs.filter((value): value is string => Boolean(value)),
  )) {
    updateTag(blogSlugTag(slug));
    revalidatePath(insightPath(slug));
  }
}
