"use server";

import { revalidatePath } from "next/cache";
import { match, P } from "ts-pattern";

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
  | { status: "success"; message: string }
  | { status: "error"; message: string };

function validationMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Check the submitted user details.";
}

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();

  return match(lower)
    .with(
      P.when(
        (value) =>
          value.includes("already registered") ||
          value.includes("already been registered") ||
          value.includes("duplicate"),
      ),
      () => "A user with this email already exists.",
    )
    .with(
      P.when((value) => value.includes("password")),
      () => "The password does not meet the project requirements.",
    )
    .otherwise(() => message || "The user operation failed.");
}

function refreshUsersRoute() {
  revalidatePath(ROUTES.users);
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
  const { error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.fullName },
    app_metadata: { app_role: parsed.data.role },
  });

  if (error) {
    return { status: "error", message: mapSupabaseError(error.message) };
  }

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

  // Auth side: email, display name, and a ban while suspended so refresh
  // tokens stop working immediately (not just at the next RLS check).
  const admin = createAdminClient();
  const { error: authError } = await admin.auth.admin.updateUserById(
    parsed.data.id,
    {
      email: parsed.data.email,
      user_metadata: { full_name: parsed.data.fullName },
      ban_duration: parsed.data.isActive ? "none" : "876000h",
    },
  );

  if (authError) {
    return {
      status: "error",
      message: mapSupabaseError(authError.message),
    };
  }

  // Role and status go through the caller's session so RLS (is_admin) and the
  // protect_profile_access_fields trigger check them again in the database.
  const { error: profileError } = await session.supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      role: parsed.data.role,
      is_active: parsed.data.isActive,
    })
    .eq("id", parsed.data.id);

  if (profileError) {
    return {
      status: "error",
      message: mapSupabaseError(profileError.message),
    };
  }

  // profiles.email mirrors Auth and is only writable by the service role.
  const { error: emailError } = await admin
    .from("profiles")
    .update({ email: parsed.data.email })
    .eq("id", parsed.data.id);

  if (emailError) {
    return { status: "error", message: mapSupabaseError(emailError.message) };
  }

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
    return { status: "error", message: mapSupabaseError(error.message) };
  }

  refreshUsersRoute();
  return { status: "success", message: "User deleted successfully." };
}
