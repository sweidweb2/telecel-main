"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { match, P } from "ts-pattern";

import { recordAppError } from "@/actions/observability";
import { loginPath, ROUTES } from "@/constants/routes";
import { isGoogleAuthEnabled } from "@/lib/auth-config";
import { consumeRateLimit } from "@/lib/rate-limit";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { absoluteUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  updatePasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type UpdatePasswordInput,
} from "@/validations/auth";

export type AuthActionResult =
  | { status: "success"; message?: string; redirectTo?: string }
  | { status: "error"; message: string };

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const GENERIC_ERROR = "Something went wrong. Please try again.";
const RATE_LIMITED = "Too many attempts. Wait a few minutes and try again.";

async function clientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  return match(lower)
    .with(
      P.when((value) => value.includes("invalid login credentials")),
      () => "Invalid email or password."
    )
    .with(
      P.when((value) => value.includes("email not confirmed")),
      () => "Confirm your email before signing in."
    )
    .with(
      P.when((value) => value.includes("banned")),
      () => "This account has been suspended."
    )
    .with(
      P.when(
        (value) =>
          value.includes("same password") || value.includes("different from the old")
      ),
      () => "Choose a password you have not used before."
    )
    .with(
      P.when((value) => value.includes("password")),
      () => "Password does not meet the requirements."
    )
    .with(
      P.when((value) => value.includes("rate limit")),
      () => RATE_LIMITED
    )
    .otherwise(() => GENERIC_ERROR);
}

export async function signIn(
  input: LoginInput,
  next?: string
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid login details.",
    };
  }

  const ip = await clientIp();
  if (
    !consumeRateLimit(`login:ip:${ip}`, 20, FIFTEEN_MINUTES) ||
    !consumeRateLimit(`login:email:${parsed.data.email}`, 5, FIFTEEN_MINUTES)
  ) {
    return { status: "error", message: RATE_LIMITED };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: mapAuthError(error.message) };

  return {
    status: "success",
    message: "Signed in.",
    redirectTo: safeRedirectPath(next),
  };
}

export async function signInWithGoogle(next?: string): Promise<AuthActionResult> {
  if (!isGoogleAuthEnabled()) {
    return { status: "error", message: "Google sign-in is not enabled." };
  }

  const callback = new URL(absoluteUrl(ROUTES.authCallback));
  callback.searchParams.set("next", safeRedirectPath(next));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callback.toString(),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    await recordAppError({
      severity: "error",
      source: "actions.auth.signInWithGoogle",
      code: error?.code ?? null,
      message: error?.message ?? "OAuth URL missing",
    });
    return { status: "error", message: GENERIC_ERROR };
  }

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(loginPath({ reason: "signed-out" }));
}

/**
 * Always reports success so the form cannot be used to discover which emails
 * have accounts. The email links to /auth/confirm (token_hash flow), which
 * works even when opened on a different device than the one that asked.
 */
export async function requestPasswordReset(
  input: ForgotPasswordInput
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Enter a valid email address.",
    };
  }

  const sent = {
    status: "success" as const,
    message:
      "If an account exists for that email, a reset link is on its way. It expires in 1 hour.",
  };

  const ip = await clientIp();
  if (
    !consumeRateLimit(`reset:ip:${ip}`, 10, ONE_HOUR) ||
    !consumeRateLimit(`reset:email:${parsed.data.email}`, 3, ONE_HOUR)
  ) {
    return sent;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: absoluteUrl(ROUTES.updatePassword) }
  );
  if (error) {
    console.error("[auth] resetPasswordForEmail failed", error.code ?? error.message);
    await recordAppError({
      severity: "error",
      source: "actions.auth.requestPasswordReset",
      code: error.code ?? null,
      message: error.message,
    });
  }

  return sent;
}

/** Sets a new password for the signed-in user (including recovery sessions). */
export async function updatePassword(
  input: UpdatePasswordInput
): Promise<AuthActionResult> {
  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the new password.",
    };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) {
    return {
      status: "error",
      message: "Your reset link has expired. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { status: "error", message: mapAuthError(error.message) };

  // End every other session for this user; this browser keeps its session.
  await supabase.auth.signOut({ scope: "others" });

  return {
    status: "success",
    message: "Password updated.",
    redirectTo: ROUTES.dashboard,
  };
}
