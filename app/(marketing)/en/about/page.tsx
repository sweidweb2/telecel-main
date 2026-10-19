import { AboutPageContent } from "@/components/marketing/about-page-content";
import { marketingCopyFor } from "@/constants/marketing-copy";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildMarketingMetadata({
  locale: "en",
  path: "/about",
  title: "About ASIP",
  description: "Learn about ASIP’s purpose, direction, and ecosystem partners.",
});

export default function Page() {
  return <AboutPageContent locale="en" copy={marketingCopyFor("en", "about")} />;
}
