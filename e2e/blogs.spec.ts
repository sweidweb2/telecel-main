import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";
import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.E2E_SEED_EMAIL ?? "asweid657@gmail.com";
const adminPassword = process.env.E2E_SEED_PASSWORD ?? "ali@1234";

function hasCredentials(): boolean {
  return Boolean(
    supabaseUrl &&
      anonKey &&
      serviceRoleKey &&
      !supabaseUrl.includes("placeholder") &&
      !anonKey.startsWith("placeholder"),
  );
}

function adminClient(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin E2E credentials are required.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

test.describe.configure({ mode: "serial" });

test.describe("blogs cms", () => {
  test.beforeEach(() => {
    test.skip(!hasCredentials(), "Blog E2E requires real Supabase credentials.");
  });

  test("admin can create draft then publish; public sees published only", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const suffix = nanoid(8).toLowerCase();
    const title = `E2E Blog ${suffix}`;
    const slug = `e2e-blog-${suffix}`;
    const admin = adminClient();

    try {
      await page.goto("/en/login?next=%2Fdashboard%2Fblogs%2Fnew");
      await page.getByLabel("Email").fill(adminEmail);
      await page.getByLabel("Password").fill(adminPassword);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard\/blogs\/new/, {
        timeout: 20_000,
      });

      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Slug").fill(slug);
      await page
        .getByLabel("Summary")
        .fill("E2E summary for the insights blog CMS coverage.");
      await page.getByLabel("Author", { exact: true }).fill("E2E Author");
      await page.locator(".ProseMirror").click();
      await page.keyboard.type(
        "This is the E2E body content for a published insight article.",
      );
      await page.getByRole("button", { name: "Create blog" }).click();

      const createdDialog = page.getByRole("dialog");
      await expect(
        createdDialog.getByRole("heading", { name: "Blog created" }),
      ).toBeVisible({ timeout: 20_000 });
      await createdDialog
        .getByRole("button", { name: "Edit this post" })
        .click();
      await expect(page).toHaveURL(/\/dashboard\/blogs\/[0-9a-f-]+/, {
        timeout: 20_000,
      });

      // Draft must not be publicly readable.
      const draftResponse = await page.goto(`/en/insights/${slug}`);
      expect(draftResponse?.status()).toBe(404);

      await page.goto("/dashboard/blogs");
      await page.getByRole("link", { name: new RegExp(title) }).click();
      await page.getByLabel("Published (visible on Insights)").click();
      await page.getByRole("button", { name: "Save changes" }).click();
      await expect(
        page.locator("[data-sonner-toast]").filter({
          hasText: "Blog updated successfully.",
        }),
      ).toBeVisible({ timeout: 20_000 });

      await page.goto(`/en/insights/${slug}`);
      await expect(page.getByRole("heading", { name: title })).toBeVisible({
        timeout: 20_000,
      });
    } finally {
      await admin.from("blogs").delete().eq("slug", slug);
    }
  });

  test("non-admin is redirected away from blogs", async ({ page }) => {
    test.setTimeout(60_000);
    if (!supabaseUrl || !anonKey) {
      throw new Error("Supabase credentials missing");
    }

    const suffix = nanoid(8).toLowerCase();
    const email = `blog.viewer.${suffix}@example.com`;
    const password = "Testpass1";
    const admin = adminClient();
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: "Blog E2E Viewer" },
        app_metadata: { app_role: "viewer" },
      });
    if (createError) throw createError;

    try {
      await page.goto("/en/login?next=%2Fdashboard%2Fblogs");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });

      await page.goto("/dashboard/blogs");
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
    } finally {
      await admin.auth.admin.deleteUser(created.user.id);
    }
  });
});
