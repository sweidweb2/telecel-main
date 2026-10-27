import { expect, test } from "@playwright/test";

import {
  adminClient,
  createTestUser,
  expectOnDashboard,
  hasSupabaseCredentials,
  signInViaForm,
} from "./helpers";

test.describe("maintenance settings", () => {
  test.beforeEach(() => {
    test.skip(
      !hasSupabaseCredentials(),
      "Maintenance E2E requires a real Supabase project.",
    );
  });

  test.afterEach(async () => {
    if (!hasSupabaseCredentials()) return;
    await adminClient().from("site_settings").upsert({
      key: "maintenance",
      value: { mode: "off" },
      updated_at: new Date().toISOString(),
    });
  });

  test("admin enables maintenance; editors blocked, admins keep CMS", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const admin = await createTestUser("admin");
    const editor = await createTestUser("editor");

    try {
      await signInViaForm(page, admin.email, admin.password, "/dashboard/settings");
      await expectOnDashboard(page, "/dashboard/settings");

      await expect(
        page.getByRole("heading", { name: "Site settings", level: 2 }),
      ).toBeVisible();

      const toggle = page.getByRole("switch", { name: /Maintenance mode/i });

      await toggle.click();
      await expect(page.getByText("Maintenance settings saved.")).toBeVisible({
        timeout: 15_000,
      });

      // Proxy/RSC caches flags ~15s; poll until maintenance notice on /login.
      await expect
        .poll(
          async () => {
            await page.goto("/login");
            // Signed-in admin is redirected to dashboard even during maintenance.
            if (page.url().includes("/dashboard")) return 1;
            return page.getByText(/Administrators may continue/i).count();
          },
          { timeout: 25_000 },
        )
        .toBeGreaterThan(0);

      // Anonymous visitors see the maintenance screen on public routes.
      await page.context().clearCookies();
      await expect
        .poll(
          async () => {
            await page.goto("/");
            return page
              .getByRole("heading", { name: /We'll be right back/i })
              .count();
          },
          { timeout: 25_000 },
        )
        .toBeGreaterThan(0);

      // Editors cannot sign in during maintenance.
      await page.goto("/login");
      await expect(
        page.getByText(/Administrators may continue/i),
      ).toBeVisible();
      await page.getByLabel(/^Email$/i).fill(editor.email);
      await page.getByLabel(/^Password$/i).fill(editor.password);
      await page.getByRole("button", { name: /^Sign in$/i }).click();
      await expect(
        page.getByText(/Only administrators can sign in/i),
      ).toBeVisible({ timeout: 15_000 });

      // Admins can still sign in and reach the dashboard (not public browse).
      await signInViaForm(page, admin.email, admin.password, "/dashboard/settings");
      await expectOnDashboard(page, "/dashboard/settings");

      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: /We'll be right back/i }),
      ).toBeVisible();

      await page.goto("/dashboard/settings");
      await expectOnDashboard(page, "/dashboard/settings");
      await toggle.click();
      await expect(page.getByText("Maintenance settings saved.")).toBeVisible({
        timeout: 15_000,
      });
    } finally {
      await Promise.all([admin.cleanup(), editor.cleanup()]);
    }
  });
});
