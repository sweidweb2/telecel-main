import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { unexpectedActionError } from "@/actions/observability";
import { insightPath, ROUTES } from "@/constants/routes";
import { authorizeAction } from "@/data/auth";
import { BLOGS_CACHE_TAG } from "@/data/blogs";

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
  genericError: "Something went wrong. Please try again.",
  slugTaken: "That slug is already in use.",
  featuredTaken:
    "Another post is already featured. Unfeature it first, or save again.",
  invalidImage:
    "Please upload a JPEG, PNG or WebP image under the size limit.",
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

export async function blogUnexpectedError(
  source: string,
  actorId: string | null | undefined,
  error: { code?: string; message?: string } | null,
): Promise<BlogActionResult> {
  return unexpectedActionError({
    source,
    actorId,
    error,
    userMessage: BLOG_MESSAGES.genericError,
  });
}

/** Revalidates listings, the sitemap and every detail path that changed. */
export function refreshBlogPaths(...slugs: (string | null | undefined)[]) {
  revalidateTag(BLOGS_CACHE_TAG, "max");
  revalidatePath(ROUTES.blogs);
  revalidatePath(ROUTES.insights);
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(insightPath(slug as string));
  }
}
