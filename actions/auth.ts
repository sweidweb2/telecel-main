"use server";

import { redirect } from "next/navigation";
import { match, P } from "ts-pattern";

import { authActionMessagesFor } from "@/components/auth/auth-labels";
import type { Locale } from "@/constants/locales";
import { authPath, ROUTES } from "@/constants/routes";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchemaFor,
  registerSchemaFor,
  type LoginInput,
  type RegisterInput,
} from "@/validations/auth";

export type AuthActionResult =
  | { status: "success"; message?: string; redirectTo?: string }
  | { status: "error"; message: string };

function mapAuthError(message: string, locale: Locale): string {
  const copy = authActionMessagesFor(locale);
  const lower = message.toLowerCase();

  return match(lower)
    .with(
      P.when(
        (value) =>
          value.includes("invalid login credentials") ||
          value.includes("invalid credentials")
      ),
      () => copy.invalidCredentials
    )
    .with(
      P.when(
        (value) =>
          value.includes("already registered") ||
          value.includes("user already registered") ||
          value.includes("already been registered") ||
          value.includes("email address is already")
      ),
      () => copy.emailExists
    )
    .with(
      P.when(
        (value) =>
          value.includes("password") &&
          (value.includes("weak") ||
            value.includes("at least") ||
            value.includes("too short") ||
            value.includes("should be"))
      ),
      () => copy.weakPassword
    )
    .with(
      P.when((value) => value.includes("email not confirmed")),
      () => copy.emailNotConfirmed
    )
    .otherwise(() => message || copy.genericError);
}

function safeRedirectPath(path: string | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return ROUTES.dashboard;
  }
  return path;
}

export async function signUp(
  input: RegisterInput
): Promise<AuthActionResult> {
  const locale = await getRequestLocale();
  const copy = authActionMessagesFor(locale);
  const parsed = registerSchemaFor(locale).safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? copy.invalidSignupDetails,
    };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: mapAuthError(error.message, locale) };
  }

  // Supabase may return a user with empty identities for existing emails.
  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    return {
      status: "error",
      message: copy.emailExists,
    };
  }

  if (data.session) {
    return {
      status: "success",
      message: copy.accountCreated,
      redirectTo: ROUTES.dashboard,
    };
  }

  return {
    status: "success",
    message: copy.confirmEmail,
  };
}

export async function signIn(
  input: LoginInput,
  redirectTo?: string
): Promise<AuthActionResult> {
  const locale = await getRequestLocale();
  const copy = authActionMessagesFor(locale);
  const parsed = loginSchemaFor(locale).safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? copy.invalidLoginDetails,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: mapAuthError(error.message, locale) };
  }

  return {
    status: "success",
    message: copy.signedIn,
    redirectTo: safeRedirectPath(redirectTo),
  };
}

export async function signOut(): Promise<void> {
  const locale = await getRequestLocale();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(authPath(locale, "login"));
}
