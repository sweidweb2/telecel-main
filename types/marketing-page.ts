import type { PublicPageSlug } from "@/constants/public-pages";

export type AboutStoryFeatureIcon =
  | "rocket"
  | "trending-up"
  | "globe"
  | "heart";

export type AboutStoryStatIcon =
  | "rocket"
  | "users"
  | "map-pin"
  | "star";

export type AboutStoryCopy = {
  title: string;
  paragraphs: string[];
  eyebrow?: string;
  features?: {
    icon: AboutStoryFeatureIcon;
    title: string;
    description: string;
    slug?: PublicPageSlug;
    hash?: string;
    linkLabel?: string;
  }[];
  stats?: {
    icon: AboutStoryStatIcon;
    value: number;
    suffix?: string;
    label: string;
  }[];
  imageCta?: { slug: PublicPageSlug; label: string };
  bottomCta?: { title: string; slug: PublicPageSlug; label: string };
  statsNotice?: string;
};

export type AboutNarrativeBlockCopy = {
  title: string;
  paragraphs: string[];
  imageLabel: string;
};

export type MarketingContentSlug = Exclude<
  PublicPageSlug,
  "contact" | "insights" | "terms" | "privacy"
>;

export type LegalPageSlug = "terms" | "privacy";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  notice: string;
  sections: LegalSection[];
};

export type MarketingPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
  notice: string;
  sectionTitle: string;
  sectionDescription: string;
  cards: { title: string; description: string }[];
  cta?: { slug: PublicPageSlug; label: string; hash?: string };
  /** About page — partners logo cloud section. */
  partnersSection?: {
    eyebrow?: string;
    title: string;
    description?: string;
  };
  /** About page — story, vision, and mission narrative blocks. */
  aboutNarrative?: {
    story: AboutStoryCopy;
    vision: AboutNarrativeBlockCopy;
    mission: AboutNarrativeBlockCopy;
  };
  /** FAQ page — tabbed question groups below the scroller. */
  tabsSectionTitle?: string;
  tabsSectionDescription?: string;
  tabs?: {
    id: string;
    label: string;
    items: { title: string; description: string }[];
  }[];
  /** FAQ / portfolio — dedicated CTA block at the bottom. */
  ctaSection?: {
    title: string;
    description: string;
    slug: PublicPageSlug;
    label: string;
    hash?: string;
  };
  /** Programme page — impact metrics section. */
  impactSection?: {
    eyebrow?: string;
    title: string;
    description: string;
    notice?: string;
    cards: { title: string; description: string }[];
  };
};
