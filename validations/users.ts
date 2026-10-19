import { z } from "zod";

export const USER_ROLES = ["admin", "editor", "viewer"] as const;
/** Fixed page size — not configurable via URL or UI. */
export const USER_PAGE_SIZE = 10;

/** Create/edit forms always assign admin for now. */
export const USER_FORM_ROLE = "admin" as const;

export const USER_FULL_NAME_MIN = 2;
export const USER_FULL_NAME_MAX = 80;
export const USER_EMAIL_MAX = 254;
export const USER_PASSWORD_MIN = 8;
export const USER_PASSWORD_MAX = 128;
export const USER_DEFAULT_PASSWORD = "password";

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

const passwordSchema = z
  .string()
  .min(USER_PASSWORD_MIN, "Password must be at least 8 characters")
  .max(USER_PASSWORD_MAX, "Password must be 128 characters or fewer")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number");

const createPasswordSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? USER_DEFAULT_PASSWORD : value))
  .pipe(z.union([z.literal(USER_DEFAULT_PASSWORD), passwordSchema]));

const lockedAdminRoleSchema = z.literal(USER_FORM_ROLE);

export const createUserSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: createPasswordSchema,
  role: lockedAdminRoleSchema,
});

export const updateUserSchema = z.object({
  id: z.uuid("Invalid user id"),
  fullName: fullNameSchema,
  email: emailSchema,
  role: lockedAdminRoleSchema,
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
