import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.E2E_SEED_EMAIL ?? "asweid657@gmail.com";
const adminPassword = process.env.E2E_SEED_PASSWORD ?? "ali@1234";

const SUCCESS_TOAST = "Thank you — your message has been sent.";
const RATE_LIMIT_TOAST = "Too many submissions. Please wait and try again later.";
const BODY =
  "I would like to learn more about partnering with ASIP for the next cohort.";

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

async function cleanupMessagesByEmail(email: string) {
  const { error } = await adminClient()
    .from("contact_messages")
    .delete()
    .eq("email", email.toLowerCase());
  if (error) throw error;
}

async function countMessagesByEmail(email: string): Promise<number> {
  const { count, error } = await adminClient()
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email.toLowerCase());
  if (error) throw error;
  return count ?? 0;
}

async function fillContactForm(
  page: import("@playwright/test").Page,
  values: {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
  },
) {
  await page.locator("#contact-fullName").fill(values.name);
  await page.locator("#contact-phone").fill(values.phone);
  await page.locator("#contact-email").fill(values.email);
  await page.locator("#contact-subject").fill(values.subject);
  await page.locator("#contact-message").fill(values.message);
}

/**
 * Wait until Turnstile issues a token (submit becomes enabled).
 * Widget domains must include localhost for local E2E.
 */
async function waitForTurnstileReady(page: import("@playwright/test").Page) {
  await expect(page.getByTestId("contact-turnstile")).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeEnabled({ timeout: 60_000 });
}

test.describe.configure({ mode: "serial" });

test.describe("contact messages", () => {
  test.beforeEach(() => {
    test.skip(
      !hasCredentials(),
      "Contact E2E requires real Supabase credentials.",
    );
  });

  test("public submit succeeds and same email+subject follow-up is allowed", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const suffix = nanoid(8).toLowerCase();
    const email = `contact.e2e.${suffix}@example.com`;
    const subject = `Partnership inquiry ${suffix}`;

    try {
      await page.goto("/en/contact");
      await expect(
        page.getByRole("heading", { name: "Contact us" }),
      ).toBeVisible();

      await fillContactForm(page, {
        name: "Contact E2E User",
        phone: "+233201234567",
        email,
        subject,
        message: BODY,
      });
      await waitForTurnstileReady(page);
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(
        page.locator("[data-sonner-toast]").filter({ hasText: SUCCESS_TOAST }),
      ).toBeVisible({ timeout: 20_000 });
      expect(await countMessagesByEmail(email)).toBe(1);

      await fillContactForm(page, {
        name: "Contact E2E User",
        phone: "+233201234567",
        email,
        subject,
        message: `${BODY} Follow-up details included.`,
      });
      await waitForTurnstileReady(page);
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(
        page.locator("[data-sonner-toast]").filter({ hasText: SUCCESS_TOAST }),
      ).toBeVisible({ timeout: 20_000 });
      expect(await countMessagesByEmail(email)).toBe(2);
    } finally {
      await cleanupMessagesByEmail(email);
    }
  });

  test("fourth submit for the same email shows rate-limit toast", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const suffix = nanoid(8).toLowerCase();
    const email = `contact.rl.${suffix}@example.com`;

    try {
      await page.goto("/en/contact");

      for (let i = 0; i < 3; i += 1) {
        await fillContactForm(page, {
          name: "Rate Limit E2E",
          phone: "+233201234567",
          email,
          subject: `Rate limit subject ${suffix}-${i}`,
          message: `${BODY} Attempt ${i + 1}.`,
        });
        await waitForTurnstileReady(page);
        await page.getByRole("button", { name: "Send message" }).click();
        await expect(
          page.locator("[data-sonner-toast]").filter({ hasText: SUCCESS_TOAST }),
        ).toBeVisible({ timeout: 20_000 });
        await expect(
          page.locator("[data-sonner-toast]").filter({ hasText: SUCCESS_TOAST }),
        ).toBeHidden({ timeout: 15_000 });
      }

      expect(await countMessagesByEmail(email)).toBe(3);

      await fillContactForm(page, {
        name: "Rate Limit E2E",
        phone: "+233201234567",
        email,
        subject: `Rate limit subject ${suffix}-blocked`,
        message: `${BODY} Attempt 4 should be blocked.`,
      });
      await waitForTurnstileReady(page);
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(
        page
          .locator("[data-sonner-toast][data-type='error']")
          .filter({ hasText: RATE_LIMIT_TOAST }),
      ).toBeVisible({ timeout: 20_000 });
      expect(await countMessagesByEmail(email)).toBe(3);
    } finally {
      await cleanupMessagesByEmail(email);
    }
  });

  test("admin can list, search by email, edit, and delete", async ({ page }) => {
    test.setTimeout(90_000);
    const suffix = nanoid(8).toLowerCase();
    const email = `contact.admin.${suffix}@example.com`;
    const subject = `Admin manage ${suffix}`;
    const admin = adminClient();

    const { data: inserted, error: insertError } = await admin
      .from("contact_messages")
      .insert({
        full_name: "Admin Manage E2E",
        email,
        phone: "+233201234567",
        subject,
        message: BODY,
      })
      .select("id")
      .single();
    if (insertError) throw insertError;

    try {
      await page.goto("/en/login?next=%2Fdashboard%2Fcontact-us");
      await page.getByLabel("Email").fill(adminEmail);
      await page.getByLabel("Password").fill(adminPassword);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard\/contact-us/, {
        timeout: 20_000,
      });

      await expect(
        page.getByRole("heading", { name: "Contact us" }),
      ).toBeVisible();

      await page.getByLabel("Search contact messages").fill(email);
      await expect(page).toHaveURL(new RegExp(`search=contact\\.admin\\.${suffix}`), {
        timeout: 15_000,
      });

      const row = page.getByRole("row").filter({ hasText: email });
      await expect(row).toBeVisible();

      await row.getByRole("button", { name: `Edit ${subject}` }).click();
      const editDialog = page.getByRole("dialog");
      const updatedSubject = `${subject} edited`;
      await editDialog.getByLabel("Subject").fill(updatedSubject);
      await editDialog.getByRole("button", { name: "Save changes" }).click();
      await expect(
        page
          .locator("[data-sonner-toast]")
          .filter({ hasText: "Message updated successfully." }),
      ).toBeVisible({ timeout: 20_000 });
      await expect(
        page.getByRole("row").filter({ hasText: email }),
      ).toContainText("edited");

      await page
        .getByRole("row")
        .filter({ hasText: email })
        .getByRole("button", { name: `Delete ${updatedSubject}` })
        .click();
      const deleteDialog = page.getByRole("dialog");
      await expect(deleteDialog.getByText(/cannot be undone/i)).toBeVisible();
      await deleteDialog.getByRole("button", { name: "Delete" }).click();
      await expect(
        page
          .locator("[data-sonner-toast]")
          .filter({ hasText: "Message deleted successfully." }),
      ).toBeVisible({ timeout: 20_000 });
      await expect(page.getByRole("row").filter({ hasText: email })).toHaveCount(
        0,
      );
    } finally {
      if (inserted?.id) {
        await admin.from("contact_messages").delete().eq("id", inserted.id);
      }
      await cleanupMessagesByEmail(email);
    }
  });

  test("non-admin is redirected away from contact-us", async ({ page }) => {
    test.setTimeout(60_000);
    if (!supabaseUrl || !anonKey) {
      throw new Error("Supabase credentials missing");
    }

    const suffix = nanoid(8).toLowerCase();
    const email = `contact.viewer.${suffix}@example.com`;
    const password = "Testpass1";
    const admin = adminClient();
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: "Contact E2E Viewer" },
        app_metadata: { app_role: "viewer" },
      });
    if (createError) throw createError;

    try {
      await page.goto("/en/login?next=%2Fdashboard%2Fcontact-us");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });

      await page.goto("/dashboard/contact-us");
      await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
    } finally {
      await admin.auth.admin.deleteUser(created.user.id);
    }
  });
});
