import { describe, expect, it } from "vitest";

import { approvedClaims, CLAIMS, type Claim } from "@/constants/evidence";

const base: Claim = {
  id: "x",
  label: "X",
  value: "42",
  source: "Annual report 2026",
  owner: "Ops",
  approved: true,
  reviewedAt: "2026-11-01",
};

describe("approvedClaims", () => {
  it("keeps approved, sourced, reviewed claims", () => {
    expect(approvedClaims([base])).toHaveLength(1);
  });

  it.each<[string, Partial<Claim>]>([
    ["unapproved", { approved: false }],
    ["empty value", { value: "  " }],
    ["no source", { source: "" }],
    ["never reviewed", { reviewedAt: null }],
  ])("drops %s claims", (_, patch) => {
    expect(approvedClaims([{ ...base, ...patch }])).toHaveLength(0);
  });

  it("ships no unapproved claim as public", () => {
    for (const claim of approvedClaims(CLAIMS)) {
      expect(claim.source).not.toBe("");
    }
  });
});
