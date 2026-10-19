import { PortfolioPageContent } from "@/components/marketing/portfolio-page-content";
import { marketingCopyFor } from "@/constants/marketing-copy";
import { parsePortfolioPageParam } from "@/data/portfolio-startups";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "fr",
  path: "/portfolio",
  title: "Portefeuille — ASIP",
  description: "Découvrez les entreprises de l’écosystème ASIP.",
});

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parsePortfolioPageParam(params.page);

  return (
    <PortfolioPageContent
      locale="fr"
      copy={marketingCopyFor("fr", "portfolio")}
      page={page}
    />
  );
}
