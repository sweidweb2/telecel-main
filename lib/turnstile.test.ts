import { afterEach, describe, expect, it, vi } from "vitest";

import { verifyTurnstileToken } from "@/lib/turnstile";
import { TURNSTILE_CONTACT_ACTION } from "@/types/turnstile";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

describe("verifyTurnstileToken", () => {
  it("rejects empty tokens without calling siteverify", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "test-secret");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "localhost");
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as typeof fetch;

    await expect(
      verifyTurnstileToken({
        token: "",
        expectedAction: TURNSTILE_CONTACT_ACTION,
      }),
    ).resolves.toEqual({ ok: false, reason: "rejected" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports misconfigured when secret or hostnames are missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "");

    await expect(
      verifyTurnstileToken({
        token: "valid-token",
        expectedAction: TURNSTILE_CONTACT_ACTION,
      }),
    ).resolves.toEqual({ ok: false, reason: "misconfigured" });
  });

  it("accepts a successful siteverify response", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "test-secret");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "localhost,127.0.0.1");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        action: TURNSTILE_CONTACT_ACTION,
        hostname: "localhost",
      }),
    }) as typeof fetch;

    await expect(
      verifyTurnstileToken({
        token: "valid-token",
        expectedAction: TURNSTILE_CONTACT_ACTION,
        remoteip: "127.0.0.1",
      }),
    ).resolves.toEqual({ ok: true });
  });

  it("rejects when hostname is not allowlisted", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "test-secret");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "localhost");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        action: TURNSTILE_CONTACT_ACTION,
        hostname: "evil.example",
      }),
    }) as typeof fetch;

    await expect(
      verifyTurnstileToken({
        token: "valid-token",
        expectedAction: TURNSTILE_CONTACT_ACTION,
      }),
    ).resolves.toEqual({ ok: false, reason: "rejected" });
  });

  it("reports provider_error when siteverify HTTP fails", async () => {
    vi.stubEnv("TURNSTILE_SECRET", "test-secret");
    vi.stubEnv("TURNSTILE_HOSTNAMES", "localhost");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    }) as typeof fetch;

    await expect(
      verifyTurnstileToken({
        token: "valid-token",
        expectedAction: TURNSTILE_CONTACT_ACTION,
      }),
    ).resolves.toEqual({ ok: false, reason: "provider_error" });
  });
});
