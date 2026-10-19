import { AboutNarrativeSplitSection } from "@/components/marketing/about-narrative-split-section";
import { AboutOurStorySection } from "@/components/marketing/about-our-story-section";
import type { Locale } from "@/constants/locales";
import type { MarketingPageCopy } from "@/types/marketing-page";

type AboutNarrative = NonNullable<
  MarketingPageCopy["aboutNarrative"]
>;

export function AboutNarrativeSections({
  locale,
  narrative,
}: {
  locale: Locale;
  narrative: AboutNarrative;
}) {
  return (
    <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
      <AboutOurStorySection locale={locale} story={narrative.story} />
      <AboutNarrativeSplitSection
        id="vision"
        title={narrative.vision.title}
        paragraphs={narrative.vision.paragraphs}
        imagePosition="right"
        imageVariant="vision"
        imageLabel={narrative.vision.imageLabel}
      />
      <AboutNarrativeSplitSection
        id="mission"
        title={narrative.mission.title}
        paragraphs={narrative.mission.paragraphs}
        imagePosition="left"
        imageVariant="mission"
        imageLabel={narrative.mission.imageLabel}
      />
    </div>
  );
}
