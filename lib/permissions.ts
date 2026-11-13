/**
 * Role / permission helpers for the CMS.
 * Nav gating lives in `constants/dashboard-nav`; session guards in `data/auth`.
 */
import {
  canAccessSection,
  type PortalSection,
} from "@/constants/dashboard-nav";
import type { UserRole } from "@/types/profile";

export type { UserRole };

export const ROLES = {
  admin: "admin",
  editor: "editor",
} as const satisfies Record<string, UserRole>;

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function isEditor(role: UserRole | null | undefined): boolean {
  return role === "editor" || role === "admin";
}

export function hasMinRole(
  role: UserRole | null | undefined,
  minRole: UserRole,
): boolean {
  if (!role) return false;
  if (minRole === "editor") return role === "editor" || role === "admin";
  return role === "admin";
}

/** Section visibility — same rules as the sidebar. */
export function canOpenSection(
  role: UserRole,
  section: Pick<PortalSection, "minRole">,
): boolean {
  return canAccessSection(role, section);
}
