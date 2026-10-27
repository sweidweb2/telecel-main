import { describe, expect, it } from "vitest";

import {
  parseInquiryListQuery,
  submitInquirySchema,
  updateInquiryStatusSchema,
} from "@/validations/inquiries";

const validSubmit = {
  intent: "sales" as const,
  fullName: "Ada Lovelace",
  company: "Analytical Engines",
  jobRole: "Engineer",
  email: "ada@example.com",
  countryCode: "GB",
  areaOfInterest: "cybersecurity",
  businessNeed: "We need secure messaging across markets.",
  preferredContactMethod: "email" as const,
  consent: true as const,
  turnstileToken: "token-from-widget",
  sourcePath: "/contact",
};

describe("submitInquirySchema", () => {
  it("accepts a valid inquiry", () => {
    const result = submitInquirySchema.safeParse(validSubmit);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
      expect(result.data.countryCode).toBe("GB");
    }
  });

  it("rejects missing consent or weak country codes", () => {
    expect(
      submitInquirySchema.safeParse({ ...validSubmit, consent: false }).success
    ).toBe(false);
    expect(
      submitInquirySchema.safeParse({ ...validSubmit, countryCode: "gbx" })
        .success
    ).toBe(false);
  });

  it("normalizes email and country code", () => {
    const result = submitInquirySchema.safeParse({
      ...validSubmit,
      email: "  Ada@Example.COM ",
      countryCode: "gb",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
      expect(result.data.countryCode).toBe("GB");
    }
  });
});

describe("updateInquiryStatusSchema", () => {
  it("requires a uuid and known status", () => {
    expect(
      updateInquiryStatusSchema.safeParse({
        id: "not-a-uuid",
        status: "new",
      }).success
    ).toBe(false);
    expect(
      updateInquiryStatusSchema.safeParse({
        id: "11111111-1111-4111-8111-111111111111",
        status: "contacted",
      }).success
    ).toBe(true);
  });
});

describe("parseInquiryListQuery", () => {
  it("defaults filters and coerces page", () => {
    expect(parseInquiryListQuery({})).toEqual({
      page: 1,
      pageSize: 20,
      status: "all",
      intent: "all",
      search: "",
    });
    expect(parseInquiryListQuery({ page: "3", status: "spam" }).page).toBe(3);
    expect(parseInquiryListQuery({ status: "spam" }).status).toBe("spam");
    expect(parseInquiryListQuery({ limit: "10" }).pageSize).toBe(10);
  });
});
