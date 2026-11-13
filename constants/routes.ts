export const ROUTES = {
  home: "/",
  platform: "/platform",
  services: "/services",
  solutions: "/solutions",
  useCases: "/use-cases",
  whyTelecelGlobal: "/why-telecel-global",
  leadership: "/why-telecel-global/leadership",
  insights: "/insights",
  caseStudies: "/insights/case-studies",
  contact: "/contact",
  privacy: "/privacy",
  cookies: "/cookies",
  terms: "/terms",
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

export const SERVICE_ROUTES = {
  cloudDataCentre: "/services/cloud-data-centre",
  cybersecurity: "/services/cybersecurity",
  iotDigitalServices: "/services/iot-digital-services",
  networkEnterpriseConnectivity: "/services/network-enterprise-connectivity",
  interactionsVoiceMessaging: "/services/interactions-voice-messaging",
} as const;

export const SOLUTION_ROUTES = {
  mobileOperators: "/solutions/mobile-operators",
  enterprises: "/solutions/enterprises",
  governmentsInstitutions: "/solutions/governments-institutions",
  wholesaleAggregators: "/solutions/wholesale-aggregators",
} as const;

export const USE_CASE_ROUTES = {
  growInternationalRevenue: "/use-cases/grow-international-revenue",
  modernizeCustomerEngagement: "/use-cases/modernize-customer-engagement",
  secureMessagingTraffic: "/use-cases/secure-messaging-traffic",
  scaleAcrossMarkets: "/use-cases/scale-across-markets",
  buildResilientInfrastructure: "/use-cases/build-resilient-infrastructure",
  launchNewDigitalServices: "/use-cases/launch-new-digital-services",
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
export function loginPath(
  options: { next?: string; reason?: LoginReason } = {},
): string {
  const params = new URLSearchParams();
  if (options.next) params.set("next", options.next);
  if (options.reason) params.set("reason", options.reason);
  const query = params.toString();
  return query ? `${ROUTES.login}?${query}` : ROUTES.login;
}
