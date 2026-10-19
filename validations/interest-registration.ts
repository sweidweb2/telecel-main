import { z } from "zod";

import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";

type InterestRegistrationMessages = {
  fullNameMin: string;
  fullNameMax: string;
  invalidEmail: string;
  emailMax: string;
  phoneInvalid: string;
  companyMin: string;
  companyMax: string;
  sectorMin: string;
  sectorMax: string;
  countryMin: string;
  countryMax: string;
  pitchMin: string;
  pitchMax: string;
  consentRequired: string;
  turnstileRequired: string;
  invalidId: string;
};

const VALIDATION_MESSAGES: Record<Locale, InterestRegistrationMessages> = {
  en: {
    fullNameMin: "Name must be at least 2 characters",
    fullNameMax: "Name must be at most 100 characters",
    invalidEmail: "Enter a valid email address",
    emailMax: "Email must be at most 254 characters",
    phoneInvalid:
      "Enter a valid phone number (7–20 digits, spaces, or +()- allowed)",
    companyMin: "Company name must be at least 2 characters",
    companyMax: "Company name must be at most 120 characters",
    sectorMin: "Sector must be at least 2 characters",
    sectorMax: "Sector must be at most 80 characters",
    countryMin: "Country must be at least 2 characters",
    countryMax: "Country must be at most 80 characters",
    pitchMin: "Pitch must be at least 20 characters",
    pitchMax: "Pitch must be at most 1000 characters",
    consentRequired: "You must agree before submitting",
    turnstileRequired: "Please complete the security check",
    invalidId: "Invalid registration id",
  },
  fr: {
    fullNameMin: "Le nom doit contenir au moins 2 caractères",
    fullNameMax: "Le nom doit contenir au plus 100 caractères",
    invalidEmail: "Entrez une adresse e-mail valide",
    emailMax: "L’e-mail doit contenir au plus 254 caractères",
    phoneInvalid:
      "Entrez un numéro de téléphone valide (7–20 chiffres ; espaces ou +()- autorisés)",
    companyMin: "Le nom de l’entreprise doit contenir au moins 2 caractères",
    companyMax: "Le nom de l’entreprise doit contenir au plus 120 caractères",
    sectorMin: "Le secteur doit contenir au moins 2 caractères",
    sectorMax: "Le secteur doit contenir au plus 80 caractères",
    countryMin: "Le pays doit contenir au moins 2 caractères",
    countryMax: "Le pays doit contenir au plus 80 caractères",
    pitchMin: "Le message doit contenir au moins 20 caractères",
    pitchMax: "Le message doit contenir au plus 1000 caractères",
    consentRequired: "Vous devez accepter avant d’envoyer",
    turnstileRequired: "Veuillez compléter la vérification de sécurité",
    invalidId: "Identifiant de candidature invalide",
  },
};

const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;

export const INTEREST_REGISTRATION_PAGE_SIZE = 10;
export const INTEREST_REGISTRATION_FULL_NAME_MAX = 100;
export const INTEREST_REGISTRATION_EMAIL_MAX = 254;
export const INTEREST_REGISTRATION_PHONE_MAX = 20;
export const INTEREST_REGISTRATION_COMPANY_MAX = 120;
export const INTEREST_REGISTRATION_SECTOR_MAX = 80;
export const INTEREST_REGISTRATION_COUNTRY_MAX = 80;
export const INTEREST_REGISTRATION_PITCH_MAX = 1000;

function registrationFieldsSchema(messages: InterestRegistrationMessages) {
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
    companyName: z
      .string()
      .trim()
      .min(2, messages.companyMin)
      .max(120, messages.companyMax),
    sector: z
      .string()
      .trim()
      .min(2, messages.sectorMin)
      .max(80, messages.sectorMax),
    country: z
      .string()
      .trim()
      .min(2, messages.countryMin)
      .max(80, messages.countryMax),
    pitch: z
      .string()
      .trim()
      .min(20, messages.pitchMin)
      .max(1000, messages.pitchMax),
  };
}

export function interestRegistrationSchemaFor(locale: Locale = DEFAULT_LOCALE) {
  const messages = VALIDATION_MESSAGES[locale];

  return z.object({
    ...registrationFieldsSchema(messages),
    consent: z.boolean().refine((value) => value === true, {
      message: messages.consentRequired,
    }),
    turnstileToken: z
      .string()
      .trim()
      .min(1, messages.turnstileRequired)
      .max(2048, messages.turnstileRequired),
  });
}

/** Default English schema for shared typing and unit tests. */
export const interestRegistrationSchema =
  interestRegistrationSchemaFor(DEFAULT_LOCALE);

export type InterestRegistrationInput = z.infer<
  typeof interestRegistrationSchema
>;

export const updateInterestRegistrationSchema = z.object({
  id: z.uuid(VALIDATION_MESSAGES.en.invalidId),
  ...registrationFieldsSchema(VALIDATION_MESSAGES.en),
});

export const deleteInterestRegistrationSchema = z.object({
  id: z.uuid(VALIDATION_MESSAGES.en.invalidId),
});

const interestRegistrationListQueryInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  search: z
    .string()
    .trim()
    .max(100, "Search must be 100 characters or fewer")
    .regex(/^[^,%_().]*$/, "Search contains unsupported characters")
    .catch(""),
});

export type InterestRegistrationListQuery = z.infer<
  typeof interestRegistrationListQueryInputSchema
> & {
  pageSize: typeof INTEREST_REGISTRATION_PAGE_SIZE;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseInterestRegistrationListQuery(
  input: RawSearchParams,
): InterestRegistrationListQuery {
  const parsed = interestRegistrationListQueryInputSchema.parse({
    page: first(input.page) ?? "1",
    search: first(input.search) ?? "",
  });

  return {
    ...parsed,
    pageSize: INTEREST_REGISTRATION_PAGE_SIZE,
  };
}

export type UpdateInterestRegistrationInput = z.infer<
  typeof updateInterestRegistrationSchema
>;
export type DeleteInterestRegistrationInput = z.infer<
  typeof deleteInterestRegistrationSchema
>;
