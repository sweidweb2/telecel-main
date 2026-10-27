import { expect, test } from "@playwright/test";

test.describe("public site", () => {
  test("home renders with English lang and primary CTAs", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Talk to Sales" }).first()
    ).toBeVisible();
  });

  test("insights listing renders", async ({ page }) => {
    const response = await page.goto("/insights");
    expect(response?.status()).toBe(200);
  });

  test("unknown routes return the branded 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("locale-prefixed and public signup routes are gone", async ({ page }) => {
    for (const path of ["/en", "/fr/login", "/signup", "/register"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
    }
  });

  test("robots.txt hides the CMS and lists the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Disallow: /dashboard/");
    expect(body).toContain("sitemap.xml");
  });
});

test.describe("CMS entry points (no session)", () => {
  test("protected routes redirect to login with next", async ({ page }) => {
    await page.goto("/dashboard/users");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fusers$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("login has no signup link and shows reason notices", async ({ page }) => {
    await page.goto("/login?reason=session-expired");
    await expect(page.getByText("Your session expired after 24 hours")).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Forgot password?" })).toBeVisible();
  });

  test("forgot password page renders", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
  });

  test("update password without a session goes back to login", async ({ page }) => {
    await page.goto("/update-password");
    await expect(page).toHaveURL(/\/login\?reason=auth-error$/);
  });

  test("auth link errors land on login, never on another origin", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=bad&type=recovery&next=%2F%5Cevil.example");
    await expect(page).toHaveURL(/\/login\?reason=auth-error$/);
  });
});
