import type { FaqSectionData } from "@/components/ui/habit-faq-scroller";
import type { MarketingPageCopy } from "@/types/marketing-page";

const ROW_CONFIG = [
  { id: "row1", speed: "60s", direction: "left" as const },
  { id: "row2", speed: "45s", direction: "right" as const },
  { id: "row3", speed: "70s", direction: "left" as const },
];

/** Splits FAQ cards into three horizontal scroller rows (2 items each). */
export function buildFaqScrollerData(copy: MarketingPageCopy): FaqSectionData {
  const items = copy.cards.map((card, index) => ({
    id: `faq-${index + 1}`,
    question: card.title,
    answer: card.description,
  }));

  const chunkSize = Math.ceil(items.length / ROW_CONFIG.length);
  const rows = ROW_CONFIG.map((config, rowIndex) => ({
    ...config,
    faqItems: items.slice(rowIndex * chunkSize, (rowIndex + 1) * chunkSize),
  })).filter((row) => row.faqItems.length > 0);

  return {
    mainTitle: copy.sectionTitle,
    mainSubtitle: copy.sectionDescription,
    rows,
  };
}
