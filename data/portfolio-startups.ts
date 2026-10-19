import { PORTFOLIO_STARTUPS } from "@/constants/portfolio-startups";
import type { Locale } from "@/constants/locales";
import type { PortfolioStartup } from "@/types/portfolio-startup";

export const PORTFOLIO_PAGE_SIZE = 6;

function toLocalizedStartup(
  record: (typeof PORTFOLIO_STARTUPS)[number],
  locale: Locale,
): PortfolioStartup {
  const copy = record[locale];
  return {
    id: record.id,
    slug: record.slug,
    imageUrl: record.imageUrl,
    name: copy.name,
    description: copy.description,
  };
}

export function getPortfolioStartupsPage(locale: Locale, page: number) {
  const total = PORTFOLIO_STARTUPS.length;
  const totalPages = Math.max(1, Math.ceil(total / PORTFOLIO_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PORTFOLIO_PAGE_SIZE;
  const items = PORTFOLIO_STARTUPS.slice(start, start + PORTFOLIO_PAGE_SIZE).map(
    (record) => toLocalizedStartup(record, locale),
  );

  return { items, total, totalPages, currentPage, pageSize: PORTFOLIO_PAGE_SIZE };
}

export function parsePortfolioPageParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
