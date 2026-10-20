import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

import {
  adminClient,
  adminEmail,
  adminPassword,
  anonClient,
  createTestUser,
  expectOnDashboard,
  hasSupabaseCredentials,
  signInViaForm,
  TEST_PASSWORD,
} from "./helpers";

test.describe("users portal and profile RLS", () => {
  test.beforeEach(() => {
    test.skip(!hasSupabaseCredentials(), "Users E2E requires a real Supabase project.");
  });

  test("admin creates an editor with a strong temporary password", async ({ page }) => {
    test.setTimeout(90_000);
    const email = `e2e.created.${nanoid(8).toLowerCase()}@example.com`;

    try {
      await signInViaForm(page, adminEmail, adminPassword, "/dashboard/users");
      await expectOnDashboard(page, "/dashboard/users");

      await page.getByRole("button", { name: "Create user" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.getByLabel("Full name").fill("Created Editor");
      await dialog.getByLabel("Email").fill(email);

      // Weak passwords are rejected client-side (no default password).
      await dialog.getByLabel("Temporary password").fill("password");
      await dialog.getByRole("button", { name: "Create user" }).click();
      await expect(dialog.getByText(/at least 10 characters/)).toBeVisible();

      await dialog.getByLabel("Temporary password").fill(TEST_PASSWORD);
      await dialog.getByRole("button", { name: "Create user" }).click();
      await expect(page.getByText("User created successfully.")).toBeVisible({
        timeout: 20_000,
      });

      const row = page.getByRole("row").filter({ hasText: email });
      await expect(row).toBeVisible();
      await expect(row.getByText("editor")).toBeVisible();
    } finally {
      const { data } = await adminClient().auth.admin.listUsers({ page: 1, perPage: 200 });
      const created = data.users.find((user) => user.email === email);
      if (created) await adminClient().auth.admin.deleteUser(created.id);
    }
  });

  test("editors cannot read other profiles or escalate their role", async () => {
    const editor = await createTestUser("editor");
    try {
      const client = anonClient();
      const { error: signInError } = await client.auth.signInWithPassword({
        email: editor.email,
        password: editor.password,
      });
      if (signInError) throw signInError;

      const { data: visible, error: listError } = await client
        .from("profiles")
        .select("id");
      if (listError) throw listError;
      expect(visible).toEqual([{ id: editor.id }]);

      const { error: escalation } = await client
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", editor.id);
      expect(escalation?.code).toBe("42501");

      const { error: reactivate } = await client
        .from("profiles")
        .update({ is_active: false })
        .eq("id", editor.id);
      expect(reactivate?.code).toBe("42501");

      const { data: isStaff } = await client.rpc("is_staff");
      expect(isStaff).toBe(true);
      const { data: isAdmin } = await client.rpc("is_admin");
      expect(isAdmin).toBe(false);
    } finally {
      await editor.cleanup();
    }
  });
});
