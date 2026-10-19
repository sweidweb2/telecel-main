import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/validations/auth";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "asweid657@gmail.com",
      password: "ali@1234",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "ali@1234",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts matching passwords that meet strength rules", () => {
    const result = registerSchema.safeParse({
      fullName: "ASIP Admin",
      email: "dev@example.com",
      password: "ali@1234",
      confirmPassword: "ali@1234",
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      fullName: "ASIP Admin",
      email: "dev@example.com",
      password: "ali@1234",
      confirmPassword: "ali@9999",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a weak password", () => {
    const result = registerSchema.safeParse({
      fullName: "ASIP Admin",
      email: "dev@example.com",
      password: "short",
      confirmPassword: "short",
    });

    expect(result.success).toBe(false);
  });

  it("returns french validation messages", async () => {
    const { registerSchemaFor } = await import("@/validations/auth");
    const result = registerSchemaFor("fr").safeParse({
      fullName: "A",
      email: "bad",
      password: "short",
      confirmPassword: "other",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/caractères|valide|lettre/i);
    }
  });
});
