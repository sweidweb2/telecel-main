import { z } from "zod";

import {
  EMAIL_MAX,
  newPasswordSchema,
  PASSWORD_MAX,
} from "@/validations/auth";
import {
  parseAdminListQuery,
  USER_LIST_PAGE_SIZE,
  type AdminPageSize,
  type RawSearchParams,
} from "@/validations/admin-list-query";

export const USER_ROLES = ["admin", "editor"] as const;
/** Default users page size (overridable via URL `limit`: 10 | 20 | 50). */
export const USER_PAGE_SIZE = USER_LIST_PAGE_SIZE;

export const USER_FULL_NAME_MIN = 2;
export const USER_FULL_NAME_MAX = 80;
export const USER_EMAIL_MAX = EMAIL_MAX;
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
  .max(USER_EMAIL_MAX, `Email must be ${USER_EMAIL_MAX} characters or fewer`)
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

const roleSchema = z.enum(USER_ROLES, "Choose a role");

/**
 * Admin sets a strong temporary password and shares it out of band; the user
 * changes it from the account menu (Contact form is the public password-help path).
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

const roleFilterSchema = z.enum(["all", ...USER_ROLES]).catch("all");

export type UserListQuery = {
  page: number;
  search: string;
  role: z.infer<typeof roleFilterSchema>;
  pageSize: AdminPageSize;
};

export function parseUserListQuery(input: RawSearchParams): UserListQuery {
  const base = parseAdminListQuery(input, USER_LIST_PAGE_SIZE);
  const role = roleFilterSchema.parse(
    Array.isArray(input.role) ? input.role[0] : (input.role ?? "all"),
  );

  return {
    ...base,
    role,
  };
}

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
