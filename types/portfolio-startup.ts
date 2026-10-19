export type PortfolioStartupRecord = {
  id: string;
  slug: string;
  imageUrl: string;
  en: { name: string; description: string };
  fr: { name: string; description: string };
};

export type PortfolioStartup = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
  description: string;
};
