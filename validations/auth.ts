import { z } from "zod";

import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";

type AuthValidationMessages = {
  invalidEmail: string;
  passwordRequired: string;
  passwordMin: string;
  passwordLetter: string;
  passwordNumber: string;
  nameMin: string;
  nameMax: string;
  confirmRequired: string;
  passwordsMismatch: string;
};

const VALIDATION_MESSAGES: Record<Locale, AuthValidationMessages> = {
  en: {
    invalidEmail: "Enter a valid email address",
    passwordRequired: "Password is required",
    passwordMin: "Password must be at least 8 characters",
    passwordLetter: "Password must include a letter",
    passwordNumber: "Password must include a number",
    nameMin: "Name must be at least 2 characters",
    nameMax: "Name is too long",
    confirmRequired: "Confirm your password",
    passwordsMismatch: "Passwords do not match",
  },
  fr: {
    invalidEmail: "Entrez une adresse e-mail valide",
    passwordRequired: "Le mot de passe est requis",
    passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
    passwordLetter: "Le mot de passe doit contenir une lettre",
    passwordNumber: "Le mot de passe doit contenir un chiffre",
    nameMin: "Le nom doit contenir au moins 2 caractères",
    nameMax: "Le nom est trop long",
    confirmRequired: "Confirmez votre mot de passe",
    passwordsMismatch: "Les mots de passe ne correspondent pas",
  },
};

export function loginSchemaFor(locale: Locale = DEFAULT_LOCALE) {
  const messages = VALIDATION_MESSAGES[locale];

  return z.object({
    email: z.email(messages.invalidEmail).trim().toLowerCase(),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export function registerSchemaFor(locale: Locale = DEFAULT_LOCALE) {
  const messages = VALIDATION_MESSAGES[locale];

  return z
    .object({
      fullName: z
        .string()
        .trim()
        .min(2, messages.nameMin)
        .max(80, messages.nameMax),
      email: z.email(messages.invalidEmail).trim().toLowerCase(),
      password: z
        .string()
        .min(8, messages.passwordMin)
        .regex(/[A-Za-z]/, messages.passwordLetter)
        .regex(/[0-9]/, messages.passwordNumber),
      confirmPassword: z.string().min(1, messages.confirmRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ["confirmPassword"],
    });
}

/** Default English schemas for shared typing and unit tests. */
export const loginSchema = loginSchemaFor(DEFAULT_LOCALE);
export const registerSchema = registerSchemaFor(DEFAULT_LOCALE);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
