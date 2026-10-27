import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { absoluteUrl } from "@/lib/seo/site";

/** Production-only indexing: staging/UAT deployments must set NEXT_PUBLIC_ALLOW_INDEXING=false. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "false") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        `${ROUTES.dashboard}/`,
        "/auth/",
        "/api/",
        ROUTES.login,
        ROUTES.updatePassword,
        ROUTES.maintenance,
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
