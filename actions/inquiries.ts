"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { recordActivity, recordAppError } from "@/actions/observability";
import {
  CONTACT_CONSENT_VERSION,
} from "@/constants/inquiries";
import { ROUTES } from "@/constants/routes";
import { authorizeAction } from "@/data/auth";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  TURNSTILE_CONTACT_ACTION,
  verifyTurnstileToken,
} from "@/lib/turnstile";
import {
  submitInquirySchema,
  updateInquiryStatusSchema,
  type SubmitInquiryInput,
  type UpdateInquiryStatusInput,
} from "@/validations/inquiries";

export type InquiryActionResult =
  | { status: "success"; message?: string }
  | { status: "error"; message: string };

const ONE_HOUR = 60 * 60 * 1000;
const RATE_LIMITED =
  "Too many inquiries from this network. Please try again later.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

async function clientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

/** Public contact form — Turnstile + rate limit + service-role insert. */
export async function submitInquiry(
  input: SubmitInquiryInput
): Promise<InquiryActionResult> {
  const parsed = submitInquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const ip = await clientIp();
  if (
    !consumeRateLimit(`contact:ip:${ip}`, 8, ONE_HOUR) ||
    !consumeRateLimit(`contact:email:${parsed.data.email}`, 3, ONE_HOUR)
  ) {
    return { status: "error", message: RATE_LIMITED };
  }

  const turnstileOk = await verifyTurnstileToken({
    token: parsed.data.turnstileToken,
    expectedAction: TURNSTILE_CONTACT_ACTION,
    remoteip: ip,
  });
  if (!turnstileOk) {
    return {
      status: "error",
      message: "Security check failed. Refresh the page and try again.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("inquiries").insert({
    intent: parsed.data.intent,
    full_name: parsed.data.fullName,
    company: parsed.data.company,
    job_role: parsed.data.jobRole,
    email: parsed.data.email,
    country_code: parsed.data.countryCode,
    area_of_interest: parsed.data.areaOfInterest,
    business_need: parsed.data.businessNeed,
    preferred_contact_method: parsed.data.preferredContactMethod,
    consent: true,
    consent_text_version: CONTACT_CONSENT_VERSION,
    source_path: parsed.data.sourcePath ?? ROUTES.contact,
  });

  if (error) {
    console.error("[inquiries] insert failed", error.code ?? error.message);
    await recordAppError({
      severity: "error",
      source: "actions.inquiries.submitInquiry",
      code: error.code ?? null,
      message: error.message,
    });
    return { status: "error", message: GENERIC_ERROR };
  }

  revalidatePath(ROUTES.inquiries);
  return {
    status: "success",
    message: "Thanks — we received your inquiry and will be in touch.",
  };
}

/** Staff status update from the Inquiries portal. */
export async function updateInquiryStatus(
  input: UpdateInquiryStatusInput
): Promise<InquiryActionResult> {
  const parsed = updateInquiryStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid status update.",
    };
  }

  const auth = await authorizeAction("staff");
  if (auth.status === "error") {
    return { status: "error", message: auth.message };
  }

  const { error } = await auth.session.supabase
    .from("inquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    await recordAppError({
      severity: "error",
      source: "actions.inquiries.updateInquiryStatus",
      code: error.code ?? null,
      message: error.message,
      actorId: auth.session.userId,
    });
    return { status: "error", message: GENERIC_ERROR };
  }

  await recordActivity({
    actorId: auth.session.userId,
    action: "update",
    entityType: "inquiry",
    entityId: parsed.data.id,
    summary: { status: parsed.data.status },
  });

  revalidatePath(ROUTES.inquiries);
  revalidatePath(`${ROUTES.inquiries}/${parsed.data.id}`);
  return { status: "success", message: "Status updated." };
}
