import { describe, expect, it } from "vitest";

import {
  createUserSchema,
  parseUserListQuery,
  updateUserSchema,
} from "@/validations/users";

const ID = "11111111-1111-4111-8111-111111111111";

describe("users validation", () => {
  it("accepts a valid create payload and normalizes its email", () => {
    const result = createUserSchema.parse({
      fullName: "Ada Lovelace",
      email: "ADA@EXAMPLE.COM",
      password: "Telecel2026Strong",
      role: "editor",
    });

    expect(result.email).toBe("ada@example.com");
    expect(result.role).toBe("editor");
  });

  it("requires a strong password (no default password)", () => {
    for (const password of ["", "   ", "password", "Password1"]) {
      expect(
        createUserSchema.safeParse({
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          password,
          role: "admin",
        }).success,
        password
      ).toBe(false);
    }
  });

  it("rejects unknown roles and invalid emails", () => {
    expect(
      createUserSchema.safeParse({
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        password: "Telecel2026Strong",
        role: "viewer",
      }).success
    ).toBe(false);
    expect(
      createUserSchema.safeParse({
        fullName: "Ada Lovelace",
        email: "not-an-email",
        password: "Telecel2026Strong",
        role: "admin",
      }).success
    ).toBe(false);
  });

  it("requires a UUID, a role and the active flag when updating", () => {
    expect(
      updateUserSchema.safeParse({
        id: ID,
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: "editor",
        isActive: false,
      }).success
    ).toBe(true);
    expect(
      updateUserSchema.safeParse({
        id: "nope",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: "editor",
        isActive: true,
      }).success
    ).toBe(false);
    expect(
      updateUserSchema.safeParse({
        id: ID,
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: "editor",
      }).success
    ).toBe(false);
  });

  it("validates and defaults list query parameters", () => {
    expect(
      parseUserListQuery({
        page: "2",
        limit: "25",
        search: " ada@example.com ",
        role: "editor",
      }),
    ).toEqual({
      page: 2,
      pageSize: 10,
      search: "ada@example.com",
      role: "editor",
    });

    expect(
      parseUserListQuery({ page: "2", limit: "50", role: "editor" }),
    ).toEqual({
      page: 2,
      pageSize: 50,
      search: "",
      role: "editor",
    });

    expect(
      parseUserListQuery({ page: "-1", limit: "999", role: "viewer" }),
    ).toEqual({ page: 1, pageSize: 10, search: "", role: "all" });
  });
});
