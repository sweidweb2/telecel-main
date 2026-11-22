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

/** Outcome of a Turnstile siteverify attempt. */
export type TurnstileVerifyResult =
  | { ok: true }
  | {
      ok: false;
      /** Challenge failed vs Cloudflare/config outage — only log the latter. */
      reason: "rejected" | "provider_error" | "misconfigured";
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
}): Promise<TurnstileVerifyResult> {
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
    return {
      ok: false,
      reason: hostnames.size === 0 || !secret ? "misconfigured" : "rejected",
    };
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
      return { ok: false, reason: "provider_error" };
    }

    result = (await response.json()) as TurnstileSiteverifyResponse;
  } catch {
    return { ok: false, reason: "provider_error" };
  }

  const accepted =
    result.success === true &&
    result.action === expectedAction &&
    typeof result.hostname === "string" &&
    hostnames.has(result.hostname);

  return accepted ? { ok: true } : { ok: false, reason: "rejected" };
}
