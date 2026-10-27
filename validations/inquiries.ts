import { z } from "zod";

import {
  AREA_OF_INTEREST_OPTIONS,
  CONTACT_METHODS,
  INQUIRY_INTENTS,
  INQUIRY_STATUSES,
} from "@/constants/inquiries";
import {
  ADMIN_LIST_PAGE_SIZE,
  parseAdminListQuery,
  type AdminPageSize,
} from "@/validations/admin-list-query";

const EMAIL_MAX = 254;
const NAME_MAX = 120;
const COMPANY_MAX = 160;
const ROLE_MAX = 120;
const NEED_MAX = 4000;
const SOURCE_PATH_MAX = 300;
const TURNSTILE_TOKEN_MAX = 2048;

const intentValues = INQUIRY_INTENTS.map((item) => item.value) as [
  (typeof INQUIRY_INTENTS)[number]["value"],
  ...(typeof INQUIRY_INTENTS)[number]["value"][],
];

const statusValues = INQUIRY_STATUSES.map((item) => item.value) as [
  (typeof INQUIRY_STATUSES)[number]["value"],
  ...(typeof INQUIRY_STATUSES)[number]["value"][],
];

const contactMethodValues = CONTACT_METHODS.map((item) => item.value) as [
  (typeof CONTACT_METHODS)[number]["value"],
  ...(typeof CONTACT_METHODS)[number]["value"][],
];

const areaValues = AREA_OF_INTEREST_OPTIONS.map((item) => item.value) as [
  (typeof AREA_OF_INTEREST_OPTIONS)[number]["value"],
  ...(typeof AREA_OF_INTEREST_OPTIONS)[number]["value"][],
];

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(EMAIL_MAX, `Email must be ${EMAIL_MAX} characters or fewer`)
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

export const submitInquirySchema = z.object({
  intent: z.enum(intentValues, { error: "Choose why you are contacting us" }),
  fullName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(NAME_MAX, `Name must be ${NAME_MAX} characters or fewer`),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(COMPANY_MAX, `Company must be ${COMPANY_MAX} characters or fewer`),
  jobRole: z
    .string()
    .trim()
    .min(1, "Role is required")
    .max(ROLE_MAX, `Role must be ${ROLE_MAX} characters or fewer`),
  email: emailSchema,
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "Choose a country"),
  areaOfInterest: z.enum(areaValues, {
    error: "Choose an area of interest",
  }),
  businessNeed: z
    .string()
    .trim()
    .min(1, "Tell us what you need")
    .max(NEED_MAX, `Keep this under ${NEED_MAX} characters`),
  preferredContactMethod: z.enum(contactMethodValues, {
    error: "Choose a preferred contact method",
  }),
  consent: z.literal(true, {
    error: "Consent is required to send this inquiry",
  }),
  turnstileToken: z
    .string()
    .min(1, "Complete the security check")
    .max(TURNSTILE_TOKEN_MAX),
  sourcePath: z
    .string()
    .trim()
    .max(SOURCE_PATH_MAX)
    .optional()
    .nullable(),
});

export type SubmitInquiryInput = z.infer<typeof submitInquirySchema>;

export const updateInquiryStatusSchema = z.object({
  id: z.uuid("Invalid inquiry"),
  status: z.enum(statusValues, { error: "Choose a status" }),
});

export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;

/** Default inquiries page size (overridable via URL `limit`: 10 | 20 | 50). */
export const INQUIRY_PAGE_SIZE = ADMIN_LIST_PAGE_SIZE;

export type InquiryListQuery = {
  page: number;
  pageSize: AdminPageSize;
  status: "all" | (typeof statusValues)[number];
  intent: "all" | (typeof intentValues)[number];
  search: string;
};

const inquiryFiltersSchema = z.object({
  status: z.enum(["all", ...statusValues]).catch("all"),
  intent: z.enum(["all", ...intentValues]).catch("all"),
});

export function parseInquiryListQuery(
  raw: Record<string, string | string[] | undefined>,
): InquiryListQuery {
  const pick = (key: string) => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const base = parseAdminListQuery(raw, ADMIN_LIST_PAGE_SIZE);
  const filters = inquiryFiltersSchema.parse({
    status: pick("status") ?? "all",
    intent: pick("intent") ?? "all",
  });

  return {
    ...base,
    ...filters,
  };
}
