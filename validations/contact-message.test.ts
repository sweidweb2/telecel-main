import { describe, expect, it } from "vitest";

import {
  contactMessageSchema,
  contactMessageSchemaFor,
  parseContactMessageListQuery,
} from "@/validations/contact-message";

const validInput = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+233 20 123 4567",
  subject: "Partnership inquiry",
  message:
    "I would like to learn more about partnering with ASIP for the next cohort.",
  turnstileToken: "test-turnstile-token",
};

describe("contactMessageSchema", () => {
  it("accepts a valid message", () => {
    const result = contactMessageSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      email: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects phone with too few digits", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      phone: ".......",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short message", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      message: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing turnstile token", () => {
    const result = contactMessageSchema.safeParse({
      ...validInput,
      turnstileToken: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/security check/i);
    }
  });

  it("returns french validation messages", () => {
    const result = contactMessageSchemaFor("fr").safeParse({
      ...validInput,
      fullName: "A",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/caractères/i);
    }
  });
});

describe("parseContactMessageListQuery", () => {
  it("accepts a plain search term", () => {
    const query = parseContactMessageListQuery({ search: "ada" });
    expect(query.search).toBe("ada");
  });

  it("keeps dots so email search works", () => {
    const query = parseContactMessageListQuery({ search: "ada@x.com" });
    expect(query.search).toBe("ada@x.com");
  });

  it("clears search containing PostgREST filter metacharacters", () => {
    expect(parseContactMessageListQuery({ search: "a%b" }).search).toBe("");
    expect(parseContactMessageListQuery({ search: "a_b" }).search).toBe("");
  });
});
