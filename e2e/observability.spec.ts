import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";

import {
  adminClient,
  anonClient,
  createTestUser,
  expectOnDashboard,
  hasSupabaseCredentials,
  signInViaForm,
} from "./helpers";

test.describe("activity and error logs", () => {
  test.beforeEach(() => {
    test.skip(
      !hasSupabaseCredentials(),
      "Observability E2E requires a real Supabase project.",
    );
  });

  test("admin can open activity and error logs with seeded rows", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const suffix = nanoid(8).toLowerCase();
    const activityEntityId = `e2e-act-${suffix}`;
    const errorSource = `e2e.errors.${suffix}`;
    const admin = adminClient();
    const adminUser = await createTestUser("admin");

    try {
      const { error: activityInsertError } = await admin.from("audit_log").insert({
        actor_id: adminUser.id,
        action: "create",
        entity_type: "blog",
        entity_id: activityEntityId,
        summary: { slug: `seed-${suffix}` },
      });
      if (activityInsertError) throw activityInsertError;

      const { error: errorInsertError } = await admin.from("app_errors").insert({
        severity: "error",
        source: errorSource,
        code: "e2e_seed",
        message: `E2E seeded error ${suffix}`,
        actor_id: adminUser.id,
        request_id: null,
        context: { kind: "e2e" },
      });
      if (errorInsertError) throw errorInsertError;

      await signInViaForm(
        page,
        adminUser.email,
        adminUser.password,
        "/dashboard/activity-log",
      );
      await expectOnDashboard(page, "/dashboard/activity-log");

      const activitySidebar = page.locator("[data-sidebar=sidebar]").first();
      await expect(
        activitySidebar.getByRole("link", { name: "Activity log" }),
      ).toBeVisible();
      await expect(
        activitySidebar.getByRole("link", { name: "Error log" }),
      ).toBeVisible();

      await page.goto(
        `/dashboard/activity-log?search=${encodeURIComponent(activityEntityId)}`,
      );
      await expect(
        page.getByRole("heading", { name: "Activity log", level: 2 }),
      ).toBeVisible();
      await expect(page.getByText(activityEntityId)).toBeVisible({
        timeout: 20_000,
      });
      await expect(page.getByText("create").first()).toBeVisible();

      await page.goto(
        `/dashboard/error-log?search=${encodeURIComponent(errorSource)}`,
      );
      await expect(
        page.getByRole("heading", { name: "Error log", level: 2 }),
      ).toBeVisible();
      await expect(page.getByText(errorSource)).toBeVisible({ timeout: 20_000 });
      await expect(page.getByText(`E2E seeded error ${suffix}`)).toBeVisible();
    } finally {
      await adminUser.cleanup();
    }
  });

  test("editors cannot read audit_log or app_errors via RLS", async () => {
    const editor = await createTestUser("editor");
    try {
      const client = anonClient();
      const { error: signInError } = await client.auth.signInWithPassword({
        email: editor.email,
        password: editor.password,
      });
      if (signInError) throw signInError;

      const { data: activity, error: activityError } = await client
        .from("audit_log")
        .select("id")
        .limit(5);
      expect(activityError).toBeNull();
      expect(activity).toEqual([]);

      const { data: errors, error: errorsError } = await client
        .from("app_errors")
        .select("id")
        .limit(5);
      expect(errorsError).toBeNull();
      expect(errors).toEqual([]);

      const { data: isAdmin } = await client.rpc("is_admin");
      expect(isAdmin).toBe(false);
    } finally {
      await editor.cleanup();
    }
  });

  test("creating a blog records an audit_log activity row", async ({ page }) => {
    test.setTimeout(120_000);
    const suffix = nanoid(8).toLowerCase();
    const title = `E2E Audit Blog ${suffix}`;
    const slug = `e2e-audit-blog-${suffix}`;
    const admin = adminClient();
    const adminUser = await createTestUser("admin");

    try {
      await signInViaForm(
        page,
        adminUser.email,
        adminUser.password,
        "/dashboard/blogs/new",
      );
      await expect(page).toHaveURL(/\/dashboard\/blogs\/new/, { timeout: 20_000 });

      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Slug").fill(slug);
      await page
        .getByLabel("Summary")
        .fill("E2E summary to verify activity logging on create.");
      await page.getByLabel("Author", { exact: true }).fill("E2E Author");
      await page.locator(".ProseMirror").click();
      await page.keyboard.type("Body content for audit log coverage.");
      await page.getByRole("button", { name: "Create blog" }).click();

      const createdDialog = page.getByRole("dialog");
      await expect(
        createdDialog.getByRole("heading", { name: "Blog created" }),
      ).toBeVisible({ timeout: 20_000 });

      const { data: blog, error: blogError } = await admin
        .from("blogs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (blogError) throw blogError;
      expect(blog?.id).toBeTruthy();

      await expect
        .poll(
          async () => {
            const { data, error } = await admin
              .from("audit_log")
              .select("id, action, entity_type, entity_id, summary")
              .eq("entity_type", "blog")
              .eq("entity_id", blog!.id)
              .eq("action", "create")
              .limit(1);
            if (error) throw error;
            return data?.[0] ?? null;
          },
          { timeout: 20_000 },
        )
        .toMatchObject({
          action: "create",
          entity_type: "blog",
          entity_id: blog!.id,
        });
    } finally {
      await admin.from("blogs").delete().eq("slug", slug);
      await adminUser.cleanup();
    }
  });

  test("creating a user records an audit_log invite row", async ({ page }) => {
    test.setTimeout(90_000);
    const email = `e2e.audit.user.${nanoid(8).toLowerCase()}@example.com`;
    const admin = adminClient();
    const adminUser = await createTestUser("admin");
    let createdUserId: string | undefined;

    try {
      await signInViaForm(
        page,
        adminUser.email,
        adminUser.password,
        "/dashboard/users",
      );
      await expectOnDashboard(page, "/dashboard/users");

      await page.getByRole("button", { name: "Create user" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.getByLabel("Full name").fill("Audit Log Editor");
      await dialog.getByLabel("Email").fill(email);
      await dialog.getByLabel("Temporary password").fill("E2eStrongPass1");
      await dialog.getByRole("button", { name: "Create user" }).click();
      await expect(page.getByText("User created successfully.")).toBeVisible({
        timeout: 20_000,
      });

      const { data: listed } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      const created = listed.users.find((user) => user.email === email);
      expect(created?.id).toBeTruthy();
      createdUserId = created?.id;

      await expect
        .poll(
          async () => {
            const { data, error } = await admin
              .from("audit_log")
              .select("id, action, entity_type, entity_id")
              .eq("entity_type", "user")
              .eq("entity_id", createdUserId!)
              .eq("action", "invite")
              .limit(1);
            if (error) throw error;
            return data?.[0] ?? null;
          },
          { timeout: 20_000 },
        )
        .toMatchObject({
          action: "invite",
          entity_type: "user",
          entity_id: createdUserId,
        });
    } finally {
      if (createdUserId) {
        await admin.auth.admin.deleteUser(createdUserId);
      } else {
        const { data } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        const created = data.users.find((user) => user.email === email);
        if (created) await admin.auth.admin.deleteUser(created.id);
      }
      await adminUser.cleanup();
    }
  });
});
