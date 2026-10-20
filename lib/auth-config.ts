/** Google sign-in shows only once the provider is configured in Supabase Auth. */
export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
}

/** Absolute CMS session lifetime; mirrored in SQL by current_session_is_fresh(). */
export const SESSION_MAX_AGE_HOURS = 24;
