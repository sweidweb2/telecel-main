"use server";

import { revalidatePath } from "next/cache";

import {
  recordActivity,
  recordAppError,
  unexpectedActionError,
} from "@/actions/observability";
import { ROUTES } from "@/constants/routes";
import { authorizeAction } from "@/data/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type DeleteUserInput,
  type UpdateUserInput,
} from "@/validations/users";

export type UserActionResult =
  { status: "success"; message: string } | { status: "error"; message: string };

function validationMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Check the submitted user details.";
}

const USER_ERROR_RULES = [
  {
    match: (value: string) =>
      value.includes("already registered") ||
      value.includes("already been registered") ||
      value.includes("duplicate"),
    message: "A user with this email already exists.",
    expected: true,
  },
  {
    match: (value: string) => value.includes("password"),
    message: "The password does not meet the project requirements.",
    expected: true,
  },
  {
    match: (value: string) => value.includes("last active administrator"),
    message: "You cannot remove the last active administrator.",
    expected: true,
  },
] as const;

function classifyUserError(message: string): {
  userMessage: string;
  isExpected: boolean;
} {
  const lower = message.toLowerCase();
  const rule = USER_ERROR_RULES.find((entry) => entry.match(lower));
  if (rule) return { userMessage: rule.message, isExpected: rule.expected };
  return {
    userMessage: message || "The user operation failed.",
    isExpected: false,
  };
}

function refreshUsersRoute() {
  revalidatePath(ROUTES.users);
}

async function userUnexpectedError(
  source: string,
  actorId: string,
  error: { code?: string; message?: string },
): Promise<UserActionResult> {
  const classified = classifyUserError(error.message ?? "");
  return unexpectedActionError({
    source,
    actorId,
    error,
    isExpected: classified.isExpected,
    userMessage: classified.userMessage,
  });
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserActionResult> {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.fullName },
    app_metadata: { app_role: parsed.data.role },
  });

  if (error) {
    return userUnexpectedError(
      "actions.users.createUser",
      auth.session.userId,
      error,
    );
  }

  // Auth Admin createUser sets app_metadata, but the handle_new_user trigger
  // can still insert profiles.role as NULL on hosted projects. profiles.role
  // is authoritative for CMS access — upsert it explicitly.
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .upsert(
      {
        id: data.user.id,
        role: parsed.data.role,
        full_name: parsed.data.fullName,
        email: parsed.data.email,
      },
      { onConflict: "id" },
    )
    .select("id")
    .maybeSingle();

  if (profileError || !profile) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(
      data.user.id,
    );
    if (deleteError) {
      await recordAppError({
        severity: "error",
        source: "actions.users.createUser",
        actorId: auth.session.userId,
        code: deleteError.code ?? null,
        message: deleteError.message,
        context: {
          orphanAuthUserId: data.user.id,
          reason: "compensating_delete_failed",
        },
      });
    }
    return userUnexpectedError(
      "actions.users.createUser",
      auth.session.userId,
      profileError ?? { message: "Profile row was not created." },
    );
  }

  await recordActivity({
    actorId: auth.session.userId,
    action: "invite",
    entityType: "user",
    entityId: data.user.id,
    summary: { role: parsed.data.role, email: parsed.data.email },
  });

  refreshUsersRoute();
  return { status: "success", message: "User created successfully." };
}

export async function updateUser(
  input: UpdateUserInput,
): Promise<UserActionResult> {
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;
  const { session } = auth;

  const isSelf = session.userId === parsed.data.id;
  if (isSelf && (parsed.data.role !== "admin" || !parsed.data.isActive)) {
    return {
      status: "error",
      message: "You cannot remove your own administrator access.",
    };
  }

  const { data: before } = await session.supabase
    .from("profiles")
    .select("role, is_active, email, full_name")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (!before) {
    return { status: "error", message: "User not found." };
  }

  const admin = createAdminClient();

  // One profile write (incl. email). authorizeAction("admin") already gated;
  // last-admin trigger still runs for service_role.
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      role: parsed.data.role,
      is_active: parsed.data.isActive,
      email: parsed.data.email,
    })
    .eq("id", parsed.data.id);

  if (profileError) {
    return userUnexpectedError(
      "actions.users.updateUser",
      session.userId,
      profileError,
    );
  }

  const roleChanged = before.role !== parsed.data.role;
  const authNeedsUpdate =
    before.email !== parsed.data.email ||
    before.full_name !== parsed.data.fullName ||
    before.is_active !== parsed.data.isActive ||
    roleChanged;

  if (authNeedsUpdate) {
    const { error: authError } = await admin.auth.admin.updateUserById(
      parsed.data.id,
      {
        email: parsed.data.email,
        user_metadata: { full_name: parsed.data.fullName },
        ban_duration: parsed.data.isActive ? "none" : "876000h",
        // Keep JWT app_role in sync with profiles.role (proxy isAdminClaim).
        ...(roleChanged
          ? { app_metadata: { app_role: parsed.data.role } }
          : {}),
      },
    );

    if (authError) {
      const { error: revertError } = await admin
        .from("profiles")
        .update({
          full_name: before.full_name,
          role: before.role,
          is_active: before.is_active,
          email: before.email,
        })
        .eq("id", parsed.data.id);

      if (revertError) {
        await recordAppError({
          severity: "error",
          source: "actions.users.updateUser",
          actorId: session.userId,
          code: revertError.code ?? null,
          message: revertError.message,
          context: {
            userId: parsed.data.id,
            reason: "profile_revert_after_auth_failure",
          },
        });
      }

      return userUnexpectedError(
        "actions.users.updateUser",
        session.userId,
        authError,
      );
    }
  }

  const action =
    before.role !== parsed.data.role
      ? "role_change"
      : before.is_active !== parsed.data.isActive
        ? parsed.data.isActive
          ? "reactivate"
          : "suspend"
        : "update";

  await recordActivity({
    actorId: session.userId,
    action,
    entityType: "user",
    entityId: parsed.data.id,
    summary: {
      role: parsed.data.role,
      isActive: parsed.data.isActive,
      email: parsed.data.email,
    },
  });

  refreshUsersRoute();
  return { status: "success", message: "User updated successfully." };
}

export async function deleteUser(
  input: DeleteUserInput,
): Promise<UserActionResult> {
  const parsed = deleteUserSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: validationMessage(parsed.error) };
  }

  const auth = await authorizeAction("admin");
  if (auth.status === "error") return auth;
  const { session } = auth;

  if (session.userId === parsed.data.id) {
    return { status: "error", message: "You cannot delete your own account." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(parsed.data.id);

  if (error) {
    return userUnexpectedError(
      "actions.users.deleteUser",
      session.userId,
      error,
    );
  }

  await recordActivity({
    actorId: session.userId,
    action: "delete",
    entityType: "user",
    entityId: parsed.data.id,
  });

  refreshUsersRoute();
  return { status: "success", message: "User deleted successfully." };
}
