import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Real project credentials — not CI placeholders used for lint/build. */
function hasAuthE2ECredentials(): boolean {
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return false;
  }

  return (
    !supabaseUrl.includes("placeholder") && !anonKey.startsWith("placeholder")
  );
}

function createAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for auth E2E."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function confirmUserByEmail(email: string) {
  const admin = createAdminClient();

  let userId: string | undefined;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error) {
      throw error;
    }

    userId = data.users.find(
      (entry) => entry.email?.toLowerCase() === email.toLowerCase()
    )?.id;

    if (userId) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (!userId) {
    throw new Error(`User not found for confirmation: ${email}`);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  if (updateError) {
    throw updateError;
  }
}

async function createConfirmedUser(
  email: string,
  password: string,
  fullName: string
) {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) throw error;
}

async function deleteUserByEmail(email: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw error;

  const user = data.users.find(
    (entry) => entry.email?.toLowerCase() === email.toLowerCase()
  );
  if (!user) return;

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) throw deleteError;
}

test.describe("auth", () => {
  test.beforeEach(() => {
    test.skip(
      !hasAuthE2ECredentials(),
      "Auth E2E needs real NEXT_PUBLIC_SUPABASE_* and SUPABASE_SERVICE_ROLE_KEY (not CI placeholders)."
    );
  });

  test("signup → confirm → login → protected route → logout", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const email = `e2e.${nanoid(8).toLowerCase()}@gmail.com`;
    const password = "Testpass1";
    const fullName = "E2E Tester";

    try {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/(en|fr)\/login\?next=%2Fdashboard/);

      await page.goto("/en/signup");
      await page.getByLabel("Name").fill(fullName);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password", { exact: true }).fill(password);
      await page.getByLabel("Confirm password").fill(password);
      await page.getByRole("button", { name: "Create account" }).click();

      const outcome = await Promise.race([
        page
          .waitForURL(/\/dashboard/, { timeout: 20_000 })
          .then(() => "session" as const),
        page
          .locator("[data-sonner-toast]")
          .filter({
            hasText: /account created|check your email|compte créé|e-mail/i,
          })
          .waitFor({ state: "visible", timeout: 20_000 })
          .then(() => "confirm" as const),
        page
          .locator("[data-sonner-toast][data-type='error']")
          .waitFor({ state: "visible", timeout: 20_000 })
          .then(async () => {
            const text = await page
              .locator("[data-sonner-toast][data-type='error']")
              .textContent();
            if (/email rate limit exceeded/i.test(text ?? "")) {
              return "rate-limited" as const;
            }

            throw new Error(`Signup failed: ${text}`);
          }),
      ]);

      if (outcome !== "session") {
        if (outcome === "confirm") {
          await confirmUserByEmail(email);
        } else {
          await createConfirmedUser(email, password, fullName);
        }

        await page.goto("/en/login");
        await page.getByLabel("Email").fill(email);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Sign in" }).click();
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
      }

      await expect(
        page.getByRole("heading", { name: /dashboard/i })
      ).toBeVisible();

      await page.getByRole("button", { name: "Open account menu" }).click();
      await page.getByRole("menuitem", { name: /log out/i }).click();

      await expect(page).toHaveURL(/\/(en|fr)\/login/, { timeout: 15_000 });

      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/(en|fr)\/login\?next=%2Fdashboard/);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("duplicate signup email shows a toast error", async ({ page }) => {
    const email = process.env.E2E_SEED_EMAIL ?? "asweid657@gmail.com";
    const password = process.env.E2E_SEED_PASSWORD ?? "ali@1234";

    await page.goto("/en/signup");
    await page.getByLabel("Name").fill("Duplicate User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(
      page.locator("[data-sonner-toast]").filter({
        hasText: /already exists|already registered|existe déjà/i,
      })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/en\/signup/);
  });
});

test("french signup page renders localized copy", async ({ page }) => {
  await page.goto("/fr/signup");
  await expect(
    page.getByRole("main").getByText("Inscription", { exact: true })
  ).toBeVisible();
  await expect(page.getByLabel("Nom")).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Créer un compte" })
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Connexion" })
  ).toHaveAttribute("href", "/fr/login");
});

test("french login page renders localized copy", async ({ page }) => {
  await page.goto("/fr/login");
  await expect(
    page.getByText("Connexion", { exact: true }).first()
  ).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Se connecter" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /S.inscrire/ })).toHaveAttribute(
    "href",
    "/fr/signup"
  );
});
