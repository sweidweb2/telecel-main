import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginSchema,
  newPasswordSchema,
  updatePasswordSchema,
} from "@/validations/auth";

describe("loginSchema", () => {
  it("accepts and normalizes a valid email", () => {
    const result = loginSchema.safeParse({
      email: "  Editor@Telecel.COM ",
      password: "anything",
    });

    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("editor@telecel.com");
  });

  it("rejects an invalid email or empty password", () => {
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "x" }).success
    ).toBe(false);
    expect(
      loginSchema.safeParse({ email: "a@b.co", password: "" }).success
    ).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("requires a valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@b.co" }).success).toBe(
      true
    );
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(
      false
    );
  });
});

describe("newPasswordSchema", () => {
  it.each(["short1A", "alllowercase123", "ALLUPPERCASE123", "NoDigitsHere!"])(
    "rejects weak password %s",
    (password) => {
      expect(newPasswordSchema.safeParse(password).success).toBe(false);
    }
  );

  it("accepts a strong password", () => {
    expect(newPasswordSchema.safeParse("Telecel2026Strong").success).toBe(true);
  });
});

describe("updatePasswordSchema", () => {
  it("rejects mismatched confirmation", () => {
    const result = updatePasswordSchema.safeParse({
      password: "Telecel2026Strong",
      confirmPassword: "Telecel2026Other",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });
});
