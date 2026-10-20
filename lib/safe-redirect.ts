import { ROUTES } from "@/constants/routes";

/** Only these in-app areas may be used as a post-auth destination. */
const ALLOWED_PREFIXES = [ROUTES.dashboard, ROUTES.updatePassword] as const;

const PARSE_BASE = "http://local.invalid";

/**
 * Validates an untrusted `next` value (query param, form field) and returns a
 * same-origin path inside an allowed area, or `fallback`.
 *
 * Rejects protocol-relative (`//evil`), backslash (`/\evil`, which browsers
 * treat as `//evil`), encoded variants, control characters and anything that
 * resolves to another origin.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback: string = ROUTES.dashboard
): string {
  if (!value || value.length > 2048) return fallback;

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }

  for (const candidate of [value, decoded]) {
    if (!candidate.startsWith("/") || candidate.startsWith("//")) return fallback;
    if (candidate.includes("\\")) return fallback;
    if (/[\u0000-\u001f\u007f]/.test(candidate)) return fallback;
  }

  let url: URL;
  try {
    url = new URL(value, PARSE_BASE);
  } catch {
    return fallback;
  }
  if (url.origin !== PARSE_BASE) return fallback;

  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  );
  if (!allowed) return fallback;

  return `${url.pathname}${url.search}${url.hash}`;
}
