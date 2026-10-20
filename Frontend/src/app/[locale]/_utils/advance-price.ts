/**
 * Advance plan price, ported 1:1 from the prototype's `window.KolavoHarga`
 * (Redesign/src/50-js-harga.html; rules in Redesign/PROMPT-HARGA.md, decided 6–17 Oct 2026):
 *
 *   members  : billed per multiple of 10, clamped to 30–1,000; every member pays the rate
 *   rate(n)  : 199 − ((n − 30) / 10 × 0.13)
 *   reviewers: Rp 15,000 for the first + Rp 3,000 per extra, per month
 *   discount : 1–5 months 0% · 6–23 months 5% · 24 months 10% (first purchase)
 *
 * Keep in sync with the backend's billing; the backend's number is the one charged.
 */
export const ADVANCE = {
  baseRate: 199,
  stepDown: 0.13,
  minMembers: 30,
  maxMembers: 1000,
  firstReviewer: 15_000,
  extraReviewer: 3_000,
  maxReviewers: 20
} as const

export interface AdvancePrice {
  /** Billed members (rounded up to 10, clamped). */
  members: number
  reviewers: number
  months: number
  /** Rupiah per member per month, may have decimals. */
  rate: number
  membersCost: number
  reviewersCost: number
  perMonth: number
  /** 0, 0.05 or 0.10. */
  discount: number
  discountAmount: number
  /** Whole rupiah for the full duration, after discount. */
  total: number
}

export function advancePrice(members: number, reviewers: number, months: number): AdvancePrice {
  const n = Math.min(ADVANCE.maxMembers, Math.max(ADVANCE.minMembers, Math.ceil(members / 10) * 10))
  const p = Math.max(1, Math.trunc(reviewers))
  const b = Math.max(1, Math.trunc(months))
  const rate = ADVANCE.baseRate - ((n - ADVANCE.minMembers) / 10) * ADVANCE.stepDown
  const membersCost = n * rate
  const reviewersCost = ADVANCE.firstReviewer + ADVANCE.extraReviewer * (p - 1)
  const perMonth = membersCost + reviewersCost
  const discount = b >= 24 ? 0.1 : b >= 6 ? 0.05 : 0
  const gross = perMonth * b

  return {
    members: n,
    reviewers: p,
    months: b,
    rate,
    membersCost,
    reviewersCost,
    perMonth,
    discount,
    discountAmount: gross * discount,
    total: Math.round(gross * (1 - discount))
  }
}
