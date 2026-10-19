import { describe, expect, it } from "vitest";

import {
  createUserSchema,
  parseUserListQuery,
  updateUserSchema,
  USER_FORM_ROLE,
} from "@/validations/users";

describe("users validation", () => {
  it("accepts a valid create payload and normalizes its email", () => {
    const result = createUserSchema.parse({
      fullName: "Ada Lovelace",
      email: "ADA@EXAMPLE.COM",
      password: "Password1",
      role: USER_FORM_ROLE,
    });

    expect(result.email).toBe("ada@example.com");
    expect(result.role).toBe("admin");
    expect(result.password).toBe("Password1");
  });

  it("defaults empty password to password", () => {
    const result = createUserSchema.parse({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "",
      role: USER_FORM_ROLE,
    });

    expect(result.password).toBe("password");
  });

  it("defaults whitespace password to password", () => {
    const result = createUserSchema.parse({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "   ",
      role: USER_FORM_ROLE,
    });

    expect(result.password).toBe("password");
  });

  it("rejects non-admin roles, invalid emails, and weak passwords", () => {
    expect(
      createUserSchema.safeParse({
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        password: "weak",
        role: "editor",
      }).success,
    ).toBe(false);

    expect(
      createUserSchema.safeParse({
        fullName: "Ada Lovelace",
        email: "not-an-email",
        password: "Password1",
        role: USER_FORM_ROLE,
      }).success,
    ).toBe(false);

    expect(
      createUserSchema.safeParse({
        fullName: "A",
        email: "ada@example.com",
        password: "Password1",
        role: USER_FORM_ROLE,
      }).success,
    ).toBe(false);
  });

  it("requires a UUID and admin role when updating a user", () => {
    expect(
      updateUserSchema.safeParse({
        id: "not-a-uuid",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: USER_FORM_ROLE,
      }).success,
    ).toBe(false);

    expect(
      updateUserSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: "viewer",
      }).success,
    ).toBe(false);
  });

  it("validates and defaults list query parameters", () => {
    expect(
      parseUserListQuery({
        page: "2",
        pageSize: "25",
        search: " ada@example.com ",
        role: "admin",
      }),
    ).toEqual({
      page: 2,
      pageSize: 10,
      search: "ada@example.com",
      role: "admin",
    });

    expect(
      parseUserListQuery({ page: "-1", pageSize: "999", role: "owner" }),
    ).toEqual({ page: 1, pageSize: 10, search: "", role: "all" });
  });
});
