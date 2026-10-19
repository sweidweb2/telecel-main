"use server";

import { revalidatePath } from "next/cache";
import { match, P } from "ts-pattern";

import { ROUTES } from "@/constants/routes";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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

type AdminSession =
  | {
      status: "success";
      userId: string;
      supabase: Awaited<ReturnType<typeof createClient>>;
    }
  | { status: "error"; message: string };

async function authorizeAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "You must be signed in." };
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    return {
      status: "error",
      message: "You do not have permission to manage users.",
    };
  }

  return { status: "success", userId: user.id, supabase };
}

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

  const session = await authorizeAdmin();
  if (session.status === "error") return session;

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

  const session = await authorizeAdmin();
  if (session.status === "error") return session;

  if (session.userId === parsed.data.id && parsed.data.role !== "admin") {
    return {
      status: "error",
      message: "You cannot remove your own administrator access.",
    };
  }

  const admin = createAdminClient();
  const { error: authError } = await admin.auth.admin.updateUserById(
    parsed.data.id,
    {
      email: parsed.data.email,
      user_metadata: { full_name: parsed.data.fullName },
    },
  );

  if (authError) {
    return {
      status: "error",
      message: mapSupabaseError(authError.message),
    };
  }

  const { error: profileError } = await session.supabase
    .from("profiles")
    .update({
      email: parsed.data.email,
      full_name: parsed.data.fullName,
      role: parsed.data.role,
    })
    .eq("id", parsed.data.id);

  if (profileError) {
    return {
      status: "error",
      message: mapSupabaseError(profileError.message),
    };
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

  const session = await authorizeAdmin();
  if (session.status === "error") return session;

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
