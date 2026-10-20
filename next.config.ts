import { existsSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

/**
 * Official Telecel artwork is confidential (RFQ: no publishing brand assets
 * without written approval) and this repo is public, so it is git-ignored.
 * `npm run brand:extract` copies it from the RFQ in docs/client/; without it
 * the UI falls back to a neutral text lockup.
 */
const hasBrandLogo = existsSync(
  path.join(process.cwd(), "public", "brand", "telecel-wordmark.png")
);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HAS_BRAND_LOGO: hasBrandLogo ? "true" : "false",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
