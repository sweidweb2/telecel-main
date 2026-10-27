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
      value: { level1: false, level2: false },
      updated_at: new Date().toISOString(),
    });
  });

  test("admin toggles Level 1 and Level 2; staff session keeps settings", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const admin = await createTestUser("admin");

    try {
      await signInViaForm(page, admin.email, admin.password, "/dashboard/settings");
      await expectOnDashboard(page, "/dashboard/settings");

      await expect(
        page.getByRole("heading", { name: "Site settings", level: 2 }),
      ).toBeVisible();

      const level1 = page.getByRole("switch", { name: /Level 1/i });
      const level2 = page.getByRole("switch", { name: /Level 2/i });

      await level1.click();
      await expect(page.getByText("Maintenance settings saved.")).toBeVisible({
        timeout: 15_000,
      });

      // Proxy caches flags ~15s; poll until Level 1 hits /login.
      await expect
        .poll(
          async () => {
            await page.goto("/login");
            return page
              .getByRole("heading", { name: /We'll be right back/i })
              .count();
          },
          { timeout: 25_000 },
        )
        .toBeGreaterThan(0);
      await expect(page.getByRole("link", { name: /home/i })).toBeVisible();

      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: /We'll be right back/i }),
      ).toHaveCount(0);

      await page.goto("/dashboard/settings");
      await expectOnDashboard(page, "/dashboard/settings");

      await level2.click();
      await expect(page.getByText("Maintenance settings saved.")).toBeVisible({
        timeout: 15_000,
      });

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

      await page.goto("/dashboard/settings");
      await expectOnDashboard(page, "/dashboard/settings");
      await level2.click();
      await expect(page.getByText("Maintenance settings saved.")).toBeVisible({
        timeout: 15_000,
      });
      if (await level1.isChecked()) {
        await level1.click();
        await expect(page.getByText("Maintenance settings saved.")).toBeVisible({
          timeout: 15_000,
        });
      }
    } finally {
      await admin.cleanup();
    }
  });
});
