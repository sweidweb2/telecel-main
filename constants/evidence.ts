/**
 * Verified claims registry (RFQ §4.3: no unsupported claims, metrics,
 * customers or coverage). Public pages read claims ONLY through
 * `approvedClaims`, so an entry renders once the client signs it off.
 */
export type Claim = {
  id: string;
  label: string;
  value: string;
  /** Where the number comes from (report, system, contract). */
  source: string;
  owner: string;
  approved: boolean;
  /** ISO date of the last review. */
  reviewedAt: string | null;
};

export const CLAIMS: readonly Claim[] = [
  {
    id: "countries",
    label: "Countries served",
    value: "",
    source: "",
    owner: "Telecel Global commercial",
    approved: false,
    reviewedAt: null,
  },
  {
    id: "carrier-partners",
    label: "Carrier partners",
    value: "",
    source: "",
    owner: "Telecel Global wholesale",
    approved: false,
    reviewedAt: null,
  },
];

/** Claims that may be shown publicly: approved, sourced and non-empty. */
export function approvedClaims(
  claims: readonly Claim[] = CLAIMS,
): readonly Claim[] {
  return claims.filter(
    (claim) =>
      claim.approved &&
      claim.value.trim() !== "" &&
      claim.source.trim() !== "" &&
      claim.reviewedAt !== null,
  );
}
