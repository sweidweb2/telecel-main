export const ROUTES = {
  home: "/",
  insights: "/insights",
  contact: "/contact",

  login: "/login",
  forgotPassword: "/forgot-password",
  updatePassword: "/update-password",
  authCallback: "/auth/callback",
  authConfirm: "/auth/confirm",
  signOut: "/auth/sign-out",

  dashboard: "/dashboard",
  pages: "/dashboard/pages",
  services: "/dashboard/services",
  solutions: "/dashboard/solutions",
  useCases: "/dashboard/use-cases",
  blogs: "/dashboard/blogs",
  caseStudies: "/dashboard/case-studies",
  leadership: "/dashboard/leadership",
  partners: "/dashboard/partners",
  ctas: "/dashboard/ctas",
  media: "/dashboard/media",
  inquiries: "/dashboard/inquiries",
  seo: "/dashboard/seo",
  users: "/dashboard/users",
  formRouting: "/dashboard/form-routing",
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
