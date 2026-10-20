import { expect, test } from "@playwright/test";

import {
  adminEmail,
  adminPassword,
  createTestUser,
  expectOnDashboard,
  hasSupabaseCredentials,
  signInViaForm,
} from "./helpers";

test.describe("CMS authentication", () => {
  test.beforeEach(() => {
    test.skip(!hasSupabaseCredentials(), "Auth E2E requires a real Supabase project.");
  });

  test("admin signs in, reaches the intended page, and logs out", async ({ page }) => {
    await signInViaForm(page, adminEmail, adminPassword, "/dashboard/users");
    await expectOnDashboard(page, "/dashboard/users");
    await expect(page.getByRole("button", { name: "Create user" })).toBeVisible();

    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login\?reason=signed-out$/, { timeout: 20_000 });

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  });

  test("an unsafe next parameter falls back to the dashboard", async ({ page }) => {
    await signInViaForm(page, adminEmail, adminPassword, "/\\evil.example");
    await expectOnDashboard(page);
  });

  test("wrong password shows an error and stays on login", async ({ page }) => {
    await signInViaForm(page, adminEmail, "definitely-wrong-password");
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("an account without a role is signed out with a notice", async ({ page }) => {
    const user = await createTestUser(null);
    try {
      await signInViaForm(page, user.email, user.password);
      await expect(page).toHaveURL(/\/login\?reason=no-access$/, { timeout: 20_000 });
      await expect(page.getByText("does not have access")).toBeVisible();
    } finally {
      await user.cleanup();
    }
  });

  test("editors get content sections but not admin sections", async ({ page }) => {
    const editor = await createTestUser("editor");
    try {
      await signInViaForm(page, editor.email, editor.password);
      await expectOnDashboard(page);

      const sidebar = page.locator("[data-sidebar=sidebar]").first();
      await expect(sidebar.getByRole("link", { name: "News" })).toBeVisible();
      await expect(sidebar.getByRole("link", { name: "Users" })).toHaveCount(0);

      await page.goto("/dashboard/users");
      await expect(page.getByRole("heading", { name: "Access denied" })).toBeVisible();

      await page.goto("/dashboard/blogs");
      await expect(page.getByRole("heading", { name: "News", level: 2 })).toBeVisible();
    } finally {
      await editor.cleanup();
    }
  });
});
