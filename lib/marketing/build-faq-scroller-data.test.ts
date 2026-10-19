import { describe, expect, it } from "vitest";

import { buildFaqScrollerData } from "@/lib/marketing/build-faq-scroller-data";
import type { MarketingPageCopy } from "@/types/marketing-page";

const faqCopy: MarketingPageCopy = {
  eyebrow: "FAQ",
  title: "FAQ",
  description: "Desc",
  notice: "Notice",
  sectionTitle: "Questions",
  sectionDescription: "Answers",
  cards: [
    { title: "Q1", description: "A1" },
    { title: "Q2", description: "A2" },
    { title: "Q3", description: "A3" },
    { title: "Q4", description: "A4" },
    { title: "Q5", description: "A5" },
    { title: "Q6", description: "A6" },
  ],
};

describe("buildFaqScrollerData", () => {
  it("maps section copy and splits cards into scroller rows", () => {
    const data = buildFaqScrollerData(faqCopy);

    expect(data.mainTitle).toBe("Questions");
    expect(data.mainSubtitle).toBe("Answers");
    expect(data.rows).toHaveLength(3);
    expect(data.rows[0]?.faqItems).toHaveLength(2);
    expect(data.rows[0]?.faqItems[0]).toEqual({
      id: "faq-1",
      question: "Q1",
      answer: "A1",
    });
    expect(data.rows[2]?.faqItems[1]?.question).toBe("Q6");
  });
});
