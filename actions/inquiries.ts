"use server";

import { revalidatePath } from "next/cache";

import { recordActivity, recordAppError } from "@/actions/observability";
import { ACTION_GENERIC_ERROR } from "@/constants/action-messages";
import { CONTACT_CONSENT_VERSION } from "@/constants/inquiries";
import { ROUTES } from "@/constants/routes";
import {
  authorizeAction,
  isActionAllowedDuringMaintenance,
  MAINTENANCE_ACTION_BLOCKED,
} from "@/data/auth";
import { clientIp } from "@/lib/client-ip";
import { consumeRateLimit, isRateLimited } from "@/lib/rate-limit";
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
const CONTACT_IP_LIMIT = 8;
const CONTACT_EMAIL_LIMIT = 3;
const RATE_LIMITED =
  "Too many inquiries from this network. Please try again later.";
const GENERIC_ERROR = ACTION_GENERIC_ERROR;

/** Public contact form — Turnstile + rate limit + service-role insert. */
export async function submitInquiry(
  input: SubmitInquiryInput,
): Promise<InquiryActionResult> {
  const parsed = submitInquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  if (!(await isActionAllowedDuringMaintenance())) {
    return { status: "error", message: MAINTENANCE_ACTION_BLOCKED };
  }

  const ip = await clientIp();
  const ipKey = `contact:ip:${ip}`;
  const emailKey = `contact:email:${parsed.data.email}`;
  // Cheap pre-check (records nothing) so throttled clients skip siteverify.
  if (
    isRateLimited(ipKey, CONTACT_IP_LIMIT, ONE_HOUR) ||
    isRateLimited(emailKey, CONTACT_EMAIL_LIMIT, ONE_HOUR)
  ) {
    return { status: "error", message: RATE_LIMITED };
  }

  const turnstile = await verifyTurnstileToken({
    token: parsed.data.turnstileToken,
    expectedAction: TURNSTILE_CONTACT_ACTION,
    remoteip: ip,
  });
  if (!turnstile.ok) {
    // Bot/challenge rejects stay quiet; misconfig and Cloudflare outages log.
    if (turnstile.reason !== "rejected") {
      await recordAppError({
        severity: turnstile.reason === "misconfigured" ? "error" : "warning",
        source: "actions.inquiries.submitInquiry.turnstile",
        message:
          turnstile.reason === "misconfigured"
            ? "Turnstile is misconfigured (secret or hostnames)."
            : "Turnstile siteverify failed (provider or network).",
        context: { reason: turnstile.reason },
      });
    }
    return {
      status: "error",
      message: "Security check failed. Refresh the page and try again.",
    };
  }

  // Quota is consumed only after Turnstile passes, so failed or expired
  // challenges do not burn a real visitor's attempts.
  if (
    !consumeRateLimit(ipKey, CONTACT_IP_LIMIT, ONE_HOUR) ||
    !consumeRateLimit(emailKey, CONTACT_EMAIL_LIMIT, ONE_HOUR)
  ) {
    return { status: "error", message: RATE_LIMITED };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("inquiries")
    .insert({
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
    })
    .select("id")
    .single();

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

  await recordActivity({
    actorId: null,
    action: "create",
    entityType: "inquiry",
    entityId: data.id,
    summary: {
      intent: parsed.data.intent,
      sourcePath: parsed.data.sourcePath ?? ROUTES.contact,
    },
  });

  revalidatePath(ROUTES.inquiries);
  return {
    status: "success",
    message: "Thanks — we received your inquiry and will be in touch.",
  };
}

/** Staff status update from the Inquiries portal. */
export async function updateInquiryStatus(
  input: UpdateInquiryStatusInput,
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
