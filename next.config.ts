import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.untitledui.com",
      },
      {
        protocol: "https",
        hostname: "cdn.21st.dev",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/en/impact",
        destination: "/en/programme#impact",
        permanent: true,
      },
      {
        source: "/fr/impact",
        destination: "/fr/programme#impact",
        permanent: true,
      },
      {
        source: "/impact",
        destination: "/en/programme#impact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
