"use server";

import { redirect } from "next/navigation";
import { match, P } from "ts-pattern";

import { recordActivity, recordAppError } from "@/actions/observability";
import { ACTION_GENERIC_ERROR } from "@/constants/action-messages";
import { loginPath, ROUTES } from "@/constants/routes";
import { allowSessionDuringMaintenance } from "@/data/auth";
import { allowAuthAuditWrite, signInOutcome } from "@/lib/auth-audit-throttle";
import { isGoogleAuthEnabled } from "@/lib/auth-config";
import { clientIp } from "@/lib/client-ip";
import { consumeRateLimit } from "@/lib/rate-limit";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { absoluteUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  updatePasswordSchema,
  type LoginInput,
  type UpdatePasswordInput,
} from "@/validations/auth";

export type AuthActionResult =
  | { status: "success"; message?: string; redirectTo?: string }
  | { status: "error"; message: string };

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const GENERIC_ERROR = ACTION_GENERIC_ERROR;
const RATE_LIMITED = "Too many attempts. Wait a few minutes and try again.";
const MAINTENANCE_LOGIN_BLOCKED =
  "Only administrators can sign in while maintenance is active.";

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  return match(lower)
    .with(
      P.when((value) => value.includes("invalid login credentials")),
      () => "Invalid email or password.",
    )
    .with(
      P.when((value) => value.includes("email not confirmed")),
      () => "Confirm your email before signing in.",
    )
    .with(
      P.when((value) => value.includes("banned")),
      () => "This account has been suspended.",
    )
    .with(
      P.when(
        (value) =>
          value.includes("same password") ||
          value.includes("different from the old"),
      ),
      () => "Choose a password you have not used before.",
    )
    .with(
      P.when((value) => value.includes("password")),
      () => "Password does not meet the requirements.",
    )
    .with(
      P.when((value) => value.includes("rate limit")),
      () => RATE_LIMITED,
    )
    .otherwise(() => GENERIC_ERROR);
}

export async function signIn(
  input: LoginInput,
  next?: string,
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
    // Log only the first throttled hit per IP per window, within the audit budget.
    if (
      consumeRateLimit(`audit:auth:ratelimited:${ip}`, 1, FIFTEEN_MINUTES) &&
      allowAuthAuditWrite(ip)
    ) {
      await recordActivity({
        actorId: null,
        action: "sign_in_failed",
        entityType: "auth",
        summary: { email: parsed.data.email, reason: "rate_limited" },
      });
    }
    return { status: "error", message: RATE_LIMITED };
  }

  const supabase = await createClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword(
    parsed.data,
  );
  if (error) {
    await recordActivity({
      actorId: null,
      action: "sign_in_failed",
      entityType: "auth",
      summary: {
        email: parsed.data.email,
        method: "password",
        code: error.code ?? null,
      },
    });
    const message = mapAuthError(error.message);
    // Expected denials stay quiet; provider/outage unknowns hit app_errors.
    if (message === GENERIC_ERROR) {
      await recordAppError({
        severity: "error",
        source: "actions.auth.signIn",
        code: error.code ?? null,
        message: error.message,
      });
    }
    return { status: "error", message };
  }

  // L1/L2: only active admins may establish a new session.
  const userId = signInData.user?.id ?? null;
  if (!(await allowSessionDuringMaintenance())) {
    await recordActivity({
      actorId: userId,
      action: "sign_in_blocked",
      entityType: "auth",
      entityId: userId,
      summary: { method: "password", reason: "maintenance" },
    });
    return { status: "error", message: MAINTENANCE_LOGIN_BLOCKED };
  }

  // sign_in only for active profiles with a role; requireStaff() signs the
  // rest out on the next request.
  const outcome = await signInOutcome();
  await recordActivity({
    actorId: userId,
    action: outcome.ok ? "sign_in" : "sign_in_blocked",
    entityType: "auth",
    entityId: userId,
    summary: outcome.ok
      ? { method: "password" }
      : { method: "password", reason: outcome.reason },
  });

  return {
    status: "success",
    message: "Signed in.",
    redirectTo: safeRedirectPath(next),
  };
}

export async function signInWithGoogle(
  next?: string,
): Promise<AuthActionResult> {
  // OAuth always starts; auth/callback rejects non-admins during maintenance.
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

  if (allowAuthAuditWrite(await clientIp())) {
    await recordActivity({
      actorId: null,
      action: "sign_in_started",
      entityType: "auth",
      summary: { method: "google" },
    });
  }
  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const actorId = claimsData?.claims?.sub ?? null;
  // "local" matches app/auth/sign-out/route.ts: other devices stay signed in.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (actorId) {
    await recordActivity({
      actorId,
      action: "sign_out",
      entityType: "auth",
      entityId: actorId,
      summary: { source: "action" },
    });
  }
  if (error) {
    await recordAppError({
      severity: "warning",
      source: "actions.auth.signOut",
      code: error.code ?? null,
      message: error.message,
    });
  }
  redirect(loginPath({ reason: "signed-out" }));
}

/** Sets a new password for the signed-in user (including recovery sessions). */
export async function updatePassword(
  input: UpdatePasswordInput,
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
      message: "Sign in again, then choose a new password.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    const message = mapAuthError(error.message);
    if (message === GENERIC_ERROR) {
      await recordAppError({
        severity: "error",
        source: "actions.auth.updatePassword",
        actorId: claimsData.claims.sub,
        code: error.code ?? null,
        message: error.message,
      });
    }
    return { status: "error", message };
  }

  // End every other session for this user; this browser keeps its session.
  const { error: signOutError } = await supabase.auth.signOut({
    scope: "others",
  });
  if (signOutError) {
    await recordAppError({
      severity: "warning",
      source: "actions.auth.updatePassword",
      actorId: claimsData.claims.sub,
      message: signOutError.message,
      context: { reason: "sign_out_others_failed_after_password_update" },
    });
  }

  await recordActivity({
    actorId: claimsData.claims.sub,
    action: "password_update",
    entityType: "auth",
    entityId: claimsData.claims.sub,
    summary: { otherSessionsRevoked: !signOutError },
  });

  return {
    status: "success",
    message: "Password updated.",
    redirectTo: ROUTES.dashboard,
  };
}
