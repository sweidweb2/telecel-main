"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { Locale } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { isRateLimited, recordRateLimitHit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { TURNSTILE_APPLY_ACTION } from "@/types/turnstile";
import {
  deleteInterestRegistrationSchema,
  interestRegistrationSchemaFor,
  updateInterestRegistrationSchema,
  type DeleteInterestRegistrationInput,
  type InterestRegistrationInput,
  type UpdateInterestRegistrationInput,
} from "@/validations/interest-registration";

export type InterestRegistrationActionResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const ACTION_MESSAGES = {
  en: {
    invalidDetails: "Please check the form and try again.",
    success: "Thank you — your interest has been registered.",
    genericError: "Something went wrong. Please try again.",
    updateSuccess: "Registration updated successfully.",
    deleteSuccess: "Registration deleted successfully.",
    unauthorized: "You do not have permission to manage registrations.",
    signedInRequired: "You must be signed in.",
    notFound: "Registration not found.",
    rateLimited:
      "Too many submissions. Please wait and try again later.",
    duplicate:
      "You already registered this company with this email.",
    verificationFailed: "Security check failed. Please try again.",
  },
  fr: {
    invalidDetails: "Veuillez vérifier le formulaire et réessayer.",
    success: "Merci — votre intérêt a bien été enregistré.",
    genericError: "Une erreur s’est produite. Veuillez réessayer.",
    updateSuccess: "Candidature mise à jour avec succès.",
    deleteSuccess: "Candidature supprimée avec succès.",
    unauthorized: "Vous n’avez pas la permission de gérer les candidatures.",
    signedInRequired: "Vous devez être connecté.",
    notFound: "Candidature introuvable.",
    rateLimited:
      "Trop de soumissions. Veuillez patienter et réessayer plus tard.",
    duplicate:
      "Vous avez déjà enregistré cette entreprise avec cet e-mail.",
    verificationFailed:
      "La vérification de sécurité a échoué. Veuillez réessayer.",
  },
} as const;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_PER_IP = 5;
const RATE_LIMIT_PER_EMAIL = 3;

type AdminSession =
  | {
      status: "success";
      supabase: Awaited<ReturnType<typeof createClient>>;
    }
  | { status: "error"; message: string };

async function authorizeAdmin(locale: Locale): Promise<AdminSession> {
  const copy = ACTION_MESSAGES[locale];
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: copy.signedInRequired };
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    return { status: "error", message: copy.unauthorized };
  }

  return { status: "success", supabase };
}

function validationMessage(
  error: { issues: { message: string }[] },
  locale: Locale,
): string {
  return (
    error.issues[0]?.message ?? ACTION_MESSAGES[locale].invalidDetails
  );
}

function isUniqueViolation(error: {
  code?: string;
  message?: string;
}): boolean {
  if (error.code === "23505") return true;
  const message = (error.message ?? "").toLowerCase();
  return message.includes("interest_registrations_email_company");
}

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerStore.get("x-real-ip")?.trim() || "unknown";
}

function refreshRegistrationsRoute() {
  revalidatePath(ROUTES.registrations);
}

export async function submitInterestRegistration(
  input: InterestRegistrationInput,
): Promise<InterestRegistrationActionResult> {
  const locale = await getRequestLocale();
  const copy = ACTION_MESSAGES[locale];
  const parsed = interestRegistrationSchemaFor(locale).safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? copy.invalidDetails,
    };
  }

  const {
    fullName,
    email,
    phone,
    companyName,
    sector,
    country,
    pitch,
    consent,
    turnstileToken,
  } = parsed.data;

  const ip = await getClientIp();
  const turnstileOk = await verifyTurnstileToken({
    token: turnstileToken,
    expectedAction: TURNSTILE_APPLY_ACTION,
    remoteip: ip,
  });
  if (!turnstileOk) {
    return { status: "error", message: copy.verificationFailed };
  }

  const ipKey = `apply:ip:${ip}`;
  const emailKey = `apply:email:${email}`;

  if (
    isRateLimited(ipKey, RATE_LIMIT_PER_IP, RATE_LIMIT_WINDOW_MS) ||
    isRateLimited(emailKey, RATE_LIMIT_PER_EMAIL, RATE_LIMIT_WINDOW_MS)
  ) {
    return { status: "error", message: copy.rateLimited };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("interest_registrations").insert({
    full_name: fullName,
    email,
    phone,
    company_name: companyName,
    sector,
    country,
    pitch,
    consent,
  });

  if (error) {
    if (isUniqueViolation(error)) {
      return { status: "error", message: copy.duplicate };
    }
    return { status: "error", message: copy.genericError };
  }

  recordRateLimitHit(ipKey, RATE_LIMIT_WINDOW_MS);
  recordRateLimitHit(emailKey, RATE_LIMIT_WINDOW_MS);

  refreshRegistrationsRoute();
  return { status: "success", message: copy.success };
}

export async function updateInterestRegistration(
  input: UpdateInterestRegistrationInput,
): Promise<InterestRegistrationActionResult> {
  const locale = await getRequestLocale();
  const copy = ACTION_MESSAGES[locale];
  const parsed = updateInterestRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error, locale) };
  }

  const session = await authorizeAdmin(locale);
  if (session.status === "error") return session;

  const { id, fullName, email, phone, companyName, sector, country, pitch } =
    parsed.data;

  const { data, error } = await session.supabase
    .from("interest_registrations")
    .update({
      full_name: fullName,
      email,
      phone,
      company_name: companyName,
      sector,
      country,
      pitch,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (isUniqueViolation(error)) {
      return { status: "error", message: copy.duplicate };
    }
    return { status: "error", message: copy.genericError };
  }

  if (!data) {
    return { status: "error", message: copy.notFound };
  }

  refreshRegistrationsRoute();
  return { status: "success", message: copy.updateSuccess };
}

export async function deleteInterestRegistration(
  input: DeleteInterestRegistrationInput,
): Promise<InterestRegistrationActionResult> {
  const locale = await getRequestLocale();
  const copy = ACTION_MESSAGES[locale];
  const parsed = deleteInterestRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error, locale) };
  }

  const session = await authorizeAdmin(locale);
  if (session.status === "error") return session;

  const { data, error } = await session.supabase
    .from("interest_registrations")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { status: "error", message: copy.genericError };
  }

  if (!data) {
    return { status: "error", message: copy.notFound };
  }

  refreshRegistrationsRoute();
  return { status: "success", message: copy.deleteSuccess };
}
