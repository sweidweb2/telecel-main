import { expect, test } from "@playwright/test";

const publicSlugs = [
  "",
  "/about",
  "/programme",
  "/portfolio",
  "/insights",
  "/apply",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
] as const;

for (const locale of ["en", "fr"] as const) {
  for (const slug of publicSlugs) {
    const route = `/${locale}${slug}`;

    test(`${route} renders localized public chrome`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  }
}

test("bare public routes redirect to a supported locale", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveURL(/\/(en|fr)\/about$/);
});

test("language switch preserves the current public page", async ({ page }) => {
  await page.goto("/en/programme");
  await page.getByRole("link", { name: "fr", exact: true }).first().click();
  await expect(page).toHaveURL(/\/fr\/programme$/);
});

test("mobile navigation remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Apply" })).toBeVisible();
});
