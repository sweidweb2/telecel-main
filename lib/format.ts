import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

const DEFAULT_LOCALE = "en-GB";

function toDate(value: Date | string | number): Date | null {
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(date) ? date : null;
}

/** Short date: `13 Nov 2026`. */
export function formatDate(
  value: Date | string | number,
  pattern = "d MMM yyyy",
): string {
  const date = toDate(value);
  return date ? format(date, pattern) : "—";
}

/** Date + time: `13 Nov 2026 21:48`. */
export function formatDateTime(
  value: Date | string | number,
  pattern = "dd MMM yyyy HH:mm",
): string {
  const date = toDate(value);
  return date ? format(date, pattern) : "—";
}

/** Relative time: `3 hours ago`. */
export function formatRelative(value: Date | string | number): string {
  const date = toDate(value);
  return date ? formatDistanceToNowStrict(date, { addSuffix: true }) : "—";
}

/** Currency with en-GB defaults (GBP unless overridden). */
export function formatCurrency(
  amount: number,
  currency = "GBP",
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Compact number: `1.2K`. */
export function formatNumber(value: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}
