import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, type Page } from "@playwright/test";
import { nanoid } from "nanoid";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Seeded admin (supabase/seed.sql locally; repo secrets in CI). */
export const adminEmail = process.env.E2E_SEED_EMAIL ?? "admin@telecel.local";
export const adminPassword = process.env.E2E_SEED_PASSWORD ?? "LocalAdmin#2026";

export const TEST_PASSWORD = "E2eStrongPass1";

/** True only with a real Supabase project (not the CI build placeholders). */
export function hasSupabaseCredentials(): boolean {
  return Boolean(
    supabaseUrl &&
      anonKey &&
      serviceRoleKey &&
      !supabaseUrl.includes("placeholder") &&
      !anonKey.startsWith("placeholder")
  );
}

export function adminClient(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin E2E credentials are required.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function anonClient(): SupabaseClient {
  if (!supabaseUrl || !anonKey) throw new Error("Supabase credentials missing.");
  return createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Creates a confirmed user; `role: null` = account without CMS access. */
export async function createTestUser(role: "admin" | "editor" | null) {
  const email = `e2e.${role ?? "norole"}.${nanoid(8).toLowerCase()}@example.com`;
  const admin = adminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: `E2E ${role ?? "No role"}` },
    app_metadata: role ? { app_role: role } : {},
  });
  if (error) throw error;

  // Hosted Auth can create the auth user with app_metadata set while the
  // handle_new_user trigger still inserts profiles.role as NULL. Force the
  // authoritative CMS role on the profile so E2E matches production invites.
  if (role) {
    const { error: roleError } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", data.user.id);
    if (roleError) {
      await admin.auth.admin.deleteUser(data.user.id);
      throw roleError;
    }
  }

  return {
    id: data.user.id,
    email,
    password: TEST_PASSWORD,
    cleanup: async () => {
      await adminClient().auth.admin.deleteUser(data.user.id);
    },
  };
}

export async function signInViaForm(
  page: Page,
  email: string,
  password: string,
  next?: string
) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export async function expectOnDashboard(page: Page, path = "/dashboard") {
  await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, "\\/")}(\\?.*)?$`), {
    timeout: 20_000,
  });
}
