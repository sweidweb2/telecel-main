import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

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

async function findUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await adminClient().auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw error;
  return data.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );
}

async function cleanupUser(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return;
  const { error } = await adminClient().auth.admin.deleteUser(user.id);
  if (error) throw error;
}

test.describe("admin users CRUD", () => {
  test.beforeEach(() => {
    test.skip(
      !hasCredentials(),
      "Users E2E requires real Supabase credentials.",
    );
  });

  test("admin can list, create, view, edit, and delete a user", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const suffix = nanoid(8).toLowerCase();
    const email = `users.e2e.${suffix}@example.com`;
    const password = "Testpass1";

    try {
      await page.goto("/en/login?next=%2Fdashboard%2Fusers");
      await page.getByLabel("Email").fill(adminEmail);
      await page.getByLabel("Password").fill(adminPassword);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard\/users/, { timeout: 20_000 });

      await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
      await expect(page.getByText("Total users")).toBeVisible();

      for (const width of [375, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        const metrics = await page.evaluate(() => ({
          viewport: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflow: Array.from(document.querySelectorAll("body *"))
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                tag: element.tagName,
                slot: element.getAttribute("data-slot"),
                className: element.getAttribute("class"),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
              };
            })
            .filter((item) => item.right > window.innerWidth + 1)
            .slice(0, 8),
        }));
        expect(
          metrics.scrollWidth <= metrics.viewport,
          JSON.stringify(metrics),
        ).toBe(true);
      }

      await page.getByRole("button", { name: "Create user" }).click();
      const createDialog = page.getByRole("dialog");
      await createDialog
        .getByRole("button", { name: "Create user", exact: true })
        .click();
      await expect(
        createDialog.getByText("Full name must be at least 2 characters"),
      ).toBeVisible();
      await createDialog.getByLabel("Full name").fill("Users E2E Viewer");
      await createDialog.getByLabel("Email").fill(email);
      await createDialog.getByLabel("Temporary password").fill(password);
      await createDialog
        .getByRole("button", { name: "Create user", exact: true })
        .click();
      await expect(
        createDialog.getByRole("button", { name: "Creating…" }),
      ).toBeDisabled();
      await expect(
        page.locator("[data-sonner-toast]").filter({ hasText: "User created" }),
      ).toBeVisible({ timeout: 20_000 });

      await page.getByRole("button", { name: "Create user" }).click();
      const duplicateDialog = page.getByRole("dialog");
      await duplicateDialog.getByLabel("Full name").fill("Duplicate E2E User");
      await duplicateDialog.getByLabel("Email").fill(email);
      await duplicateDialog.getByLabel("Temporary password").fill(password);
      await duplicateDialog
        .getByRole("button", { name: "Create user", exact: true })
        .click();
      await expect(
        page.locator("[data-sonner-toast][data-type='error']").filter({
          hasText: /already exists/i,
        }),
      ).toBeVisible({ timeout: 20_000 });
      await duplicateDialog.getByRole("button", { name: "Cancel" }).click();

      await page.getByLabel("Search users").fill(email);
      await expect(page).toHaveURL(/search=users.e2e/, { timeout: 15_000 });

      const row = page.getByRole("row").filter({ hasText: email });
      await expect(row).toBeVisible();
      await row.getByRole("button", { name: `View ${email}` }).click();
      await expect(page.getByRole("dialog").getByText(email)).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();

      await row.getByRole("button", { name: `Edit ${email}` }).click();
      const editDialog = page.getByRole("dialog");
      await editDialog.getByLabel("Full name").fill("Users E2E Admin");
      await editDialog.getByRole("button", { name: "Save changes" }).click();
      await expect(
        editDialog.getByRole("button", { name: "Saving…" }),
      ).toBeDisabled();
      await expect(
        page.locator("[data-sonner-toast]").filter({ hasText: "User updated" }),
      ).toBeVisible({ timeout: 20_000 });
      await expect(
        page.getByRole("row").filter({ hasText: email }),
      ).toContainText("admin");

      await page
        .getByRole("row")
        .filter({ hasText: email })
        .getByRole("button", { name: `Delete ${email}` })
        .click();
      const deleteDialog = page.getByRole("dialog");
      await expect(deleteDialog.getByText(/cannot be undone/i)).toBeVisible();
      await deleteDialog
        .getByRole("button", { name: "Delete user", exact: true })
        .click();
      await expect(
        deleteDialog.getByRole("button", { name: "Deleting…" }),
      ).toBeDisabled();
      await expect(
        page.locator("[data-sonner-toast]").filter({ hasText: "User deleted" }),
      ).toBeVisible({ timeout: 20_000 });
      await expect(
        page.getByRole("row").filter({ hasText: email }),
      ).toHaveCount(0);
      await expect(page.getByText("No users found")).toBeVisible();
    } finally {
      await cleanupUser(email);
    }
  });

  test("viewer cannot open the users page or read and mutate other profiles", async ({
    page,
  }) => {
    if (!supabaseUrl || !anonKey)
      throw new Error("Supabase credentials missing");

    const suffix = nanoid(8).toLowerCase();
    const email = `viewer.e2e.${suffix}@example.com`;
    const password = "Testpass1";
    const admin = adminClient();
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: "RLS E2E Viewer" },
        app_metadata: { app_role: "viewer" },
      });
    if (createError) throw createError;

    try {
      await page.goto("/en/login?next=%2Fdashboard%2Fusers");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });

      await page.goto("/dashboard/users");
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
      await expect(
        page.getByRole("button", { name: "Create user" }),
      ).toHaveCount(0);

      const viewerClient = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error: signInError } = await viewerClient.auth.signInWithPassword(
        {
          email,
          password,
        },
      );
      if (signInError) throw signInError;

      const { data: visibleProfiles, error: listError } = await viewerClient
        .from("profiles")
        .select("id, email");
      if (listError) throw listError;
      expect(visibleProfiles).toEqual([
        expect.objectContaining({ id: created.user.id, email }),
      ]);

      const { error: escalationError } = await viewerClient
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", created.user.id);
      expect(escalationError?.code).toBe("42501");

      const { data: ownProfile, error: ownProfileError } = await viewerClient
        .from("profiles")
        .select("role")
        .eq("id", created.user.id)
        .single();
      if (ownProfileError) throw ownProfileError;
      expect(ownProfile.role).toBe("viewer");

      const adminUser = await findUserByEmail(adminEmail);
      expect(adminUser).toBeDefined();
      const { data: changedRows, error: updateError } = await viewerClient
        .from("profiles")
        .update({ full_name: "Unauthorized change" })
        .eq("id", adminUser!.id)
        .select("id");
      expect(updateError).toBeNull();
      expect(changedRows).toEqual([]);
    } finally {
      await admin.auth.admin.deleteUser(created.user.id);
    }
  });
});
