import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/admin/",
        "/login",
        "/signup",
        "/register",
        "/en/login",
        "/en/signup",
        "/fr/login",
        "/fr/signup",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
