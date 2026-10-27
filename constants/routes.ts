export const ROUTES = {
  home: "/",
  insights: "/insights",
  contact: "/contact",
  maintenance: "/maintenance",

  login: "/login",
  updatePassword: "/update-password",
  authCallback: "/auth/callback",
  authConfirm: "/auth/confirm",
  signOut: "/auth/sign-out",

  dashboard: "/dashboard",
  blogs: "/dashboard/blogs",
  inquiries: "/dashboard/inquiries",
  users: "/dashboard/users",
  activityLog: "/dashboard/activity-log",
  errorLog: "/dashboard/error-log",
  settings: "/dashboard/settings",
  backups: "/dashboard/backups",
} as const;

/** Why the login page was reached; drives the notice shown above the form. */
export type LoginReason =
  | "session-expired"
  | "signed-out"
  | "no-access"
  | "auth-error"
  | "password-updated";

/** Insight detail path, e.g. `/insights/ux-review-presentations`. */
export function insightPath(slug: string): string {
  return `${ROUTES.insights}/${slug}`;
}

/** Login path carrying an optional post-login destination and notice. */
export function loginPath(options: { next?: string; reason?: LoginReason } = {}): string {
  const params = new URLSearchParams();
  if (options.next) params.set("next", options.next);
  if (options.reason) params.set("reason", options.reason);
  const query = params.toString();
  return query ? `${ROUTES.login}?${query}` : ROUTES.login;
}
