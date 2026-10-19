import { beforeEach, describe, expect, it } from "vitest";

import {
  consumeRateLimit,
  isRateLimited,
  recordRateLimitHit,
  resetRateLimitBuckets,
} from "@/lib/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it("allows up to the limit then blocks", () => {
    const key = "test:key";
    const windowMs = 60_000;
    expect(consumeRateLimit(key, 2, windowMs, 1_000)).toBe(true);
    expect(consumeRateLimit(key, 2, windowMs, 1_001)).toBe(true);
    expect(consumeRateLimit(key, 2, windowMs, 1_002)).toBe(false);
  });

  it("peek does not record hits", () => {
    const key = "test:peek";
    expect(isRateLimited(key, 1, 60_000, 1_000)).toBe(false);
    expect(isRateLimited(key, 1, 60_000, 1_000)).toBe(false);
    recordRateLimitHit(key, 60_000, 1_000);
    expect(isRateLimited(key, 1, 60_000, 1_001)).toBe(true);
  });

  it("expires hits outside the window", () => {
    const key = "test:expire";
    expect(consumeRateLimit(key, 1, 1_000, 0)).toBe(true);
    expect(consumeRateLimit(key, 1, 1_000, 1_001)).toBe(true);
  });
});
