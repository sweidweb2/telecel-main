import type { LoginReason } from "@/constants/routes";

/** Notice shown above the login form for each `?reason=`. */
export const LOGIN_REASON_NOTICES: Record<
  LoginReason,
  { tone: "info" | "error"; message: string }
> = {
  "session-expired": {
    tone: "info",
    message: "Your session expired after 24 hours. Sign in again to continue.",
  },
  "signed-out": { tone: "info", message: "You have been signed out." },
  "no-access": {
    tone: "error",
    message:
      "Your account does not have access to the Telecel Global CMS. Ask an administrator to grant you a role.",
  },
  "auth-error": {
    tone: "error",
    message:
      "We could not sign you in with that link or account. Links expire after 1 hour and work once; Google sign-in only works for invited accounts.",
  },
  "password-updated": {
    tone: "info",
    message: "Password updated. Sign in with your new password.",
  },
};

export function loginReasonNotice(value: string | string[] | undefined) {
  const key = Array.isArray(value) ? value[0] : value;
  return key && key in LOGIN_REASON_NOTICES
    ? LOGIN_REASON_NOTICES[key as LoginReason]
    : null;
}
