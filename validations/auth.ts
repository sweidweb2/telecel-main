import { z } from "zod";

export const EMAIL_MAX = 254;
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(EMAIL_MAX, `Email must be ${EMAIL_MAX} characters or fewer`)
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

/** Shared strength rule for any password a person chooses or an admin sets. */
export const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password must be ${PASSWORD_MAX} characters or fewer`)
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(PASSWORD_MAX, `Password must be ${PASSWORD_MAX} characters or fewer`),
});

export const updatePasswordSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z
      .string()
      .min(1, "Confirm your password")
      .max(PASSWORD_MAX, `Password must be ${PASSWORD_MAX} characters or fewer`),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
