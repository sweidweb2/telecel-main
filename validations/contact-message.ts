import { z } from "zod";

import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";

type ContactMessageMessages = {
  fullNameMin: string;
  fullNameMax: string;
  invalidEmail: string;
  emailMax: string;
  phoneInvalid: string;
  subjectMin: string;
  subjectMax: string;
  messageMin: string;
  messageMax: string;
  turnstileRequired: string;
  invalidId: string;
};

const VALIDATION_MESSAGES: Record<Locale, ContactMessageMessages> = {
  en: {
    fullNameMin: "Name must be at least 2 characters",
    fullNameMax: "Name must be at most 100 characters",
    invalidEmail: "Enter a valid email address",
    emailMax: "Email must be at most 254 characters",
    phoneInvalid:
      "Enter a valid phone number (7–20 digits, spaces, or +()- allowed)",
    subjectMin: "Subject must be at least 2 characters",
    subjectMax: "Subject must be at most 120 characters",
    messageMin: "Message must be at least 20 characters",
    messageMax: "Message must be at most 2000 characters",
    turnstileRequired: "Please complete the security check",
    invalidId: "Invalid message id",
  },
  fr: {
    fullNameMin: "Le nom doit contenir au moins 2 caractères",
    fullNameMax: "Le nom doit contenir au plus 100 caractères",
    invalidEmail: "Entrez une adresse e-mail valide",
    emailMax: "L’e-mail doit contenir au plus 254 caractères",
    phoneInvalid:
      "Entrez un numéro de téléphone valide (7–20 chiffres ; espaces ou +()- autorisés)",
    subjectMin: "Le sujet doit contenir au moins 2 caractères",
    subjectMax: "Le sujet doit contenir au plus 120 caractères",
    messageMin: "Le message doit contenir au moins 20 caractères",
    messageMax: "Le message doit contenir au plus 2000 caractères",
    turnstileRequired: "Veuillez compléter la vérification de sécurité",
    invalidId: "Identifiant de message invalide",
  },
};

const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;

export const CONTACT_MESSAGE_PAGE_SIZE = 10;
export const CONTACT_MESSAGE_FULL_NAME_MAX = 100;
export const CONTACT_MESSAGE_EMAIL_MAX = 254;
export const CONTACT_MESSAGE_PHONE_MAX = 20;
export const CONTACT_MESSAGE_SUBJECT_MAX = 120;
export const CONTACT_MESSAGE_BODY_MAX = 2000;

function contactMessageFieldsSchema(messages: ContactMessageMessages) {
  return {
    fullName: z
      .string()
      .trim()
      .min(2, messages.fullNameMin)
      .max(100, messages.fullNameMax),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email(messages.invalidEmail).max(254, messages.emailMax)),
    phone: z
      .string()
      .trim()
      .min(7, messages.phoneInvalid)
      .max(20, messages.phoneInvalid)
      .regex(PHONE_REGEX, messages.phoneInvalid)
      .refine(
        (value) => value.replace(/\D/g, "").length >= 7,
        messages.phoneInvalid,
      ),
    subject: z
      .string()
      .trim()
      .min(2, messages.subjectMin)
      .max(120, messages.subjectMax),
    message: z
      .string()
      .trim()
      .min(20, messages.messageMin)
      .max(2000, messages.messageMax),
  };
}

export function contactMessageSchemaFor(locale: Locale = DEFAULT_LOCALE) {
  const messages = VALIDATION_MESSAGES[locale];
  return z.object({
    ...contactMessageFieldsSchema(messages),
    turnstileToken: z
      .string()
      .trim()
      .min(1, messages.turnstileRequired)
      .max(2048, messages.turnstileRequired),
  });
}

export const contactMessageSchema = contactMessageSchemaFor(DEFAULT_LOCALE);

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const updateContactMessageSchema = z.object({
  id: z.uuid(VALIDATION_MESSAGES.en.invalidId),
  ...contactMessageFieldsSchema(VALIDATION_MESSAGES.en),
});

export const deleteContactMessageSchema = z.object({
  id: z.uuid(VALIDATION_MESSAGES.en.invalidId),
});

const contactMessageListQueryInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  search: z
    .string()
    .trim()
    .max(100, "Search must be 100 characters or fewer")
    .regex(/^[^,%_()]*$/, "Search contains unsupported characters")
    .catch(""),
});

export type ContactMessageListQuery = z.infer<
  typeof contactMessageListQueryInputSchema
> & {
  pageSize: typeof CONTACT_MESSAGE_PAGE_SIZE;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseContactMessageListQuery(
  input: RawSearchParams,
): ContactMessageListQuery {
  const parsed = contactMessageListQueryInputSchema.parse({
    page: first(input.page) ?? "1",
    search: first(input.search) ?? "",
  });

  return {
    ...parsed,
    pageSize: CONTACT_MESSAGE_PAGE_SIZE,
  };
}

export type UpdateContactMessageInput = z.infer<
  typeof updateContactMessageSchema
>;
export type DeleteContactMessageInput = z.infer<
  typeof deleteContactMessageSchema
>;
