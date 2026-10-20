import { z } from "zod";

import { newPasswordSchema, PASSWORD_MAX } from "@/validations/auth";

export const USER_ROLES = ["admin", "editor"] as const;
/** Fixed page size — not configurable via URL or UI. */
export const USER_PAGE_SIZE = 10;

export const USER_FULL_NAME_MIN = 2;
export const USER_FULL_NAME_MAX = 80;
export const USER_EMAIL_MAX = 254;
export const USER_PASSWORD_MAX = PASSWORD_MAX;

const fullNameSchema = z
  .string()
  .trim()
  .min(USER_FULL_NAME_MIN, "Full name must be at least 2 characters")
  .max(USER_FULL_NAME_MAX, "Full name must be 80 characters or fewer");

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(USER_EMAIL_MAX, "Email must be 254 characters or fewer")
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

const roleSchema = z.enum(USER_ROLES, "Choose a role");

/**
 * Admin sets a strong temporary password and shares it out of band; the user
 * changes it from the account menu (or uses "Forgot password" once SMTP is set).
 */
export const createUserSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: newPasswordSchema,
  role: roleSchema,
});

export const updateUserSchema = z.object({
  id: z.uuid("Invalid user id"),
  fullName: fullNameSchema,
  email: emailSchema,
  role: roleSchema,
  isActive: z.boolean(),
});

export const deleteUserSchema = z.object({
  id: z.uuid("Invalid user id"),
});

const userListQueryInputSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  search: z
    .string()
    .trim()
    .max(100, "Search must be 100 characters or fewer")
    .regex(/^[^,%_()]*$/, "Search contains unsupported characters")
    .catch(""),
  role: z.enum(["all", ...USER_ROLES]).catch("all"),
});

export type UserListQuery = z.infer<typeof userListQueryInputSchema> & {
  pageSize: typeof USER_PAGE_SIZE;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseUserListQuery(input: RawSearchParams): UserListQuery {
  const parsed = userListQueryInputSchema.parse({
    page: first(input.page) ?? "1",
    search: first(input.search) ?? "",
    role: first(input.role) ?? "all",
  });

  return {
    ...parsed,
    pageSize: USER_PAGE_SIZE,
  };
}

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
