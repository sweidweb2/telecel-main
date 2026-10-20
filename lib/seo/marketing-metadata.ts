import type { Metadata } from "next";

import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo/site";

type BuildMarketingMetadataInput = {
  /** Site path, e.g. `/services/cybersecurity` or `/`. */
  path: string;
  title: string;
  description: string;
  /** Absolute or root-relative image URL for OG/Twitter. */
  image?: string;
  ogType?: "website" | "article";
  /** Set when the CMS marks a page noindex. */
  noIndex?: boolean;
};

/** Canonical, Open Graph and Twitter metadata for a public page. */
export function buildMarketingMetadata({
  path,
  title,
  description,
  image,
  ogType = "website",
  noIndex = false,
}: BuildMarketingMetadataInput): Metadata {
  const imageUrl = image?.trim() || DEFAULT_OG_IMAGE;
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: "en_GB",
      url,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
