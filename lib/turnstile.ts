import { TURNSTILE_CONTACT_ACTION } from "@/types/turnstile";

export { TURNSTILE_CONTACT_ACTION };

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TOKEN_MAX_LENGTH = 2048;
const SITEVERIFY_TIMEOUT_MS = 10_000;

type TurnstileSiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function expectedHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );
}

/**
 * Verifies a Turnstile token via Cloudflare siteverify.
 * Requires `TURNSTILE_SECRET` and a non-empty `TURNSTILE_HOSTNAMES` allowlist.
 */
export async function verifyTurnstileToken(options: {
  token: string;
  expectedAction: string;
  remoteip?: string;
}): Promise<boolean> {
  const { token, expectedAction, remoteip } = options;
  const hostnames = expectedHostnames();
  const secret = process.env.TURNSTILE_SECRET;

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > TOKEN_MAX_LENGTH ||
    hostnames.size === 0 ||
    !secret
  ) {
    return false;
  }

  let result: TurnstileSiteverifyResponse;
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (remoteip && remoteip !== "unknown") {
      body.set("remoteip", remoteip);
    }

    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
      body,
    });

    if (!response.ok) {
      return false;
    }

    result = (await response.json()) as TurnstileSiteverifyResponse;
  } catch {
    return false;
  }

  return (
    result.success === true &&
    result.action === expectedAction &&
    typeof result.hostname === "string" &&
    hostnames.has(result.hostname)
  );
}
